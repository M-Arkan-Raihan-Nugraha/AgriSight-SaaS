import axios from 'axios';
import https from 'https';
import crypto from 'crypto';

// ─── Config ───
export const PRICE_TYPES: Record<string, { id: number; label: string }> = {
  produsen:          { id: 4, label: 'Produsen' },
  pasar_tradisional: { id: 1, label: 'Pasar Tradisional' },
  pasar_modern:      { id: 2, label: 'Pasar Modern' },
  pedagang_besar:    { id: 3, label: 'Pedagang Besar' },
};

export const LOCATIONS: Record<string, { province_id: string; regency_id: string; label: string }> = {
  cianjur:  { province_id: '12', regency_id: '96', label: 'Cianjur' },
  jabar:    { province_id: '12', regency_id: '',   label: 'Jawa Barat' },
  nasional: { province_id: '',   regency_id: '',   label: 'Nasional' },
};

// Cianjur only has Produsen data
export const LOCATION_PRICE_TYPES: Record<string, string[]> = {
  cianjur:  ['produsen'],
  jabar:    ['produsen', 'pasar_tradisional', 'pasar_modern', 'pedagang_besar'],
  nasional: ['produsen', 'pasar_tradisional', 'pasar_modern', 'pedagang_besar'],
};

// Farm commodity filter (for BI data)
const BI_FARM_CATEGORIES = ['beras', 'bawang merah', 'bawang putih', 'cabai merah', 'cabai rawit'];

function isFarmCategoryBI(name: string): boolean {
  const lower = name.toLowerCase().trim();
  return BI_FARM_CATEGORIES.some(kw => lower.includes(kw));
}

// Parse BI price string "13,500" → 13500
function parseBIPrice(priceStr: string | null | undefined): number | null {
  if (!priceStr || priceStr === '-') return null;
  return parseInt(priceStr.replace(/,/g, ''), 10);
}

// Build dynamic date range
function buildDateRange(): { start_date: string; end_date: string } {
  const end = new Date();
  const start = new Date();
  start.setDate(end.getDate() - 8);
  const fmt = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  return { start_date: fmt(start), end_date: fmt(end) };
}

// ─── In-memory cache (TTL-based, suitable for serverless with keep-alive) ───
interface CacheEntry {
  data: unknown;
  expiresAt: number;
}

const cache = new Map<string, CacheEntry>();
const CACHE_TTL = 30 * 60 * 1000; // 30 minutes

function cacheGet(key: string): unknown | null {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    cache.delete(key);
    return null;
  }
  return entry.data;
}

function cacheSet(key: string, data: unknown): void {
  cache.set(key, { data, expiresAt: Date.now() + CACHE_TTL });
}

// ─── Fetch BI PIHPS data ───
export interface BIProcessedItem {
  no: string | number;
  name: string;
  level: number;
  category: string | null;
  prices: Record<string, number | null>;
}

export interface BIResult {
  location: string;
  price_type: string;
  price_type_key: string;
  data: BIProcessedItem[];
  error?: string;
}

export async function fetchBI(locationKey: string, priceTypeKey: string): Promise<BIResult> {
  const cacheKey = `bi_${locationKey}_${priceTypeKey}`;
  const cached = cacheGet(cacheKey);
  if (cached) return cached as BIResult;

  const loc = LOCATIONS[locationKey];
  const pt = PRICE_TYPES[priceTypeKey];
  const { start_date, end_date } = buildDateRange();

  const url = 'https://www.bi.go.id/hargapangan/WebSite/TabelHarga/GetGridDataDaerah';
  const params = {
    price_type_id: pt.id,
    comcat_id: '',
    province_id: loc.province_id,
    regency_id: loc.regency_id,
    market_id: '',
    tipe_laporan: 1,
    start_date,
    end_date,
    _: Date.now(),
  };

  const httpsAgent = new https.Agent({
    rejectUnauthorized: false,
    secureOptions:
      crypto.constants.SSL_OP_LEGACY_SERVER_CONNECT |
      crypto.constants.SSL_OP_ALLOW_UNSAFE_LEGACY_RENEGOTIATION,
    ciphers: 'DEFAULT:@SECLEVEL=0',
    minVersion: 'TLSv1',
    keepAlive: false,
  });

  const res = await axios.get(url, {
    params,
    timeout: 20000,
    httpsAgent,
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      Accept: 'application/json, text/javascript, */*; q=0.01',
      'Accept-Language': 'en-US,en;q=0.9,id;q=0.8',
      Referer: 'https://www.bi.go.id/hargapangan/',
      Connection: 'close',
    },
  });

  const rawData = res.data?.data || [];
  const processed: BIProcessedItem[] = [];
  let currentCategory: string | null = null;
  let isFarmCategory = false;

  for (const item of rawData) {
    if (item.level === 1) {
      isFarmCategory = isFarmCategoryBI(item.name);
      if (isFarmCategory) currentCategory = item.name;
    }
    if (!isFarmCategory) continue;

    const prices: Record<string, number | null> = {};
    for (const [key, value] of Object.entries(item)) {
      if (/^\d{2}\/\d{2}\/\d{4}$/.test(key)) {
        prices[key] = parseBIPrice(value as string);
      }
    }

    processed.push({
      no: item.no,
      name: item.name.trim(),
      level: item.level,
      category: currentCategory,
      prices,
    });
  }

  const result: BIResult = {
    location: loc.label,
    price_type: pt.label,
    price_type_key: priceTypeKey,
    data: processed,
  };

  cacheSet(cacheKey, result);
  return result;
}
