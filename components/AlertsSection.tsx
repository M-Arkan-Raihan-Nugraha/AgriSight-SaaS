"use client";

import { Bell, TrendingUp, TrendingDown, Award, X } from "lucide-react";
import { ALERTS, Alert } from "@/data/commodityData";

interface AlertsSectionProps {
  isPanel?: boolean;
  onClose?: () => void;
}

function AlertItem({ alert }: { alert: Alert }) {
  const icons = {
    up: <TrendingUp className="w-4 h-4 text-green-600" />,
    down: <TrendingDown className="w-4 h-4 text-red-500" />,
    peak: <Award className="w-4 h-4 text-amber-500" />,
  };
  const colors = {
    up: "bg-green-50 border-green-200",
    down: "bg-red-50 border-red-200",
    peak: "bg-amber-50 border-amber-200",
  };
  const dotColors = { up: "bg-green-500", down: "bg-red-500", peak: "bg-amber-500" };

  return (
    <div className={`flex items-start gap-3 p-4 rounded-xl border ${colors[alert.type]}`}>
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${alert.type === 'up' ? 'bg-green-100' : alert.type === 'down' ? 'bg-red-100' : 'bg-amber-100'}`}>
        {icons[alert.type]}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-xs font-bold text-gray-700">{alert.commodity}</span>
          <div className={`w-1.5 h-1.5 rounded-full ${dotColors[alert.type]}`} />
          <span className="text-xs text-gray-400">{alert.time}</span>
        </div>
        <p className="text-sm text-gray-700 leading-relaxed">{alert.message}</p>
      </div>
    </div>
  );
}

export default function AlertsSection({ isPanel = false, onClose }: AlertsSectionProps) {
  if (isPanel) {
    return (
      <div className="fixed inset-0 z-50 flex items-start justify-end p-4 pt-20">
        <div className="w-full max-w-sm">
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose} />
          <div className="relative bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-green-600" />
                <span className="font-bold text-gray-900 text-sm">Notifikasi Harga</span>
                <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{ALERTS.length}</span>
              </div>
              <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors">
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>
            <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
              {ALERTS.length === 0 ? (
                <p className="text-center text-gray-400 text-sm py-6">Belum ada pergerakan harga signifikan hari ini.</p>
              ) : ALERTS.map((a) => <AlertItem key={a.id} alert={a} />)}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section id="alerts" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-red-100 text-red-700 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide mb-3">
            <Bell className="w-3 h-3" />Alert System
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-3">Notifikasi Harga Real-time</h2>
          <p className="text-gray-500 max-w-xl mx-auto text-sm">Peringatan otomatis saat harga bergerak signifikan, sehingga kamu tidak pernah melewatkan momen terbaik untuk jual.</p>
        </div>
        <div className="max-w-2xl mx-auto space-y-4">
          {ALERTS.length === 0 ? (
            <div className="text-center py-10 bg-gray-50 rounded-2xl border border-gray-100">
              <p className="text-gray-400 text-sm">Semua harga komoditas stabil hari ini.</p>
            </div>
          ) : ALERTS.map((a) => <AlertItem key={a.id} alert={a} />)}
        </div>
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {[
            { icon: "📈", title: "Harga Naik", desc: "Notifikasi langsung saat harga naik di atas 5%", color: "green" },
            { icon: "📉", title: "Harga Turun", desc: "Peringatan dini saat harga menunjukkan penurunan signifikan", color: "red" },
            { icon: "🏆", title: "Harga Tertinggi", desc: "Alert khusus untuk komoditas dengan harga tertinggi", color: "amber" },
          ].map((item) => (
            <div key={item.title} className={`rounded-2xl p-6 border-2 text-center ${item.color === "green" ? "bg-green-50 border-green-100" : item.color === "red" ? "bg-red-50 border-red-100" : "bg-amber-50 border-amber-100"}`}>
              <div className="text-4xl mb-3">{item.icon}</div>
              <h4 className="font-bold text-gray-900 mb-2">{item.title}</h4>
              <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
