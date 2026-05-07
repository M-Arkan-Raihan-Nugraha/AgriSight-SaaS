"use client";

import { TrendingUp, MapPin, Zap, ArrowDown, Database, Layers } from "lucide-react";
import { LOCATIONS, getLevel2Items, getAvailablePriceTypes } from "@/data/commodityData";

export default function Hero() {
  // Count total commodities and price types
  let totalItems = 0;
  let totalPriceTypes = 0;
  for (const loc of LOCATIONS) {
    const avail = getAvailablePriceTypes(loc);
    totalPriceTypes += avail.length;
    for (const pt of avail) {
      totalItems += getLevel2Items(loc, pt).length;
    }
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-green-950 via-green-900 to-emerald-800">
      <div
        className="absolute inset-0 opacity-20 bg-cover bg-center"
        style={{
          backgroundImage: `url(https://images.pexels.com/photos/35298758/pexels-photo-35298758.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200)`,
        }}
      />
      <div className="absolute top-20 left-10 w-64 h-64 bg-green-500/20 rounded-full blur-[100px] animate-pulse-glow" />
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-emerald-400/20 rounded-full blur-[100px] animate-float" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-green-600/10 rounded-full blur-[120px]" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-20">
        <div className="inline-flex items-center gap-2 bg-green-500/20 border border-green-400/30 rounded-full px-4 py-2 mb-8">
          <Database className="w-3.5 h-3.5 text-green-400" />
          <span className="text-green-300 text-xs font-bold uppercase tracking-widest">Data Real dari Bank Indonesia PIHPS</span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black text-white leading-tight mb-6 tracking-tight">
          Data Harga Jadi
          <br />
          <span className="text-gradient">Keputusan Nyata</span>
        </h1>

        <p className="text-lg sm:text-xl text-green-100/80 max-w-2xl mx-auto mb-10 leading-relaxed">
          AgriSight mengubah data harga komoditas pangan menjadi rekomendasi yang bisa langsung dipakai petani — bandingkan harga produsen vs pasar untuk lihat margin rantai pasok.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <a href="#dashboard" className="inline-flex items-center justify-center gap-2 bg-green-500 hover:bg-green-400 text-white font-bold px-8 py-4 rounded-2xl transition-all duration-300 shadow-xl shadow-green-900/50 hover:shadow-green-500/40 hover:-translate-y-1">
            <TrendingUp className="w-5 h-5" />
            Lihat Harga Sekarang
          </a>
          <a href="#about" className="inline-flex items-center justify-center gap-2 glass hover:bg-white/20 text-white font-bold px-8 py-4 rounded-2xl transition-all duration-300 hover:-translate-y-1">
            Pelajari Lebih Lanjut
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 max-w-4xl mx-auto mb-12 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          {[
            { icon: <MapPin className="w-5 h-5" />, value: "3 Wilayah", label: "Cianjur, Jabar & Nasional" },
            { icon: <Layers className="w-5 h-5" />, value: "4 Tipe Harga", label: "Produsen → Pasar Modern" },
            { icon: <TrendingUp className="w-5 h-5" />, value: `${totalItems} Data`, label: "Komoditas Hasil Tani" },
            { icon: <Zap className="w-5 h-5" />, value: "Margin Insight", label: "Analisis Rantai Pasok" },
          ].map((stat, i) => (
            <div key={i} className="glass-dark rounded-2xl px-5 py-5 text-center transition-transform hover:-translate-y-1 hover:bg-gray-800/60">
              <div className="flex items-center justify-center text-green-400 mb-3">{stat.icon}</div>
              <div className="text-white font-black text-lg mb-0.5">{stat.value}</div>
              <div className="text-green-200/60 text-xs font-medium">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center gap-2 text-green-300/60 animate-bounce">
          <span className="text-xs">Scroll ke bawah</span>
          <ArrowDown className="w-4 h-4" />
        </div>
      </div>
    </section>
  );
}
