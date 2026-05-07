# AgriSight – Environment Variables untuk Vercel

Salin variabel-variabel berikut ke **Vercel Dashboard → Settings → Environment Variables**.

## Client-side (NEXT_PUBLIC_*)
Variabel ini akan di-expose ke browser.

| Variable | Contoh | Keterangan |
|---|---|---|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | `AIzaSy...` | Firebase Web API Key |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | `agrisight-xxx.firebaseapp.com` | Firebase Auth Domain |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | `agrisight-xxx` | Firebase Project ID |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | `agrisight-xxx.appspot.com` | Firebase Storage |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | `210974360495` | Firebase Sender ID |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | `1:210974...` | Firebase App ID |
| `NEXT_PUBLIC_APP_URL` | `https://agrisight.vercel.app` | Base URL produksi (untuk redirect pembayaran) |

## Server-side (Secret)
Variabel ini **tidak** pernah sampai ke browser. Hanya digunakan di API Routes.

| Variable | Contoh | Keterangan |
|---|---|---|
| `FIREBASE_PROJECT_ID` | `agrisight-xxx` | Firebase Admin Project ID |
| `FIREBASE_CLIENT_EMAIL` | `firebase-adminsdk-...@...iam.gserviceaccount.com` | Firebase Admin Email |
| `FIREBASE_PRIVATE_KEY` | `-----BEGIN PRIVATE KEY-----\n...` | Firebase Admin Private Key (sertakan `\n`) |
| `MAYAR_API_KEY` | `eyJhbG...` | Mayar Payment Gateway JWT Token |

## Cara Menambahkan di Vercel

1. Buka [Vercel Dashboard](https://vercel.com)
2. Pilih project **agrisight-smart-price-tracker**
3. Navigasi ke **Settings → Environment Variables**
4. Tambahkan setiap variabel di atas
5. Untuk **FIREBASE_PRIVATE_KEY**, pastikan:
   - Pilih "Sensitive" agar tidak muncul di log
   - Sertakan karakter `\n` di dalam string, **bukan** newline sebenarnya
6. Set `NEXT_PUBLIC_APP_URL` ke domain Vercel Anda (contoh: `https://agrisight.vercel.app`)
7. Klik **Save** → **Redeploy**

## Catatan Penting

- Jangan pernah commit file `.env.local` ke Git (sudah di .gitignore)
- `MAYAR_API_KEY` wajib ada di production agar pembayaran berfungsi
- `FIREBASE_PRIVATE_KEY` harus dalam format JSON-escaped (dengan `\n`)
