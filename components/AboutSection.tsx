import { Database, Zap, MapPin, BarChart2, Users, ShieldCheck } from "lucide-react";

export default function AboutSection() {
  const features = [
    { icon: <BarChart2 className="w-6 h-6" />, title: "Price Dashboard", desc: "Grafik harga 7 hari terakhir untuk cabai, beras, dan bawang dengan visualisasi yang mudah dibaca.", color: "green" },
    { icon: <Zap className="w-6 h-6" />, title: "Smart Recommendation", desc: "Analisis tren otomatis yang menghasilkan rekomendasi JUAL atau TAHAN berdasarkan data real.", color: "amber" },
    { icon: <MapPin className="w-6 h-6" />, title: "Filter Lokasi", desc: "Pantau harga spesifik berdasarkan wilayah — Nasional, Jawa Barat, dan fokus Cianjur.", color: "blue" },
    { icon: <Zap className="w-6 h-6" />, title: "Alert System", desc: "Notifikasi real-time saat harga bergerak signifikan, peak harga tertinggi, atau tren berubah.", color: "red" },
    { icon: <Database className="w-6 h-6" />, title: "Data Resmi Pemerintah", desc: "Sumber data terintegrasi dari Bank Indonesia (Pusat Informasi Harga Pangan Strategis).", color: "purple" },
    { icon: <Users className="w-6 h-6" />, title: "Petani-Friendly UI", desc: "Desain sederhana dengan warna kode hijau (jual) dan merah (tahan) yang langsung dipahami.", color: "emerald" },
  ];
  const colorMap: Record<string, string> = { green: "bg-green-100 text-green-600", amber: "bg-amber-100 text-amber-600", blue: "bg-blue-100 text-blue-600", red: "bg-red-100 text-red-600", purple: "bg-purple-100 text-purple-600", emerald: "bg-emerald-100 text-emerald-600" };

  return (
    <section id="about" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide mb-3"><ShieldCheck className="w-3 h-3" />Tentang AgriSight</div>
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-4">Fitur Lengkap untuk Petani<br /><span className="text-green-600">yang Lebih Cerdas</span></h2>
          <p className="text-gray-500 max-w-2xl mx-auto text-sm leading-relaxed">&quot;Petani tidak kekurangan data, tapi kekurangan keputusan. AgriSight hadir untuk mengubah data harga pangan menjadi rekomendasi yang actionable.&quot;</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {features.map((f, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${colorMap[f.color]}`}>{f.icon}</div>
              <h3 className="font-bold text-gray-900 mb-2">{f.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
        <div className="mt-10 bg-gradient-to-br from-green-600 to-emerald-700 rounded-2xl p-8 text-white">
          <h3 className="font-black text-xl mb-2">🔥 Fitur Segera Hadir</h3>
          <p className="text-green-100/80 text-sm mb-6">Kami terus berkembang untuk melayani petani Indonesia lebih baik</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { emoji: "🔮", title: "Prediksi Harga", desc: "Prediksi tren harga 7-14 hari ke depan menggunakan machine learning" },
              { emoji: "📝", title: "Input Harga Lokal", desc: "Petani bisa input harga pasar lokal mereka sendiri" },
              { emoji: "📱", title: "WhatsApp Alert", desc: "Notifikasi harga langsung ke WhatsApp petani" },
              { emoji: "🌤️", title: "Cuaca & Panen", desc: "Korelasi data cuaca dengan prediksi harga" },
            ].map((item, i) => (
              <div key={i} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4">
                <div className="text-2xl mb-2">{item.emoji}</div>
                <h4 className="font-bold text-sm mb-1">{item.title}</h4>
                <p className="text-xs text-green-100/70 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
