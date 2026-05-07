import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Masuk atau Daftar",
  description:
    "Masuk atau buat akun AgriSight untuk mendapatkan akses penuh ke data harga pangan real-time, rekomendasi jual/tahan, dan analisis margin rantai pasok.",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
