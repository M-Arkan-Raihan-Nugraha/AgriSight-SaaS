import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { uid, tier, email, name } = body;

  if (!uid || !tier) {
    return NextResponse.json(
      { success: false, message: 'Missing uid or tier' },
      { status: 400 }
    );
  }

  try {
    const amount = tier === 'pro' ? 49000 : 499000;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    if (!process.env.MAYAR_API_KEY) {
      return NextResponse.json(
        { success: false, message: 'MAYAR_API_KEY belum dikonfigurasi.' },
        { status: 500 }
      );
    }

    const response = await axios.post(
      'https://api.mayar.id/hl/v1/invoice/create',
      {
        name: name || 'AgriSight User',
        email: email || 'user@example.com',
        mobile: '081234567890',
        redirectUrl: `${appUrl}?upgraded=true`,
        description: `AgriSight ${tier.toUpperCase()} Subscription`,
        referenceId: uid,
        items: [
          {
            description: `Paket ${tier.toUpperCase()}`,
            quantity: 1,
            rate: amount,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.MAYAR_API_KEY}`,
        },
      }
    );

    return NextResponse.json({
      success: true,
      payment_link: response.data.data.link,
    });
  } catch (error: unknown) {
    const axiosErr = error as { response?: { data?: unknown }; message?: string };
    const errorDetail = axiosErr.response?.data || axiosErr.message || 'Unknown error';
    console.error('Mayar API Error:', errorDetail);
    return NextResponse.json(
      {
        success: false,
        message: typeof errorDetail === 'string' ? errorDetail : JSON.stringify(errorDetail),
      },
      { status: 500 }
    );
  }
}
