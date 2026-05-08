"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Bell, Menu, X, Crown, LogOut, ChevronDown, Users } from "lucide-react";
import { useUser } from "@/context/UserContext";

interface NavbarProps {
  alertCount: number;
  onAlertClick: () => void;
  liveStatus?: "loading" | "live" | "offline";
}

const TIER_BADGES = {
  free: { label: "Free", color: "bg-gray-100 text-gray-600" },
  pro: { label: "Pro", color: "bg-indigo-100 text-indigo-700" },
  bisnis: { label: "Bisnis", color: "bg-amber-100 text-amber-700" },
};

export default function Navbar({ alertCount, onAlertClick, liveStatus = "live" }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { user, isLoggedIn, tier, logout, authLoading } = useUser();
  const pathname = usePathname();
  const router = useRouter();

  const isHome = pathname === "/";

  // Helper for scroll links if on home, or navigate to home then scroll
  const handleScrollTo = (id: string) => {
    if (isHome) {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    } else {
      router.push("/");
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-green-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <img 
              src="/images/logo.jpeg" 
              alt="AgriSight Logo" 
              className="w-10 h-10 rounded-xl object-cover shadow-sm shadow-green-200/50" 
            />
            <div className="flex flex-col leading-none">
              <span className="text-lg font-black text-gray-900 tracking-tight">
                Agri<span className="text-green-600">Sight</span>
              </span>
              <span className="text-[10px] text-gray-400 font-medium tracking-wide uppercase">Smart Price Tracker</span>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            <button onClick={() => handleScrollTo("dashboard")} className="text-sm font-medium text-gray-600 hover:text-green-600 transition-colors cursor-pointer">Dashboard</button>
            <button onClick={() => handleScrollTo("recommendation")} className="text-sm font-medium text-gray-600 hover:text-green-600 transition-colors cursor-pointer">Recommendation</button>
            <Link href="/pricing" className="text-sm font-medium text-gray-600 hover:text-green-600 transition-colors">Pricing</Link>
            <button onClick={() => handleScrollTo("alerts")} className="text-sm font-medium text-gray-600 hover:text-green-600 transition-colors cursor-pointer">Alert</button>
            <button onClick={() => handleScrollTo("about")} className="text-sm font-medium text-gray-600 hover:text-green-600 transition-colors cursor-pointer">About</button>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Data source badge */}
            <div className={`hidden lg:flex items-center gap-1.5 border rounded-full px-3 py-1 
              ${liveStatus === "live" ? "bg-green-50 border-green-200" : "bg-amber-50 border-amber-200"}`}>
              {liveStatus === "live" ? (
                <>
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-xs font-semibold text-green-700">Live Data (PIHPS)</span>
                </>
              ) : (
                <>
                  <div className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
                  <span className="text-xs font-semibold text-amber-700">Data Offline</span>
                </>
              )}
            </div>

            {/* Alert bell */}
            <button
              onClick={onAlertClick}
              className="relative w-9 h-9 flex items-center justify-center rounded-xl hover:bg-green-50 transition-colors"
            >
              <Bell className="w-5 h-5 text-gray-600" />
              {alertCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full text-[9px] font-bold text-white flex items-center justify-center">
                  {alertCount}
                </span>
              )}
            </button>

            {/* Auth area */}
            {authLoading ? (
              <div className="flex items-center gap-2 px-2 py-1">
                <div className="w-8 h-8 rounded-xl bg-gray-100 animate-pulse" />
                <div className="hidden sm:block w-24 h-5 rounded-md bg-gray-100 animate-pulse ml-1" />
              </div>
            ) : isLoggedIn ? (
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 bg-gray-50 hover:bg-gray-100 rounded-xl px-3 py-2 transition-colors"
                >
                  <div className="w-7 h-7 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center text-white text-xs font-bold">
                    {user?.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-xs font-bold text-gray-900 leading-tight">{user?.name}</p>
                    <p className={`text-[10px] font-semibold ${TIER_BADGES[tier].color} px-1 rounded`}>
                      {TIER_BADGES[tier].label}
                    </p>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                </button>

                {/* Profile dropdown */}
                {profileOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
                    <div className="absolute right-0 top-12 w-56 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 overflow-hidden">
                      <div className="px-4 py-3 border-b border-gray-50">
                        <p className="text-sm font-bold text-gray-900">{user?.name}</p>
                        <p className="text-xs text-gray-400">{user?.email}</p>
                        <span className={`inline-block text-[10px] font-bold mt-1 px-2 py-0.5 rounded-full ${TIER_BADGES[tier].color}`}>
                          Paket {TIER_BADGES[tier].label}
                        </span>
                      </div>
                      {tier === "free" && (
                        <Link
                          href="/pricing"
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-2 px-4 py-3 text-sm text-indigo-600 hover:bg-indigo-50 font-semibold transition-colors"
                        >
                          <Crown className="w-4 h-4" />
                          Upgrade ke Pro
                        </Link>
                      )}
                      {tier === "bisnis" && user?.role === "owner" && (
                        <button
                          onClick={() => { setProfileOpen(false); handleScrollTo("dashboard"); }}
                          className="w-full flex items-center gap-2 px-4 py-3 text-sm text-amber-600 hover:bg-amber-50 font-semibold transition-colors text-left"
                        >
                          <Users className="w-4 h-4" />
                          Manajemen Tim
                        </button>
                      )}
                      <button
                        onClick={() => { logout(); setProfileOpen(false); }}
                        className="flex items-center gap-2 px-4 py-3 text-sm text-red-500 hover:bg-red-50 w-full text-left font-medium transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Keluar
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => router.push("/auth?tab=login")}
                  className="hidden sm:block text-sm font-semibold text-gray-600 hover:text-green-600 transition-colors px-3 py-2 cursor-pointer"
                >
                  Masuk
                </button>
                <button
                  onClick={() => router.push("/auth?tab=register")}
                  className="text-sm font-bold bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-xl transition-all shadow-md shadow-green-600/20 cursor-pointer"
                >
                  Daftar Gratis
                </button>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden w-9 h-9 flex items-center justify-center rounded-xl hover:bg-green-50 transition-colors"
            >
              {mobileOpen ? <X className="w-5 h-5 text-gray-600" /> : <Menu className="w-5 h-5 text-gray-600" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-green-100 bg-white px-4 py-4 space-y-2">
          {["Dashboard", "Recommendation", "Pricing", "Alerts", "About"].map((item) => {
            if (item === "Pricing") {
              return (
                <Link
                  key={item}
                  href="/pricing"
                  onClick={() => setMobileOpen(false)}
                  className="block px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors"
                >
                  {item}
                </Link>
              );
            }
            return (
              <button
                key={item}
                onClick={() => {
                  setMobileOpen(false);
                  handleScrollTo(item.toLowerCase());
                }}
                className="w-full text-left block px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors"
              >
                {item}
              </button>
            );
          })}
        </div>
      )}
    </nav>
  );
}
