"use client";

import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import {
  BIItem,
  getEmoji,
  getColor,
  getBILatestPrice,
  getBIWeeklyChange,
  getBIPriceHistory,
  getBIRecommendation,
  formatRupiah,
} from "@/data/commodityData";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import PriceChart from "./PriceChart";

interface BICardProps {
  item: BIItem;
  isSelected: boolean;
  onClick: () => void;
}

export default function BICard({ item, isSelected, onClick }: BICardProps) {
  const emoji = getEmoji(item.name);
  const color = getColor(item.name);
  const latestPrice = getBILatestPrice(item);
  const weeklyChange = getBIWeeklyChange(item);
  const priceHistory = getBIPriceHistory(item);
  const rec = getBIRecommendation(item);

  const isUp = weeklyChange > 0;
  const isDown = weeklyChange < 0;

  const recBadgeClass = {
    green: "bg-green-500 hover:bg-green-500 text-white border-0",
    red: "bg-red-500 hover:bg-red-500 text-white border-0",
    yellow: "bg-amber-400 hover:bg-amber-400 text-white border-0",
  }[rec.color];

  return (
    <Card
      onClick={onClick}
      className={`relative cursor-pointer transition-all duration-300 overflow-hidden
        ${isSelected
          ? "border-primary shadow-2xl shadow-primary/20 scale-[1.02]"
          : "border-border/50 hover:border-primary/50 hover:shadow-xl hover:-translate-y-1"
        }`}
    >
      {isSelected && (
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-green-400 via-emerald-500 to-teal-400" />
      )}

      <CardContent className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl ${color.bgClass}`}>
              {emoji}
            </div>
            <div>
              <h3 className="font-bold text-foreground text-sm leading-tight">{item.name}</h3>
              <span className="text-xs text-muted-foreground">per kg • {item.category}</span>
            </div>
          </div>
          <Badge className={`text-[10px] font-black tracking-wide ${recBadgeClass}`}>
            {rec.action}
          </Badge>
        </div>

        {/* Price */}
        <div className="mb-3">
          <div className="text-xl font-black text-foreground">{formatRupiah(latestPrice)}</div>
          <div className="flex items-center gap-2 mt-1">
            <div className={`flex items-center gap-1 text-xs font-bold
              ${isUp ? "text-green-600" : isDown ? "text-red-500" : "text-muted-foreground"}`}>
              {isUp ? <TrendingUp className="w-3.5 h-3.5" /> : isDown ? <TrendingDown className="w-3.5 h-3.5" /> : <Minus className="w-3.5 h-3.5" />}
              {weeklyChange > 0 ? "+" : ""}{weeklyChange.toFixed(1)}% minggu ini
            </div>
          </div>
        </div>

        {/* Mini chart */}
        {priceHistory.length > 1 && (
          <div className="h-20">
            <PriceChart data={priceHistory} color={color.chartColor} commodityName={item.name} mini />
          </div>
        )}

        {/* Recommendation */}
        <div className={`mt-3 rounded-lg px-2.5 py-2 text-xs font-medium leading-relaxed
          ${rec.color === "green" ? "bg-green-50 text-green-700 border border-green-200" :
            rec.color === "red" ? "bg-red-50 text-red-700 border border-red-200" :
            "bg-amber-50 text-amber-700 border border-amber-200"
          }`}>
          {rec.reason}
        </div>
      </CardContent>
    </Card>
  );
}
