import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase-admin';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { email, password, name, parentUserId, tier } = body;

  if (!email || !password || !parentUserId) {
    return NextResponse.json(
      { success: false, message: 'Missing required fields' },
      { status: 400 }
    );
  }

  try {
    // 1. Check parent user limit
    const snapshot = await adminDb
      .collection('users')
      .where('parentUserId', '==', parentUserId)
      .get();

    if (snapshot.size >= 5) {
      return NextResponse.json(
        { success: false, message: 'Batas maksimum 5 staf tercapai.' },
        { status: 400 }
      );
    }

    // 2. Create Firebase Auth user
    const userRecord = await adminAuth.createUser({
      email,
      password,
      displayName: name,
    });

    // 3. Save to Firestore
    await adminDb.collection('users').doc(userRecord.uid).set({
      name,
      email,
      tier: tier || 'bisnis',
      role: 'member',
      parentUserId,
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({ success: true, uid: userRecord.uid });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('Error adding team member:', message);
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
