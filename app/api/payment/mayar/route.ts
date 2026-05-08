import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { adminAuth } from '@/lib/firebase-admin';

export async function POST(request: NextRequest) {
  try {
    // 1. Verifikasi Token JWT (Security Patch)
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized: Missing or invalid token' },
        { status: 401 }
      );
    }

    const idToken = authHeader.split('Bearer ')[1];
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    
    // Ekstrak data terverifikasi dari token Google
    const uid = decodedToken.uid;
    const email = decodedToken.email;
    const name = decodedToken.name || 'AgriSight User';

    // 2. Parse request body hanya untuk tier
    const body = await request.json();
    const { tier } = body;

    // Validasi tier yang diminta
    if (!tier || (tier !== 'pro' && tier !== 'bisnis')) {
      return NextResponse.json(
        { success: false, message: 'Invalid or missing tier' },
        { status: 400 }
      );
    }

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
