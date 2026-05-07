"use client";

import { Check, X, PartyPopper } from "lucide-react";
import { useUser } from "@/context/UserContext";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function UpgradeModal() {
  const { showUpgradeModal, setShowUpgradeModal, tier } = useUser();

  const tierInfo = {
    pro: { name: "Petani Cerdas", emoji: "🚀", color: "from-indigo-600 to-purple-600" },
    bisnis: { name: "Juragan Bisnis", emoji: "🏢", color: "from-amber-500 to-orange-500" },
    free: { name: "Petani Pemula", emoji: "🌱", color: "from-green-500 to-emerald-600" },
  }[tier];

  return (
    <Dialog open={showUpgradeModal} onOpenChange={setShowUpgradeModal}>
      <DialogContent className="sm:max-w-sm p-0 overflow-hidden rounded-3xl border-0 gap-0">
        {/* Gradient header */}
        <div className={`bg-gradient-to-r ${tierInfo.color} px-6 py-10 text-center relative`}>
          <div className="text-5xl mb-3">{tierInfo.emoji}</div>
          <PartyPopper className="w-6 h-6 text-white/80 mx-auto mb-2" />
          <DialogTitle className="text-white font-black text-xl mb-1">
            Selamat! 🎉
          </DialogTitle>
          <DialogDescription className="text-white/80 text-sm">
            Kamu sekarang {tierInfo.name}
          </DialogDescription>
        </div>

        {/* Content */}
        <div className="px-6 py-6 space-y-4">
          <p className="text-sm text-muted-foreground leading-relaxed">
            Semua fitur premium sudah aktif. Sekarang kamu bisa melihat data lengkap termasuk margin rantai pasok!
          </p>

          <div className="bg-green-50 border border-green-200 rounded-xl p-3 space-y-1">
            {[
              "Harga Pasar Tradisional & Modern",
              "Analisis Margin Rantai Pasok",
              "Prioritas Customer Support",
            ].map((feat, i) => (
              <div key={i} className="flex items-center gap-2 py-1">
                <Check className="w-3.5 h-3.5 text-green-600 flex-shrink-0" />
                <span className="text-xs font-medium text-green-800">{feat}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center">
            <Badge variant="secondary" className="text-xs">
              {tierInfo.emoji} {tierInfo.name}
            </Badge>
          </div>

          <Button
            onClick={() => setShowUpgradeModal(false)}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-bold rounded-xl shadow-lg shadow-green-600/20 cursor-pointer"
            size="lg"
          >
            Mulai Eksplorasi →
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
