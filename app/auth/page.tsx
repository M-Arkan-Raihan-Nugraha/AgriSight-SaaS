"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Mail, Lock, User, ArrowRight, ArrowLeft } from "lucide-react";
import { auth, db } from "@/lib/firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, sendPasswordResetEmail, signInWithRedirect, getRedirectResult, onAuthStateChanged } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

function AuthForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [tab, setTab] = useState<"login" | "register" | "forgot-password">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Redirect if already logged in
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && !loading) {
        router.push("/");
      }
    });

    const tabParam = searchParams.get("tab");
    if (tabParam === "login" || tabParam === "register") {
      setTab(tabParam);
    }

    // Handle Google Redirect Result
    const handleRedirect = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result) {
          setLoading(true);
          const userDocRef = doc(db, "users", result.user.uid);
          const userDoc = await getDoc(userDocRef);
          if (!userDoc.exists()) {
            await setDoc(userDocRef, {
              name: result.user.displayName || result.user.email?.split("@")[0] || "AgriSight User",
              email: result.user.email, tier: "free", role: "owner",
              createdAt: new Date().toISOString(),
            });
          }
          router.push("/");
        }
      } catch (error: any) {
        console.error("Redirect Auth Error:", error);
        // Only show toast if it's a real error, not just a cancelled redirect
        if (error.code !== "auth/cancelled-popup-request") {
          toast.error("Gagal masuk dengan Google via Redirect");
        }
      } finally {
        setLoading(false);
      }
    };
    handleRedirect();

    return () => unsubscribe();
  }, [searchParams, router, loading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (tab === "register") {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await setDoc(doc(db, "users", userCredential.user.uid), {
          name: name || email.split("@")[0],
          email, tier: "free", role: "owner",
          createdAt: new Date().toISOString(),
        });
        toast.success("Akun berhasil dibuat!");
      } else if (tab === "login") {
        await signInWithEmailAndPassword(auth, email, password);
        toast.success("Selamat datang kembali!");
      } else if (tab === "forgot-password") {
        await sendPasswordResetEmail(auth, email);
        toast.success("Link reset password telah dikirim ke email Anda!");
        setTab("login");
      }
      if (tab !== "forgot-password") {
        router.push("/");
      }
    } catch (error: any) {
      let msg = "Terjadi kesalahan saat autentikasi.";
      if (error?.code === "auth/invalid-credential" || error?.code === "auth/wrong-password" || error?.code === "auth/user-not-found") {
        msg = "Email atau password yang Anda masukkan salah.";
      } else if (error?.code === "auth/email-already-in-use") {
        msg = "Email ini sudah terdaftar. Silakan masuk.";
      } else if (error?.code === "auth/weak-password") {
        msg = "Password terlalu lemah, minimal 6 karakter.";
      } else if (error instanceof Error) {
        msg = error.message;
      }
      toast.error("Gagal autentikasi", { description: msg });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      // Use redirect instead of popup to avoid "popup-blocked" errors in production/mobile
      await signInWithRedirect(auth, provider);
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Gagal masuk dengan Google.";
      console.error("Google Auth Error:", error);
      toast.error("Gagal masuk dengan Google", { description: msg });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative">
      <button onClick={() => router.push("/")} className="absolute top-6 left-6 sm:top-8 sm:left-8 flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-green-600 transition-colors">
        <ArrowLeft className="w-4 h-4" />Kembali
      </button>

      <div className="sm:mx-auto sm:w-full sm:max-w-md mt-8 sm:mt-0">
        <div className="flex justify-center cursor-pointer" onClick={() => router.push("/")}>
          <img src="/images/logo.jpeg" alt="AgriSight Logo" className="w-16 h-16 rounded-2xl object-cover shadow-md shadow-green-200/50" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-black tracking-tight text-gray-900">
          {tab === "login" ? "Selamat Datang Kembali" : "Mulai Bersama AgriSight"}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          {tab === "login" ? "Masuk untuk melihat update harga terbaru" : "Buat akun gratis untuk mendapatkan rekomendasi pintar"}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="py-8 px-4 sm:px-10 sm:rounded-3xl border-border/50 shadow-xl">
          <div className="flex bg-gray-50 rounded-xl overflow-hidden mb-8 p-1">
            <button onClick={() => setTab("login")} className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${tab === "login" || tab === "forgot-password" ? "bg-white text-green-700 shadow-sm" : "text-gray-400 hover:text-gray-600"}`}>Masuk</button>
            <button onClick={() => setTab("register")} className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${tab === "register" ? "bg-white text-green-700 shadow-sm" : "text-gray-400 hover:text-gray-600"}`}>Daftar</button>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {tab === "forgot-password" ? (
              <div className="text-center mb-4">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Lupa Password?</h3>
                <p className="text-sm text-gray-500">Masukkan email Anda untuk menerima link reset password.</p>
              </div>
            ) : null}
            {tab === "register" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><User className="h-5 w-5 text-gray-400" /></div>
                  <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-xl focus:ring-green-500 focus:border-green-500 text-sm" placeholder="Budi Santoso" />
                </div>
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Alamat Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Mail className="h-5 w-5 text-gray-400" /></div>
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-xl focus:ring-green-500 focus:border-green-500 text-sm" placeholder="budi@example.com" />
              </div>
            </div>
            {tab !== "forgot-password" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Lock className="h-5 w-5 text-gray-400" /></div>
                  <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="block w-full pl-10 pr-10 py-2 border border-gray-200 rounded-xl focus:ring-green-500 focus:border-green-500 text-sm" placeholder="Minimal 6 karakter" />
                </div>
                {tab === "login" && (
                  <div className="flex justify-end mt-2">
                    <button type="button" onClick={() => setTab("forgot-password")} className="text-xs font-semibold text-green-600 hover:text-green-500">
                      Lupa password?
                    </button>
                  </div>
                )}
              </div>
            )}
            <Button type="submit" disabled={loading} size="lg" className="w-full bg-green-600 hover:bg-green-500 text-white font-bold rounded-xl shadow-md cursor-pointer">
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : tab === "login" ? (
                <>Masuk <ArrowRight className="w-4 h-4" /></>
              ) : tab === "forgot-password" ? (
                <>Kirim Link Reset <ArrowRight className="w-4 h-4" /></>
              ) : (
                <>Buat Akun <ArrowRight className="w-4 h-4" /></>
              )}
            </Button>
            {tab === "forgot-password" && (
              <button type="button" onClick={() => setTab("login")} className="w-full text-center text-sm font-bold text-gray-500 hover:text-gray-700 transition-colors">
                Kembali ke Login
              </button>
            )}
          </form>

          <div className="mt-6">
            <div className="relative flex items-center justify-center">
              <Separator className="flex-1" />
              <span className="px-3 text-sm text-muted-foreground">Atau lanjutkan</span>
              <Separator className="flex-1" />
            </div>
            <div className="mt-6">
              <Button variant="outline" onClick={handleGoogleLogin} disabled={loading} className="w-full font-bold rounded-xl cursor-pointer" size="lg">
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5 mr-3" />
                Masuk dengan Google
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="w-12 h-12 border-4 border-green-200 border-t-green-600 rounded-full animate-spin" /></div>}>
      <AuthForm />
    </Suspense>
  );
}
