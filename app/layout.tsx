import React from "react";
import type { Metadata } from "next";
import { Inter, Bebas_Neue, Caveat, Anton, Space_Grotesk } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import PerformanceMonitor from "./components/PerformanceMonitor";
import GoogleAnalytics from "./components/GoogleAnalytics";
import { AudioProvider } from "./context/AudioContext";
import { CONTACT } from "./lib/contact";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://muralelublin.pl";
const SITE_DESCRIPTION =
  "Portfolio artysty muralisty. Murale wielkoformatowe, komunikacja wizualna, wnętrza i dekoracje. Ponad 25 lat doświadczenia.";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "latin-ext"],
});

const bebasNeue = Bebas_Neue({
  variable: "--font-bebas",
  weight: "400",
  subsets: ["latin", "latin-ext"],
});

const anton = Anton({
  variable: "--font-anton",
  weight: "400",
  subsets: ["latin", "latin-ext"],
});

const caveat = Caveat({
  variable: "--font-caveat",
  weight: ["400", "700"],
  subsets: ["latin", "latin-ext"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space",
  weight: ["300", "400", "500", "700"],
  subsets: ["latin", "latin-ext"],
});

// const interSans = Inter({
//   variable: "--font-inter-sans",
//   subsets: ["latin"],
// });

// const outfit = Outfit({
//   variable: "--font-outfit-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "AeroMat — Murale, Szyldy, Dekoracje | Mateusz",
  description: SITE_DESCRIPTION,
  openGraph: {
    type: "website",
    locale: "pl_PL",
    siteName: "AeroMat",
    title: "AeroMat — Murale, Szyldy, Dekoracje",
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    images: [
      {
        url: "/images/hero-poster.webp",
        width: 1200,
        height: 630,
        alt: "AeroMat — murale wielkoformatowe i dekoracje",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AeroMat — Murale, Szyldy, Dekoracje",
    description: SITE_DESCRIPTION,
    images: ["/images/hero-poster.webp"],
  },
};

// Dane strukturalne (JSON-LD) — pomagają Google rozpoznać lokalną firmę z Lublina.
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "AeroMat",
  description: SITE_DESCRIPTION,
  url: SITE_URL,
  image: `${SITE_URL}/images/hero-poster.webp`,
  telephone: CONTACT.phoneTel,
  email: CONTACT.email,
  areaServed: "Polska",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Lublin",
    addressCountry: "PL",
  },
  sameAs: [
    "https://www.facebook.com/aeromat1",
    "https://www.instagram.com/aeromat1/",
    "https://www.youtube.com/@AeroMat1/",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl">
      <head>
        <link
          rel="preload"
          as="image"
          href="/images/hero-poster.webp"
          fetchPriority="high"
          type="image/webp"
        />
        <script
          type="application/ld+json"
          // Treść w 100% statyczna (stałe + env). Ucieczka "<" jako dodatkowe
          // zabezpieczenie, by nic nie mogło zamknąć tagu <script>.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
        />
      </head>
      <body className={`${inter.variable} ${bebasNeue.variable} ${caveat.variable} ${anton.variable} ${spaceGrotesk.variable} overflow-y-auto antialiased `}>
        <GoogleAnalytics />
        <AudioProvider>
          <PerformanceMonitor />
          <Navbar />
          {children}
          <Footer />
        </AudioProvider>
      </body>
    </html>
  );
}
