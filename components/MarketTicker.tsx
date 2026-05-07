"use client";

import { TrendingUp, TrendingDown } from "lucide-react";
import {
  LOCATIONS,
  LOCATION_LABELS,
  getLevel2Items,
  getEmoji,
  formatRupiah,
  getBILatestPrice,
  getBIWeeklyChange,
} from "@/data/commodityData";

export default function MarketTicker() {
  const items: { label: string; price: string; change: number; isUp: boolean }[] = [];

  // Produsen data across all locations
  for (const loc of LOCATIONS) {
    const level2 = getLevel2Items(loc, "produsen");
    for (const item of level2.slice(0, 4)) {
      const price = getBILatestPrice(item);
      const change = getBIWeeklyChange(item);
      if (price === 0) continue;
      items.push({
        label: `${getEmoji(item.name)} ${item.name} (${LOCATION_LABELS[loc]})`,
        price: `${formatRupiah(price)}/kg`,
        change,
        isUp: change >= 0,
      });
    }
  }

  const allItems = [...items, ...items];

  return (
    <div className="bg-green-950 border-b border-green-800/50 py-2 overflow-hidden relative">
      <div
        className="flex items-center gap-3 whitespace-nowrap"
        style={{ animation: "ticker 40s linear infinite" }}
      >
        {allItems.map((item, i) => (
          <div key={i} className="flex items-center gap-2 px-4">
            <span className="text-green-300/70 text-xs font-medium">{item.label}</span>
            <span className="text-white text-xs font-bold">{item.price}</span>
            <span className={`flex items-center gap-0.5 text-xs font-bold
              ${item.isUp ? "text-green-400" : "text-red-400"}`}>
              {item.isUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {item.isUp ? "+" : ""}{item.change.toFixed(1)}%
            </span>
            <span className="text-green-700 mx-2">•</span>
          </div>
        ))}
      </div>
      <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-green-950 to-transparent pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-green-950 to-transparent pointer-events-none" />
    </div>
  );
}
