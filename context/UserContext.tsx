"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, onSnapshot, getDoc, setDoc } from "firebase/firestore";

// Move cache and helper outside component to avoid remount resets
const userDocCache = new Set<string>();

async function ensureUserDoc(user: any) {
  if (!user || userDocCache.has(user.uid)) return;

  try {
    const userDocRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userDocRef);
    if (!userDoc.exists()) {
      await setDoc(userDocRef, {
        name: user.displayName || user.email?.split("@")[0] || "AgriSight User",
        email: user.email,
        tier: "free",
        role: "owner",
        createdAt: new Date().toISOString(),
      });
    }
    userDocCache.add(user.uid);
  } catch (err) {
    console.error("ensureUserDoc error:", err);
  }
}

// ─── Types ───
export type UserTier = "free" | "pro" | "bisnis";

export interface User {
  uid: string;
  name: string;
  email: string;
  tier: UserTier;
  role: "owner" | "member";
  parentUserId?: string;
  avatar?: string;
}

interface UserContextType {
  user: User | null;
  isLoggedIn: boolean;
  tier: UserTier;
  logout: () => Promise<void>;
  showUpgradeModal: boolean;
  setShowUpgradeModal: (show: boolean) => void;
  isPremiumFeature: (feature: PremiumFeature) => boolean;
  authLoading: boolean;
}

export type PremiumFeature =
  | "supply_chain_margin"
  | "pasar_tradisional"
  | "pasar_modern"
  | "pedagang_besar"
  | "whatsapp_alert"
  | "historical_data"
  | "all_regions"
  | "api_access"
  | "export_data"
  | "multi_user";

// Feature → minimum tier mapping
const FEATURE_TIERS: Record<PremiumFeature, UserTier> = {
  supply_chain_margin: "pro",
  pasar_tradisional: "pro",
  pasar_modern: "pro",
  pedagang_besar: "pro",
  whatsapp_alert: "pro",
  historical_data: "pro",
  all_regions: "pro",
  api_access: "bisnis",
  export_data: "bisnis",
  multi_user: "bisnis",
};

const TIER_LEVEL: Record<UserTier, number> = { free: 0, pro: 1, bisnis: 2 };

const UserContext = createContext<UserContextType | null>(null);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  useEffect(() => {
    let unsubscribeSnapshot: () => void;

    const unsubscribeAuth = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        // Asynchronously ensure user doc exists without blocking UI update
        ensureUserDoc(firebaseUser).catch(console.error);

        // Listen to Firestore doc
        const userDocRef = doc(db, "users", firebaseUser.uid);
        unsubscribeSnapshot = onSnapshot(userDocRef, (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            setUser({
              uid: firebaseUser.uid,
              name: data.name || "User",
              email: firebaseUser.email || "",
              tier: data.tier || "free",
              role: data.role || "owner",
              parentUserId: data.parentUserId,
            });
          } else {
            // Jika dokumen Firestore gagal dibuat (misal karena error rules sebelumnya),
            // tetap izinkan login dengan status free.
            setUser({
              uid: firebaseUser.uid,
              name: firebaseUser.displayName || firebaseUser.email?.split("@")[0] || "User",
              email: firebaseUser.email || "",
              tier: "free",
              role: "owner",
            });
          }
          setAuthLoading(false);
        });
      } else {
        setUser(null);
        if (unsubscribeSnapshot) unsubscribeSnapshot();
        setAuthLoading(false);
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeSnapshot) unsubscribeSnapshot();
    };
  }, []);

  const tier = user?.tier || "free";

  const logout = async () => {
    await signOut(auth);
  };

  const isPremiumFeature = (feature: PremiumFeature): boolean => {
    const requiredTier = FEATURE_TIERS[feature];
    return TIER_LEVEL[tier] >= TIER_LEVEL[requiredTier];
  };

  return (
    <UserContext.Provider
      value={{
        user, isLoggedIn: !!user, tier, logout,
        showUpgradeModal, setShowUpgradeModal,
        isPremiumFeature,
        authLoading,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used within UserProvider");
  return ctx;
}
