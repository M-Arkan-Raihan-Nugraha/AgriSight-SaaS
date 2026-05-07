import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const viewport: Viewport = {
  themeColor: "#16a34a",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: {
    default: "AgriSight – Smart Price Tracker untuk Petani Indonesia",
    template: "%s | AgriSight",
  },
  description:
    "AgriSight mengubah data harga pangan resmi Bank Indonesia menjadi keputusan cerdas untuk petani. Pantau harga cabai, beras, bawang secara real-time dari PIHPS, bandingkan margin rantai pasok, dan dapatkan rekomendasi jual/tahan berbasis data.",
  keywords: [
    "harga pangan",
    "harga cabai",
    "harga beras",
    "harga bawang",
    "Bank Indonesia",
    "PIHPS",
    "pertanian",
    "petani",
    "smart farming",
    "agritech",
    "rantai pasok",
    "Cianjur",
    "Jawa Barat",
  ],
  authors: [{ name: "AgriSight Team" }],
  creator: "AgriSight",
  publisher: "AgriSight",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    siteName: "AgriSight",
    title: "AgriSight – Smart Price Tracker untuk Petani Indonesia",
    description:
      "Pantau harga komoditas pangan real-time dari Bank Indonesia PIHPS. Rekomendasi jual/tahan cerdas & analisis margin rantai pasok untuk petani.",
    images: [
      {
        url: "/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "AgriSight – Smart Price Tracker",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AgriSight – Smart Price Tracker untuk Petani Indonesia",
    description:
      "Pantau harga komoditas pangan real-time dari Bank Indonesia PIHPS. Rekomendasi jual/tahan cerdas untuk petani.",
    images: ["/images/og-image.png"],
  },
  icons: {
    icon: "/images/logo.jpeg",
    apple: "/images/logo.jpeg",
  },
  manifest: "/manifest.json",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  ),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={cn("font-sans", geist.variable)} data-scroll-behavior="smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
