"use client";

import { useState, useEffect, createContext, useContext, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { UserProvider, useUser } from "@/context/UserContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import UpgradeModal from "@/components/UpgradeModal";
import AlertsSection from "@/components/AlertsSection";
import { ALERTS, fetchLivePrices } from "@/data/commodityData";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";

// ─── Data readiness context ───
// Components can subscribe to this to show inline skeleton states
// instead of blocking the entire page with a loading screen.
interface DataContextType {
  dataLoaded: boolean;
  liveStatus: "loading" | "live" | "offline";
}

const DataContext = createContext<DataContextType>({
  dataLoaded: false,
  liveStatus: "loading",
});

export function useDataStatus() {
  return useContext(DataContext);
}

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

  const isAuthPage = pathname === "/auth";

  return (
    <DataContext.Provider value={{ dataLoaded, liveStatus }}>
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
    </DataContext.Provider>
  );
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <UserProvider>
      <TooltipProvider>
        <Suspense fallback={
          <div className="min-h-screen bg-white" />
        }>
          <AppShell>{children}</AppShell>
        </Suspense>
        <Toaster richColors position="top-right" />
      </TooltipProvider>
    </UserProvider>
  );
}
