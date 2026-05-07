import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase-admin';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { memberId, parentUserId } = body;

  if (!memberId || !parentUserId) {
    return NextResponse.json(
      { success: false, message: 'Missing required fields' },
      { status: 400 }
    );
  }

  try {
    // 1. Verify if the member belongs to this parent user
    const memberDoc = await adminDb.collection('users').doc(memberId).get();
    
    if (!memberDoc.exists) {
      return NextResponse.json(
        { success: false, message: 'Staf tidak ditemukan.' },
        { status: 404 }
      );
    }

    const memberData = memberDoc.data();
    if (memberData?.parentUserId !== parentUserId) {
      return NextResponse.json(
        { success: false, message: 'Anda tidak memiliki akses untuk menghapus staf ini.' },
        { status: 403 }
      );
    }

    // 2. Delete from Firebase Authentication
    try {
      await adminAuth.deleteUser(memberId);
    } catch (authError) {
      console.error(`Error deleting user auth for ${memberId}:`, authError);
      // We continue even if auth delete fails, as the user might not exist in Auth but exists in Firestore
    }

    // 3. Delete from Firestore
    await adminDb.collection('users').doc(memberId).delete();

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('Error removing team member:', message);
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
