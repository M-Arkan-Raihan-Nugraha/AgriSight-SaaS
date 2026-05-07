// ─── Types ───

export type Location = "cianjur" | "jabar" | "nasional";
export type PriceType = "produsen" | "pasar_tradisional" | "pasar_modern" | "pedagang_besar";

export const LOCATION_LABELS: Record<Location, string> = {
  cianjur: "Cianjur",
  jabar: "Jawa Barat",
  nasional: "Nasional",
};

export const PRICE_TYPE_LABELS: Record<PriceType, string> = {
  produsen: "Produsen",
  pasar_tradisional: "Pasar Tradisional",
  pasar_modern: "Pasar Modern",
  pedagang_besar: "Pedagang Besar",
};

export const PRICE_TYPE_EMOJI: Record<PriceType, string> = {
  produsen: "🌾",
  pasar_tradisional: "🏪",
  pasar_modern: "🏬",
  pedagang_besar: "🚛",
};

export interface BIItem {
  no: string | number;
  name: string;
  level: 1 | 2;
  category: string;
  prices: Record<string, number | null>;
}

export interface PricePoint {
  date: string;
  price: number;
}

export interface Alert {
  id: number;
  commodity: string;
  message: string;
  type: "up" | "down" | "peak";
  time: string;
}

export interface MarginItem {
  name: string;
  produsen: number;
  pasar_tradisional: number | null;
  pasar_modern: number | null;
  pedagang_besar: number | null;
}

// ─── Global data store ───
// data[location][priceType] = BIItem[]
export let priceData: Record<string, Record<string, BIItem[]>> = {};
export let availablePriceTypes: Record<string, string[]> = {};
export let ALERTS: Alert[] = [];

export const LOCATIONS: Location[] = ["cianjur", "jabar", "nasional"];
export const ALL_PRICE_TYPES: PriceType[] = ["produsen", "pasar_tradisional", "pasar_modern", "pedagang_besar"];

// ─── Emoji & color maps ───
const EMOJI_MAP: Record<string, string> = {
  beras: "🌾", cabe: "🌶️", cabai: "🌶️", bawang: "🧅", kacang: "🫘",
  jagung: "🌽", ketela: "🥔", pisang: "🍌", jeruk: "🍊",
};

const COLOR_MAP: Record<string, { chartColor: string; bgClass: string }> = {
  beras: { chartColor: "#f59e0b", bgClass: "bg-amber-50" },
  cabe: { chartColor: "#ef4444", bgClass: "bg-red-50" },
  cabai: { chartColor: "#ef4444", bgClass: "bg-red-50" },
  bawang: { chartColor: "#a855f7", bgClass: "bg-purple-50" },
  kacang: { chartColor: "#22c55e", bgClass: "bg-green-50" },
  jagung: { chartColor: "#eab308", bgClass: "bg-yellow-50" },
  ketela: { chartColor: "#f97316", bgClass: "bg-orange-50" },
  pisang: { chartColor: "#facc15", bgClass: "bg-yellow-50" },
  jeruk: { chartColor: "#fb923c", bgClass: "bg-orange-50" },
};

export function getEmoji(name: string): string {
  const lower = name.toLowerCase();
  for (const [key, emoji] of Object.entries(EMOJI_MAP)) {
    if (lower.includes(key)) return emoji;
  }
  return "🌱";
}

export function getColor(name: string): { chartColor: string; bgClass: string } {
  const lower = name.toLowerCase();
  for (const [key, colors] of Object.entries(COLOR_MAP)) {
    if (lower.includes(key)) return colors;
  }
  return { chartColor: "#16a34a", bgClass: "bg-green-50" };
}

// ─── Data access helpers ───
export function getItems(location: Location, priceType: PriceType): BIItem[] {
  return priceData[location]?.[priceType] || [];
}

export function getLevel2Items(location: Location, priceType: PriceType): BIItem[] {
  return getItems(location, priceType).filter(d => d.level === 2);
}

export function getAvailablePriceTypes(location: Location): PriceType[] {
  const avail = availablePriceTypes[location] || [];
  return avail as PriceType[];
}

// ─── Fetch live data ───
export async function fetchLivePrices(): Promise<{ success: boolean; timestamp: string | null }> {
  try {
    const res = await fetch("/api/prices");
    if (!res.ok) throw new Error("Network error");
    const json = await res.json();

    if (json.success) {
      availablePriceTypes = json.available || {};

      // Parse data
      priceData = {};
      for (const [locKey, ptData] of Object.entries(json.data as Record<string, Record<string, { data: BIItem[] }>>)) {
        priceData[locKey] = {};
        for (const [ptKey, ptResult] of Object.entries(ptData)) {
          priceData[locKey][ptKey] = ptResult.data || [];
        }
      }

      generateAlerts();
      return { success: true, timestamp: json.timestamp };
    }
  } catch (error) {
    console.error("Failed to fetch live prices:", error);
  }
  return { success: false, timestamp: null };
}

// ─── BI Data helpers ───
export function getBIPriceHistory(item: BIItem): PricePoint[] {
  const dates = Object.keys(item.prices).sort((a, b) => {
    const [da, ma, ya] = a.split("/").map(Number);
    const [db, mb, yb] = b.split("/").map(Number);
    return new Date(ya, ma - 1, da).getTime() - new Date(yb, mb - 1, db).getTime();
  });
  return dates
    .filter(d => item.prices[d] !== null)
    .map(d => {
      const [day, month] = d.split("/");
      return { date: `${day}/${month}`, price: item.prices[d]! };
    });
}

export function getBILatestPrice(item: BIItem): number {
  const dates = Object.keys(item.prices).sort((a, b) => {
    const [da, ma, ya] = a.split("/").map(Number);
    const [db, mb, yb] = b.split("/").map(Number);
    return new Date(yb, mb - 1, db).getTime() - new Date(ya, ma - 1, da).getTime();
  });
  for (const d of dates) {
    if (item.prices[d] !== null) return item.prices[d]!;
  }
  return 0;
}

export function getBIWeeklyChange(item: BIItem): number {
  const history = getBIPriceHistory(item);
  if (history.length < 2) return 0;
  const first = history[0].price;
  const last = history[history.length - 1].price;
  if (first === 0) return 0;
  return ((last - first) / first) * 100;
}

// ─── Recommendation ───
export function getBIRecommendation(item: BIItem): {
  action: "JUAL" | "TAHAN" | "PANTAU";
  reason: string;
  color: "green" | "red" | "yellow";
} {
  const change = getBIWeeklyChange(item);
  if (change > 8) return { action: "JUAL", reason: `Harga naik +${change.toFixed(1)}% dalam seminggu. Waktu tepat jual!`, color: "green" };
  if (change > 3) return { action: "JUAL", reason: `Tren naik +${change.toFixed(1)}% mingguan, segera manfaatkan.`, color: "green" };
  if (change < -5) return { action: "TAHAN", reason: `Harga turun ${change.toFixed(1)}% mingguan, tahan sampai pulih.`, color: "red" };
  if (change < -2) return { action: "PANTAU", reason: `Penurunan ${change.toFixed(1)}% terdeteksi, pantau tren.`, color: "yellow" };
  return { action: "PANTAU", reason: "Harga relatif stabil, pantau pergerakan minggu depan.", color: "yellow" };
}

// ─── Supply Chain Margin ───
export function getSupplyChainMargins(location: Location): MarginItem[] {
  const available = getAvailablePriceTypes(location);
  if (!available.includes("produsen") || available.length < 2) return [];

  const produsenItems = getLevel2Items(location, "produsen");
  const margins: MarginItem[] = [];

  for (const prodItem of produsenItems) {
    const prodPrice = getBILatestPrice(prodItem);
    if (prodPrice === 0) continue;

    const margin: MarginItem = {
      name: prodItem.name,
      produsen: prodPrice,
      pasar_tradisional: null,
      pasar_modern: null,
      pedagang_besar: null,
    };

    // Find matching items in other price types
    for (const pt of ["pasar_tradisional", "pasar_modern", "pedagang_besar"] as PriceType[]) {
      if (!available.includes(pt)) continue;
      const items = getLevel2Items(location, pt);
      const match = items.find(i => i.name.trim() === prodItem.name.trim());
      if (match) {
        margin[pt] = getBILatestPrice(match);
      }
    }

    margins.push(margin);
  }

  return margins;
}

// ─── Alerts ───
function generateAlerts() {
  const alerts: Alert[] = [];
  let id = 1;

  // Check produsen data for all locations
  for (const loc of LOCATIONS) {
    const items = getLevel2Items(loc, "produsen");
    for (const item of items) {
      const change = getBIWeeklyChange(item);
      if (Math.abs(change) >= 3) {
        alerts.push({
          id: id++,
          commodity: `${getEmoji(item.name)} ${item.name}`,
          message: `${change > 0 ? "Naik" : "Turun"} ${Math.abs(change).toFixed(1)}% (produsen) di ${LOCATION_LABELS[loc]} minggu ini`,
          type: change > 0 ? "up" : "down",
          time: LOCATION_LABELS[loc],
        });
      }
    }
  }

  // Supply chain margin alerts for nasional
  const margins = getSupplyChainMargins("nasional");
  const highestMargin = margins
    .filter(m => m.pasar_tradisional !== null)
    .sort((a, b) => {
      const marginA = ((a.pasar_tradisional! - a.produsen) / a.produsen) * 100;
      const marginB = ((b.pasar_tradisional! - b.produsen) / b.produsen) * 100;
      return marginB - marginA;
    })[0];

  if (highestMargin && highestMargin.pasar_tradisional) {
    const pct = ((highestMargin.pasar_tradisional - highestMargin.produsen) / highestMargin.produsen * 100);
    alerts.push({
      id: id++,
      commodity: `${getEmoji(highestMargin.name)} ${highestMargin.name}`,
      message: `Margin rantai pasok tertinggi: ${pct.toFixed(0)}% (Produsen → Pasar Tradisional)`,
      type: "peak",
      time: "Nasional",
    });
  }

  ALERTS = alerts.slice(0, 8); // Limit to 8 alerts
}

// ─── Format ───
export function formatRupiah(value: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency", currency: "IDR",
    minimumFractionDigits: 0, maximumFractionDigits: 0,
  }).format(value);
}
