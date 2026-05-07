"use client";

import { useState, useEffect, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { UserProvider, useUser } from "@/context/UserContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import UpgradeModal from "@/components/UpgradeModal";
import AlertsSection from "@/components/AlertsSection";
import { ALERTS, fetchLivePrices } from "@/data/commodityData";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";

function AppShell({ children }: { children: React.ReactNode }) {
  const [showAlertPanel, setShowAlertPanel] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [liveStatus, setLiveStatus] = useState<"loading" | "live" | "offline">("loading");
  const [, setForceUpdate] = useState(0);

  const { setShowUpgradeModal } = useUser();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    if (searchParams.get("upgraded") === "true") {
      setShowUpgradeModal(true);
      window.history.replaceState({}, document.title, pathname);
    }

    fetchLivePrices().then((res) => {
      if (res.success) {
        setLiveStatus("live");
      } else {
        setLiveStatus("offline");
      }
      setDataLoaded(true);
      setForceUpdate((n) => n + 1);
    });
  }, [setShowUpgradeModal, searchParams, pathname]);

  if (!dataLoaded) {
    return (
      <div className="min-h-screen bg-green-50 flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mb-4" />
        <p className="text-green-800 font-medium">Memuat data harga terkini...</p>
        <p className="text-green-600/60 text-sm mt-1">Mengambil data dari Bank Indonesia PIHPS</p>
      </div>
    );
  }

  const isAuthPage = pathname === "/auth";

  return (
    <div className="min-h-screen bg-white">
      {!isAuthPage && (
        <Navbar
          alertCount={ALERTS.length}
          onAlertClick={() => setShowAlertPanel(!showAlertPanel)}
          liveStatus={liveStatus}
        />
      )}
      <UpgradeModal />
      {showAlertPanel && !isAuthPage && (
        <AlertsSection isPanel={true} onClose={() => setShowAlertPanel(false)} />
      )}
      {children}
      {!isAuthPage && <Footer />}
    </div>
  );
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <UserProvider>
      <TooltipProvider>
        <Suspense fallback={
          <div className="min-h-screen bg-green-50 flex flex-col items-center justify-center">
            <div className="w-12 h-12 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mb-4" />
            <p className="text-green-800 font-medium">Memuat...</p>
          </div>
        }>
          <AppShell>{children}</AppShell>
        </Suspense>
        <Toaster richColors position="top-right" />
      </TooltipProvider>
    </UserProvider>
  );
}
