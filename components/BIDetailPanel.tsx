"use client";

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from "recharts";
import { TrendingUp, TrendingDown, Brain, ArrowRight } from "lucide-react";
import {
  BIItem, Location, PriceType,
  getEmoji, getColor,
  getBIPriceHistory, getBILatestPrice, getBIWeeklyChange, getBIRecommendation,
  formatRupiah,
  LOCATION_LABELS, PRICE_TYPE_LABELS,
} from "@/data/commodityData";

interface BIDetailPanelProps {
  item: BIItem;
  location: Location;
  priceType?: PriceType;
}

const CustomBarTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-100 rounded-xl shadow-xl px-4 py-3">
        <p className="text-xs text-gray-500 mb-1">{label}</p>
        <p className="text-sm font-bold text-gray-900">{formatRupiah(payload[0].value)}/kg</p>
      </div>
    );
  }
  return null;
};

export default function BIDetailPanel({ item, location, priceType = "produsen" }: BIDetailPanelProps) {
  const emoji = getEmoji(item.name);
  const color = getColor(item.name);
  const priceHistory = getBIPriceHistory(item);
  const latestPrice = getBILatestPrice(item);
  const weeklyChange = getBIWeeklyChange(item);
  const rec = getBIRecommendation(item);

  const maxPrice = priceHistory.length > 0 ? Math.max(...priceHistory.map(p => p.price)) : 0;
  const minPrice = priceHistory.length > 0 ? Math.min(...priceHistory.map(p => p.price)) : 0;

  const recBg = {
    green: "from-green-500 to-emerald-600",
    red: "from-red-500 to-rose-600",
    yellow: "from-amber-400 to-orange-500",
  }[rec.color];

  const recActionLabel = {
    JUAL: "🟢 DISARANKAN JUAL",
    TAHAN: "🔴 DISARANKAN TAHAN",
    PANTAU: "🟡 PANTAU DULU",
  }[rec.action];

  return (
    <div className="glass rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-green-900/10 border-t border-l border-white/80">
      <div className={`h-2 bg-gradient-to-r ${recBg}`} />
      <div className="p-6">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left: Chart */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-5">
              <span className="text-3xl">{emoji}</span>
              <div>
                <h3 className="font-black text-gray-900 text-lg">{item.name}</h3>
                <p className="text-xs text-gray-400">
                  {LOCATION_LABELS[location]} • {PRICE_TYPE_LABELS[priceType]} • {priceHistory.length} hari data
                </p>
              </div>
            </div>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
                <BarChart data={priceHistory} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                  <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                  <YAxis
                    tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false}
                    tickFormatter={v => new Intl.NumberFormat("id-ID", { notation: "compact", compactDisplay: "short" }).format(v)}
                    width={45}
                  />
                  <Tooltip content={<CustomBarTooltip />} />
                  <Bar dataKey="price" radius={[4, 4, 0, 0]}>
                    {priceHistory.map((_e, index) => (
                      <Cell key={`cell-${index}`}
                        fill={index === priceHistory.length - 1 ? color.chartColor : `${color.chartColor}60`}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Right: Stats & Recommendation */}
          <div className="lg:w-72 flex flex-col gap-4">
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs text-gray-400 mb-1">Harga Terkini</p>
              <p className="text-3xl font-black text-gray-900">{formatRupiah(latestPrice)}</p>
              <p className="text-xs text-gray-400">per kg</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-400 mb-1">Perubahan Mingguan</p>
                <div className={`flex items-center gap-1 font-bold text-sm
                  ${weeklyChange > 0 ? "text-green-600" : weeklyChange < 0 ? "text-red-500" : "text-gray-500"}`}>
                  {weeklyChange > 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                  {weeklyChange > 0 ? "+" : ""}{weeklyChange.toFixed(1)}%
                </div>
              </div>
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-400 mb-1">Rentang Harga</p>
                <p className="font-bold text-xs text-gray-800">{formatRupiah(minPrice)} — {formatRupiah(maxPrice)}</p>
              </div>
            </div>
            <div className={`rounded-2xl p-5 bg-gradient-to-br ${recBg} text-white shadow-lg`}>
              <p className="text-xs font-bold opacity-90 mb-1 flex items-center gap-1.5">
                <Brain className="w-4 h-4" /> Smart Recommendation
              </p>
              <p className="font-black text-lg mb-2">{recActionLabel}</p>
              <p className="text-sm opacity-95 leading-relaxed font-medium">{rec.reason}</p>
              <div className="mt-4 flex items-center gap-1.5 text-xs font-bold opacity-90 bg-black/10 px-3 py-2 rounded-lg w-fit">
                <span>Berdasarkan tren {priceHistory.length} hari</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
