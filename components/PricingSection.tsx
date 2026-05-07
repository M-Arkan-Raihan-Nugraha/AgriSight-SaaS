"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, X, Zap, Crown, Building2, ArrowRight } from "lucide-react";
import { useUser, UserTier } from "@/context/UserContext";

interface PlanFeature {
  text: string;
  included: boolean;
  highlight?: boolean;
}

interface Plan {
  tier: UserTier;
  name: string;
  emoji: string;
  tagline: string;
  price: string;
  priceSuffix: string;
  priceNote?: string;
  popular?: boolean;
  icon: React.ReactNode;
  color: string;
  features: PlanFeature[];
  cta: string;
}

export default function PricingSection() {
  const { user, isLoggedIn, tier } = useUser();
  const [loadingTier, setLoadingTier] = useState<UserTier | null>(null);
  const router = useRouter();

  const handleSelectPlan = async (planTier: UserTier) => {
    if (!isLoggedIn) {
      router.push("/auth?tab=register");
      return;
    }
    if (planTier === "free") return;
    if (planTier === "bisnis") {
      window.open("https://www.instagram.com/zielabs/", "_blank");
      return;
    }

    setLoadingTier(planTier);
    try {
      const response = await fetch("/api/payment/mayar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uid: user?.uid,
          tier: planTier,
          email: user?.email,
          name: user?.name,
        }),
      });

      const data = await response.json();
      if (data.success && data.payment_link) {
        window.location.href = data.payment_link;
      } else {
        alert("Gagal membuat link pembayaran: " + (data.message || "Unknown error"));
      }
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan jaringan.");
    } finally {
      setLoadingTier(null);
    }
  };

  const plans: Plan[] = [
    {
      tier: "free",
      name: "Petani Pemula",
      emoji: "🌱",
      tagline: "Mulai pantau harga tanpa biaya",
      price: "Rp 0",
      priceSuffix: "selamanya",
      icon: <Zap className="w-5 h-5" />,
      color: "green",
      features: [
        { text: "Harga Produsen (Petani) real-time", included: true },
        { text: "Data 3 wilayah (Cianjur, Jabar, Nasional)", included: true },
        { text: "Grafik riwayat 7 hari", included: true },
        { text: "Rekomendasi JUAL/TAHAN dasar", included: true },
        { text: "1 notifikasi In-App per hari", included: true },
        { text: "Harga Pasar Tradisional & Modern", included: false },
        { text: "Analisis Margin Rantai Pasok", included: false },
        { text: "Notifikasi WhatsApp / Telegram", included: false },
        { text: "API Access & Export Data", included: false },
      ],
      cta: "Mulai Gratis",
    },
    {
      tier: "pro",
      name: "Petani Cerdas",
      emoji: "🚀",
      tagline: "Insight mendalam untuk negosiasi harga",
      price: "Rp 49.000",
      priceSuffix: "/bulan",
      priceNote: "atau Rp 149.000/6 bulan (hemat 49%)",
      popular: true,
      icon: <Crown className="w-5 h-5" />,
      color: "indigo",
      features: [
        { text: "Semua fitur Petani Pemula", included: true },
        { text: "Harga Pasar Tradisional & Modern", included: true, highlight: true },
        { text: "Harga Pedagang Besar", included: true, highlight: true },
        { text: "Analisis Margin Rantai Pasok", included: true, highlight: true },
        { text: "Notifikasi WhatsApp / Telegram", included: true, highlight: true },
        { text: "Data historis hingga 1 tahun", included: true },
        { text: "Rekomendasi AI tingkat lanjut", included: true },
        { text: "API Access & Export Data", included: false },
        { text: "Multi-user account", included: false },
      ],
      cta: "Upgrade ke Pro",
    },
    {
      tier: "bisnis",
      name: "Juragan Bisnis",
      emoji: "🏢",
      tagline: "Untuk distributor, koperasi & agribisnis",
      price: "Rp 499.000",
      priceSuffix: "/bulan",
      priceNote: "Negosiasi untuk KUD & Dinas Pertanian",
      icon: <Building2 className="w-5 h-5" />,
      color: "amber",
      features: [
        { text: "Semua fitur Petani Cerdas", included: true },
        { text: "API Access (integrasi ke sistem ERP)", included: true, highlight: true },
        { text: "Export data ke Excel / CSV", included: true, highlight: true },
        { text: "Multi-user hingga 5 akun", included: true, highlight: true },
        { text: "Dashboard arbitrase antar wilayah", included: true, highlight: true },
        { text: "Priority support via WhatsApp", included: true },
        { text: "Custom report bulanan", included: true },
        { text: "Onboarding & training khusus", included: true },
      ],
      cta: "Hubungi Tim Kami",
    },
  ];

  return (
    <section id="pricing" className="py-24 bg-white relative overflow-hidden">
      {/* Decorative bg */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-green-100/50 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide mb-4">
            <Crown className="w-3 h-3" />
            Pricing Plans
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight mb-4">
            Hanya Seharga Sebungkus Pupuk,
            <br />
            <span className="text-green-600">Hasilnya Jutaan Rupiah</span>
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto text-sm leading-relaxed">
            Investasi paling kecil untuk keputusan paling besar. Pilih paket sesuai kebutuhanmu.
          </p>
        </div>

        {/* Plans grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
          {plans.map((plan) => {
            const isCurrentPlan = isLoggedIn && tier === plan.tier;
            const isPopular = plan.popular;

            return (
              <div
                key={plan.tier}
                className={`relative rounded-3xl overflow-hidden transition-all duration-300 hover:-translate-y-2
                  ${isPopular
                    ? "border-2 border-indigo-500 shadow-2xl shadow-indigo-500/20 scale-[1.02]"
                    : "border-2 border-gray-100 shadow-lg hover:shadow-xl"
                  }`}
              >
                {/* Popular badge */}
                {isPopular && (
                  <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-center py-2 text-xs font-black uppercase tracking-wider">
                    ⭐ Paling Populer — Direkomendasikan
                  </div>
                )}

                <div className="bg-white p-7">
                  {/* Plan header */}
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-3xl">{plan.emoji}</span>
                    <div>
                      <h3 className="font-black text-gray-900 text-lg">{plan.name}</h3>
                      <p className="text-xs text-gray-400">{plan.tagline}</p>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="mb-6 mt-4">
                    <div className="flex items-baseline gap-1.5">
                      <span className={`text-3xl font-black ${
                        plan.color === "indigo" ? "text-indigo-600" :
                        plan.color === "amber" ? "text-amber-600" :
                        "text-green-600"
                      }`}>
                        {plan.price}
                      </span>
                      <span className="text-sm text-gray-400 font-medium">{plan.priceSuffix}</span>
                    </div>
                    {plan.priceNote && (
                      <p className="text-xs text-gray-400 mt-1">{plan.priceNote}</p>
                    )}
                  </div>

                  {/* CTA */}
                  <button
                    onClick={() => handleSelectPlan(plan.tier)}
                    disabled={isCurrentPlan || loadingTier === plan.tier}
                    className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2 mb-6
                      ${isCurrentPlan
                        ? "bg-gray-100 text-gray-400 cursor-default"
                        : isPopular
                        ? "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-600/20 hover:shadow-indigo-500/30"
                        : plan.color === "amber"
                        ? "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white shadow-lg shadow-amber-500/20"
                        : "bg-green-600 hover:bg-green-500 text-white shadow-lg shadow-green-600/20"
                      }`}
                  >
                    {loadingTier === plan.tier ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : isCurrentPlan ? (
                      "✓ Paket Aktif"
                    ) : (
                      <>
                        {plan.cta}
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  {/* Features list */}
                  <div className="space-y-3">
                    {plan.features.map((feat, i) => (
                      <div key={i} className="flex items-start gap-2.5">
                        {feat.included ? (
                          <Check className={`w-4 h-4 flex-shrink-0 mt-0.5 ${
                            feat.highlight ? "text-indigo-500" : "text-green-500"
                          }`} />
                        ) : (
                          <X className="w-4 h-4 text-gray-300 flex-shrink-0 mt-0.5" />
                        )}
                        <span className={`text-sm leading-tight ${
                          feat.included
                            ? feat.highlight ? "text-gray-900 font-semibold" : "text-gray-700"
                            : "text-gray-400"
                        }`}>
                          {feat.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <div className="inline-flex items-center gap-3 bg-green-50 border border-green-200 rounded-2xl px-6 py-4">
            <span className="text-2xl">🌾</span>
            <div className="text-left">
              <p className="text-sm font-bold text-green-900">Paket Panen (Seasonal)</p>
              <p className="text-xs text-green-700/80">Bayar Rp 149.000 untuk 6 bulan sekaligus — cocok untuk siklus tanam!</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
