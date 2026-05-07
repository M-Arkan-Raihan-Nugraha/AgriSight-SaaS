import admin from 'firebase-admin';

function getFirebaseAdmin() {
  if (admin.apps.length > 0) {
    return admin.app();
  }

  if (process.env.FIREBASE_PROJECT_ID) {
    return admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
    });
  }

  throw new Error('Firebase Admin: FIREBASE_PROJECT_ID is not set');
}

export const adminApp = getFirebaseAdmin();
export const adminAuth = admin.auth(adminApp);
export const adminDb = admin.firestore(adminApp);
