"use client";

import { ArrowRight, Info } from "lucide-react";
import {
  Location,
  LOCATION_LABELS,
  PRICE_TYPE_LABELS,
  PRICE_TYPE_EMOJI,
  PriceType,
  getSupplyChainMargins,
  getEmoji,
  getColor,
  formatRupiah,
} from "@/data/commodityData";

interface SupplyChainPanelProps {
  location: Location;
}

export default function SupplyChainPanel({ location }: SupplyChainPanelProps) {
  const margins = getSupplyChainMargins(location);

  if (margins.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
        <p className="text-gray-400 text-sm">Data margin belum tersedia untuk wilayah ini.</p>
      </div>
    );
  }

  const priceTypes: PriceType[] = ["produsen", "pasar_tradisional", "pasar_modern", "pedagang_besar"];

  return (
    <div className="animate-fade-in-up">
      {/* Header explanation */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-5 mb-6">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <Info className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <h3 className="font-bold text-amber-900 text-sm mb-1">Apa itu Margin Rantai Pasok?</h3>
            <p className="text-xs text-amber-800/80 leading-relaxed">
              Selisih harga antara <strong>Produsen</strong> (petani) dan <strong>Pasar</strong> menunjukkan berapa besar markup yang terjadi di setiap tingkat rantai pasok.
              Semakin besar margin, semakin banyak keuntungan yang diambil tengkulak dan pedagang perantara.
              Insight ini membantu petani muda memahami nilai sebenarnya dari hasil panen mereka.
            </p>
          </div>
        </div>
      </div>

      {/* Supply chain flow visual */}
      <div className="hidden sm:flex items-center justify-center gap-2 mb-6 text-sm">
        {priceTypes.map((pt, i) => (
          <div key={pt} className="flex items-center gap-2">
            <div className={`px-3 py-1.5 rounded-lg font-semibold text-xs
              ${pt === "produsen"
                ? "bg-green-100 text-green-700 border border-green-200"
                : "bg-gray-100 text-gray-600 border border-gray-200"
              }`}>
              {PRICE_TYPE_EMOJI[pt]} {PRICE_TYPE_LABELS[pt]}
            </div>
            {i < priceTypes.length - 1 && (
              <ArrowRight className="w-4 h-4 text-gray-300" />
            )}
          </div>
        ))}
      </div>

      {/* Margin cards */}
      <div className="space-y-4">
        {margins.map((item) => {
          const emoji = getEmoji(item.name);
          const color = getColor(item.name);

          // Calculate margins as percentage
          const tradMargin = item.pasar_tradisional
            ? ((item.pasar_tradisional - item.produsen) / item.produsen) * 100
            : null;
          const modernMargin = item.pasar_modern
            ? ((item.pasar_modern - item.produsen) / item.produsen) * 100
            : null;
          const besarMargin = item.pedagang_besar
            ? ((item.pedagang_besar - item.produsen) / item.produsen) * 100
            : null;

          const highestConsumer = Math.max(
            item.pasar_tradisional || 0,
            item.pasar_modern || 0,
            item.pedagang_besar || 0
          );
          const maxBarValue = highestConsumer > 0 ? highestConsumer : item.produsen;

          return (
            <div
              key={item.name}
              className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              {/* Commodity header */}
              <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-50">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl ${color.bgClass}`}>
                  {emoji}
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-gray-900 text-sm">{item.name}</h4>
                  <span className="text-xs text-gray-400">{LOCATION_LABELS[location]}</span>
                </div>
                {tradMargin !== null && (
                  <div className={`text-right ${tradMargin > 50 ? 'text-red-600' : tradMargin > 25 ? 'text-amber-600' : 'text-green-600'}`}>
                    <p className="text-[10px] font-medium text-gray-400">Margin Tertinggi</p>
                    <p className="text-sm font-black">
                      +{Math.max(tradMargin || 0, modernMargin || 0, besarMargin || 0).toFixed(0)}%
                    </p>
                  </div>
                )}
              </div>

              {/* Price bars */}
              <div className="px-5 py-4 space-y-3">
                {/* Produsen */}
                <PriceBar
                  label="🌾 Produsen (Petani)"
                  price={item.produsen}
                  maxValue={maxBarValue}
                  color="bg-green-500"
                  marginPct={null}
                  isBase
                />

                {/* Pedagang Besar */}
                {item.pedagang_besar !== null && (
                  <PriceBar
                    label="🚛 Pedagang Besar"
                    price={item.pedagang_besar}
                    maxValue={maxBarValue}
                    color="bg-blue-500"
                    marginPct={besarMargin}
                    diff={item.pedagang_besar - item.produsen}
                  />
                )}

                {/* Pasar Tradisional */}
                {item.pasar_tradisional !== null && (
                  <PriceBar
                    label="🏪 Pasar Tradisional"
                    price={item.pasar_tradisional}
                    maxValue={maxBarValue}
                    color="bg-amber-500"
                    marginPct={tradMargin}
                    diff={item.pasar_tradisional - item.produsen}
                  />
                )}

                {/* Pasar Modern */}
                {item.pasar_modern !== null && (
                  <PriceBar
                    label="🏬 Pasar Modern"
                    price={item.pasar_modern}
                    maxValue={maxBarValue}
                    color="bg-purple-500"
                    marginPct={modernMargin}
                    diff={item.pasar_modern - item.produsen}
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Price Bar sub-component ───
function PriceBar({
  label,
  price,
  maxValue,
  color,
  marginPct,
  diff,
  isBase = false,
}: {
  label: string;
  price: number;
  maxValue: number;
  color: string;
  marginPct: number | null;
  diff?: number;
  isBase?: boolean;
}) {
  const barWidth = maxValue > 0 ? (price / maxValue) * 100 : 0;

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-medium text-gray-600">{label}</span>
        <div className="flex items-center gap-2">
          <span className="text-sm font-black text-gray-900">{formatRupiah(price)}</span>
          {marginPct !== null && diff !== undefined && (
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded
              ${marginPct > 50 ? 'bg-red-100 text-red-700' :
                marginPct > 25 ? 'bg-amber-100 text-amber-700' :
                'bg-green-100 text-green-700'
              }`}>
              +{formatRupiah(diff)} (+{marginPct.toFixed(0)}%)
            </span>
          )}
          {isBase && (
            <span className="text-[10px] font-bold bg-green-100 text-green-700 px-1.5 py-0.5 rounded">
              HARGA PETANI
            </span>
          )}
        </div>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-3">
        <div
          className={`h-3 rounded-full ${color} transition-all duration-700`}
          style={{ width: `${Math.min(100, barWidth)}%` }}
        />
      </div>
    </div>
  );
}
