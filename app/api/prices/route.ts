import { NextResponse } from 'next/server';
import {
  fetchBI,
  PRICE_TYPES,
  LOCATIONS,
  LOCATION_PRICE_TYPES,
  BIResult,
} from '@/lib/bi-fetcher';

export const dynamic = 'force-dynamic';
export const maxDuration = 60; // Allow up to 60s for Vercel Pro, 10s for hobby

export async function GET() {
  try {
    const result: Record<string, Record<string, BIResult>> = {};

    for (const [locKey, priceTypes] of Object.entries(LOCATION_PRICE_TYPES)) {
      result[locKey] = {};
      for (const ptKey of priceTypes) {
        let success = false;
        let retries = 3;
        while (!success && retries > 0) {
          try {
            result[locKey][ptKey] = await fetchBI(locKey, ptKey);
            success = true;
            // Increased delay to prevent connection drops from legacy BI servers
            await new Promise((r) => setTimeout(r, 1200));
          } catch (err: unknown) {
            retries--;
            const message = err instanceof Error ? err.message : String(err);
            console.error(
              `Error fetching ${locKey}/${ptKey} (retries left: ${retries}):`,
              message
            );
            if (retries === 0) {
              result[locKey][ptKey] = {
                data: [],
                error: message,
                location: LOCATIONS[locKey].label,
                price_type: PRICE_TYPES[ptKey].label,
                price_type_key: ptKey,
              };
            } else {
              // Longer wait on retry to let the server recover
              await new Promise((r) => setTimeout(r, 3000));
            }
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      price_types: Object.fromEntries(
        Object.entries(PRICE_TYPES).map(([k, v]) => [k, v.label])
      ),
      locations: Object.fromEntries(
        Object.entries(LOCATIONS).map(([k, v]) => [k, v.label])
      ),
      available: LOCATION_PRICE_TYPES,
      data: result,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
