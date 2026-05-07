import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Paket Harga",
  description:
    "Pilih paket AgriSight yang sesuai kebutuhan Anda — Petani Pemula (Gratis), Petani Cerdas (Pro), atau Juragan Bisnis. Akses data harga pangan real-time dari Bank Indonesia.",
};

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
