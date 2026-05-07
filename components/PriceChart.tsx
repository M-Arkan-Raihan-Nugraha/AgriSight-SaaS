"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { PricePoint } from "@/data/commodityData";

interface PriceChartProps {
  data: PricePoint[];
  color: string;
  commodityName: string;
  mini?: boolean;
}

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-100 rounded-xl shadow-xl px-4 py-3">
        <p className="text-xs text-gray-500 mb-1">{label}</p>
        <p className="text-base font-bold text-gray-900">
          {new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
          }).format(payload[0].value)}
          <span className="text-xs font-normal text-gray-500">/kg</span>
        </p>
      </div>
    );
  }
  return null;
};

export default function PriceChart({ data, color, commodityName, mini = false }: PriceChartProps) {
  const gradientId = `gradient-${commodityName.replace(/\s/g, "")}`;

  return (
    <div className={`w-full ${mini ? "h-full" : "h-48"}`}>
      <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
        <AreaChart data={data} margin={{ top: 5, right: mini ? 0 : 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.3} />
              <stop offset="95%" stopColor={color} stopOpacity={0.02} />
            </linearGradient>
          </defs>
          {!mini && <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />}
          {!mini && (
            <XAxis
              dataKey="date"
              tick={{ fontSize: 10, fill: "#9ca3af" }}
              axisLine={false}
              tickLine={false}
            />
          )}
          {!mini && (
            <YAxis
              tick={{ fontSize: 10, fill: "#9ca3af" }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) =>
                new Intl.NumberFormat("id-ID", {
                  notation: "compact",
                  compactDisplay: "short",
                }).format(v)
              }
              width={45}
            />
          )}
          {!mini && <Tooltip content={<CustomTooltip />} />}
          <Area
            type="monotone"
            dataKey="price"
            stroke={color}
            strokeWidth={mini ? 1.5 : 2.5}
            fill={`url(#${gradientId})`}
            dot={mini ? false : { fill: color, r: 3, strokeWidth: 0 }}
            activeDot={mini ? false : { fill: color, r: 5, strokeWidth: 2, stroke: "#fff" }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
