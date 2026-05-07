import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();

    if (payload.status === 'SUCCESS' || payload.status === 'PAID') {
      const uid = payload.reference_id;
      const amount = payload.amount;
      const tier = amount >= 499000 ? 'bisnis' : 'pro';

      if (uid && process.env.FIREBASE_PROJECT_ID) {
        await adminDb.collection('users').doc(uid).update({ tier });
        console.log(`[WEBHOOK] Upgraded user ${uid} to ${tier}`);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('Webhook Error:', message);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
