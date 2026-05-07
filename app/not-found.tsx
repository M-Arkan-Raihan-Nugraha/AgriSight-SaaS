import { SearchX, Home, ArrowLeft } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Halaman Tidak Ditemukan",
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        {/* Icon */}
        <div className="relative inline-flex mb-8">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-xl shadow-green-200/50">
            <SearchX className="w-10 h-10 text-white" />
          </div>
          <div className="absolute -inset-4 rounded-3xl bg-green-400/15 blur-xl" />
        </div>

        {/* 404 */}
        <div className="text-8xl font-black text-green-200 mb-4 select-none">
          404
        </div>

        {/* Text */}
        <h1 className="text-2xl font-black text-gray-900 mb-2">
          Halaman Tidak Ditemukan
        </h1>
        <p className="text-gray-500 text-sm leading-relaxed mb-8">
          Maaf, halaman yang Anda cari tidak tersedia. Mungkin sudah dipindahkan
          atau URL yang Anda masukkan salah.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-500 text-white font-bold px-6 py-3 rounded-xl transition-all shadow-lg shadow-green-600/20 hover:-translate-y-0.5"
          >
            <Home className="w-4 h-4" />
            Ke Beranda
          </Link>
          <Link
            href="/pricing"
            className="inline-flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-700 font-bold px-6 py-3 rounded-xl border border-gray-200 transition-all hover:-translate-y-0.5"
          >
            <ArrowLeft className="w-4 h-4" />
            Lihat Paket Harga
          </Link>
        </div>

        {/* Fun agricultural theme */}
        <div className="mt-12 flex items-center justify-center gap-2 text-2xl opacity-40">
          <span>🌾</span>
          <span>🌶️</span>
          <span>🧅</span>
          <span>🌾</span>
        </div>
        <p className="text-xs text-gray-400 mt-2">
          AgriSight – Smart Price Tracker untuk Petani Indonesia
        </p>
      </div>
    </div>
  );
}
