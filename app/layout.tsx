import React from "react";
import type { Metadata } from "next";
import { Inter, Bebas_Neue, Caveat, Anton, Syne, Space_Grotesk } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import PerformanceMonitor from "./components/PerformanceMonitor";
import GoogleAnalytics from "./components/GoogleAnalytics";
import { AudioProvider } from "./context/AudioContext";
import { ThemeProvider } from "./components/ThemeProvider";

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

const syne = Syne({
  variable: "--font-syne",
  weight: ["500", "700", "800"],
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
  title: "AeroMat — Murale, Szyldy, Dekoracje | Mateusz",
  description: "Portfolio artysty muralisty. Murale wielkoformatowe, komunikacja wizualna, wnętrza i dekoracje. Ponad 25 lat doświadczenia.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl" suppressHydrationWarning>
      <head>
        <link
          rel="preload"
          as="image"
          href="/images/hero-poster.webp"
          fetchPriority="high"
          type="image/webp"
        />
      </head>
      <body className={`${inter.variable} ${bebasNeue.variable} ${caveat.variable} ${anton.variable} ${syne.variable} ${spaceGrotesk.variable} overflow-y-auto antialiased `}>
        <GoogleAnalytics />
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <AudioProvider>
            <PerformanceMonitor />
            <Navbar />
            {children}
            <Footer />
          </AudioProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
