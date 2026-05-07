"use client";

import { Lock, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useUser, PremiumFeature } from "@/context/UserContext";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface PremiumLockProps {
  children: React.ReactNode;
  feature: PremiumFeature;
  title?: string;
}

export default function PremiumLock({ children, feature, title }: PremiumLockProps) {
  const { isPremiumFeature, tier } = useUser();

  if (isPremiumFeature(feature)) {
    return <>{children}</>;
  }

  return (
    <div className="relative">
      {/* Blurred content preview */}
      <div className="blur-sm pointer-events-none select-none opacity-60">
        {children}
      </div>

      {/* Lock overlay */}
      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-background/95 via-background/70 to-transparent z-10">
        <Card className="max-w-md w-full mx-4 border-primary/20 shadow-2xl shadow-primary/10">
          <CardContent className="pt-8 pb-6 px-6 text-center">
            <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Lock className="w-7 h-7 text-primary" />
            </div>

            <Badge variant="secondary" className="mb-3">
              🔒 Fitur Premium
            </Badge>

            <h3 className="font-black text-foreground text-lg mb-2">
              {title || "Konten Premium"}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-5">
              Upgrade ke <strong>Petani Cerdas (Pro)</strong> untuk mengakses data harga pasar tradisional, pasar modern, dan analisis margin rantai pasok.
            </p>

            <Link href="/pricing" className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-bold px-6 py-3 rounded-xl shadow-lg shadow-green-600/20 transition-all hover:-translate-y-0.5">
                Upgrade Sekarang
                <ArrowRight className="w-4 h-4" />
            </Link>

            <p className="text-xs text-muted-foreground mt-3">
              Paket saat ini: <Badge variant="outline" className="text-[10px] ml-1">{tier === "free" ? "🌱 Petani Pemula" : `🚀 ${tier}`}</Badge>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
