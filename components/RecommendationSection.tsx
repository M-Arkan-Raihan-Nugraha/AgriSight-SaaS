"use client";

import { Brain, CheckCircle, XCircle } from "lucide-react";
import { getLevel2Items, getBIRecommendation, getBIWeeklyChange, getEmoji } from "@/data/commodityData";

export default function RecommendationSection() {
  const level2Items = getLevel2Items("nasional", "produsen");
  
  const defaultExamples = [
    { commodity: "🌶️ Cabai Merah", situation: "Harga naik 15% dalam 7 hari", action: "JUAL", actionColor: "green", message: "Harga cabai sedang naik signifikan — Ini waktu terbaik untuk jual!", detail: "Berdasarkan tren 7 hari, harga cabai berada di titik tertinggi minggu ini." },
    { commodity: "🧅 Bawang Merah", situation: "Harga turun 12% dalam 7 hari", action: "TAHAN", actionColor: "red", message: "Harga bawang turun drastis — Tahan dulu, tunggu harga naik!", detail: "Harga bawang sedang dalam tren turun akibat panen besar." },
    { commodity: "🌾 Beras Medium", situation: "Harga stabil, naik tipis 1.5%", action: "PANTAU", actionColor: "yellow", message: "Harga beras relatif stabil — Pantau 2 hari ke depan.", detail: "Pergerakan harga beras masih dalam batas normal." },
  ];

  let examples = defaultExamples;
  if (level2Items.length >= 3) {
    examples = level2Items.slice(0, 3).map(item => {
      const rec = getBIRecommendation(item);
      const change = getBIWeeklyChange(item);
      const isUp = change > 0;
      const isDown = change < 0;
      return {
        commodity: `${getEmoji(item.name)} ${item.name}`,
        situation: `Harga ${isUp ? "naik" : isDown ? "turun" : "stabil"} ${Math.abs(change).toFixed(1)}% minggu ini`,
        action: rec.action,
        actionColor: rec.color,
        message: rec.reason,
        detail: `Rekomendasi berdasarkan data harga aktual tingkat Nasional (Produsen) dari Bank Indonesia PIHPS.`,
      };
    });
  }

  const steps = [
    { step: "1", title: "Pilih Komoditas", desc: "Pilih cabai, beras, atau bawang yang ingin kamu pantau" },
    { step: "2", title: "Set Lokasi", desc: "Filter harga berdasarkan lokasi" },
    { step: "3", title: "Lihat Grafik", desc: "Analisis tren harga 7 hari terakhir" },
    { step: "4", title: "Baca Rekomendasi", desc: "Dapatkan saran JUAL atau TAHAN" },
    { step: "5", title: "Ambil Keputusan", desc: "Putuskan waktu terbaik untuk menjual" },
  ];

  return (
    <section id="recommendation" className="py-20 bg-gradient-to-br from-green-950 to-emerald-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-green-500/20 border border-green-400/30 text-green-300 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide mb-4">
            <Brain className="w-3 h-3" />Smart Recommendation
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">Bukan Hanya Data,<br /><span className="text-green-400">Tapi Keputusan</span></h2>
          <p className="text-green-100/70 max-w-xl mx-auto text-sm leading-relaxed">AgriSight menganalisis tren harga dan memberikan rekomendasi yang actionable.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {examples.map((ex, i) => (
            <div key={i} className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <span className="text-white font-bold text-sm">{ex.commodity}</span>
                <span className={`text-xs font-black px-3 py-1 rounded-full ${ex.actionColor === "green" ? "bg-green-500 text-white" : ex.actionColor === "red" ? "bg-red-500 text-white" : "bg-amber-400 text-white"}`}>
                  {ex.action === "JUAL" ? "🟢 JUAL" : ex.action === "TAHAN" ? "🔴 TAHAN" : "🟡 PANTAU"}
                </span>
              </div>
              <div className="bg-white/5 rounded-xl px-3 py-2 mb-3">
                <p className="text-xs text-green-300">Kondisi Pasar</p>
                <p className="text-sm text-white font-medium">{ex.situation}</p>
              </div>
              <div className={`rounded-xl px-3 py-3 mb-3 ${ex.actionColor === "green" ? "bg-green-500/20 border border-green-400/30" : ex.actionColor === "red" ? "bg-red-500/20 border border-red-400/30" : "bg-amber-400/20 border border-amber-300/30"}`}>
                <p className="text-sm text-white font-semibold">{ex.message}</p>
              </div>
              <p className="text-xs text-green-200/70 leading-relaxed">{ex.detail}</p>
            </div>
          ))}
        </div>

        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
          <h3 className="text-white font-black text-xl text-center mb-8">📱 Cara Kerja AgriSight</h3>
          <div className="flex flex-col sm:flex-row items-start gap-0">
            {steps.map((step, i) => (
              <div key={i} className="flex-1 flex flex-col items-center text-center relative">
                {i < steps.length - 1 && <div className="hidden sm:block absolute top-5 left-1/2 w-full h-0.5 bg-green-500/30 z-0" />}
                <div className="relative z-10 w-10 h-10 bg-green-500 text-white font-black text-sm rounded-full flex items-center justify-center mb-3 shadow-lg shadow-green-900/50">{step.step}</div>
                <p className="text-white font-bold text-sm mb-1">{step.title}</p>
                <p className="text-green-200/60 text-xs leading-relaxed px-2">{step.desc}</p>
                {i < steps.length - 1 && <div className="sm:hidden w-0.5 h-6 bg-green-500/30 my-3" />}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h4 className="text-gray-400 font-bold text-sm mb-4 flex items-center gap-2"><XCircle className="w-4 h-4 text-red-400" />Platform Biasa</h4>
            {["Hanya tampilkan harga","Data mentah tanpa analisis","Umum untuk semua orang","Tidak ada rekomendasi","Sulit dipahami petani"].map((item, i) => (
              <div key={i} className="flex items-center gap-2 py-2 border-b border-white/5 last:border-0">
                <XCircle className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
                <span className="text-sm text-white/50">{item}</span>
              </div>
            ))}
          </div>
          <div className="bg-green-500/10 border border-green-400/30 rounded-2xl p-6">
            <h4 className="text-green-300 font-bold text-sm mb-4 flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-400" />AgriSight</h4>
            {["Rekomendasi JUAL atau TAHAN","Data + insight yang actionable","Fokus petani lokal Cianjur & Jabar","Smart recommendation engine","UI sederhana, ramah petani"].map((item, i) => (
              <div key={i} className="flex items-center gap-2 py-2 border-b border-green-400/10 last:border-0">
                <CheckCircle className="w-3.5 h-3.5 text-green-400 flex-shrink-0" />
                <span className="text-sm text-white font-medium">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
