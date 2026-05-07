"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("AgriSight Error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        {/* Icon */}
        <div className="relative inline-flex mb-8">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center shadow-xl shadow-red-200/50">
            <AlertTriangle className="w-10 h-10 text-white" />
          </div>
          <div className="absolute -inset-4 rounded-3xl bg-red-400/15 blur-xl" />
        </div>

        {/* Text */}
        <h1 className="text-2xl font-black text-gray-900 mb-2">
          Terjadi Kesalahan
        </h1>
        <p className="text-gray-500 text-sm leading-relaxed mb-2">
          Maaf, terjadi kesalahan saat memproses permintaan Anda. Tim kami telah
          diberitahu dan sedang menanganinya.
        </p>

        {/* Error detail (dev only) */}
        {process.env.NODE_ENV === "development" && error.message && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-6 text-left">
            <p className="text-xs font-mono text-red-700 break-all">
              {error.message}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-500 text-white font-bold px-6 py-3 rounded-xl transition-all shadow-lg shadow-green-600/20 hover:-translate-y-0.5"
          >
            <RefreshCw className="w-4 h-4" />
            Coba Lagi
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-700 font-bold px-6 py-3 rounded-xl border border-gray-200 transition-all hover:-translate-y-0.5"
          >
            <Home className="w-4 h-4" />
            Ke Beranda
          </Link>
        </div>

        {/* Digest for support */}
        {error.digest && (
          <p className="text-xs text-gray-400 mt-6">
            Error ID: <code className="font-mono">{error.digest}</code>
          </p>
        )}
      </div>
    </div>
  );
}
