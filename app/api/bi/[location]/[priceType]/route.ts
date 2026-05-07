import { NextRequest, NextResponse } from 'next/server';
import { fetchBI, LOCATIONS, PRICE_TYPES, LOCATION_PRICE_TYPES } from '@/lib/bi-fetcher';

export const dynamic = 'force-dynamic';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ location: string; priceType: string }> }
) {
  const { location, priceType } = await params;

  if (!LOCATIONS[location] || !PRICE_TYPES[priceType]) {
    return NextResponse.json(
      { success: false, message: 'Invalid location or price type' },
      { status: 400 }
    );
  }

  const available = LOCATION_PRICE_TYPES[location];
  if (!available.includes(priceType)) {
    return NextResponse.json(
      { success: false, message: `${priceType} not available for ${location}` },
      { status: 400 }
    );
  }

  try {
    const data = await fetchBI(location, priceType);
    return NextResponse.json({ success: true, ...data });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`BI API error (${location}/${priceType}):`, message);
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
