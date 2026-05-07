import { Heart, ExternalLink } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <img src="/images/logo.jpeg" alt="AgriSight Logo" className="w-10 h-10 rounded-xl object-cover shadow-sm shadow-green-900/50" />
              <div>
                <span className="text-lg font-black tracking-tight">Agri<span className="text-green-400">Sight</span></span>
                <p className="text-xs text-gray-500">Smart Price Tracker</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-sm mb-4">&quot;Petani tidak kekurangan data, tapi kekurangan keputusan. AgriSight hadir untuk mengubah data harga pangan menjadi rekomendasi yang actionable.&quot;</p>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xs text-green-400 font-medium">Data Live dari Sumber Resmi</span>
            </div>
          </div>
          <div>
            <h4 className="font-bold text-sm mb-4 text-white/80 uppercase tracking-wide">Fitur</h4>
            <ul className="space-y-2">
              {["Price Dashboard","Smart Recommendation","Filter Lokasi","Alert System","Prediksi Harga (Soon)"].map((item) => (
                <li key={item}><a href="#dashboard" className="text-gray-400 hover:text-green-400 text-sm transition-colors">{item}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-sm mb-4 text-white/80 uppercase tracking-wide">Sumber Data</h4>
            <ul className="space-y-3">
              <li><a href="https://www.bi.go.id/hargapangan/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-gray-400 hover:text-green-400 text-sm transition-colors"><ExternalLink className="w-3 h-3" />Bank Indonesia</a></li>
            </ul>
            <div className="mt-6">
              <h4 className="font-bold text-sm mb-3 text-white/80 uppercase tracking-wide">Komoditas</h4>
              <div className="flex flex-wrap gap-2">
                {["🌶️ Cabai","🌾 Beras","🧅 Bawang"].map((c) => (
                  <span key={c} className="text-xs bg-white/5 border border-white/10 text-gray-400 px-2.5 py-1 rounded-full">{c}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-xs">© 2025 AgriSight. Semua hak dilindungi.</p>
          <p className="text-gray-500 text-xs flex items-center gap-1">Dibuat dengan <Heart className="w-3 h-3 text-red-400 fill-red-400" /> untuk petani Indonesia</p>
          <div className="flex items-center gap-4">
            {["Privasi","Syarat & Ketentuan","Kontak"].map((link) => (
              <a key={link} href="#" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">{link}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
