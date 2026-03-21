import type { Metadata } from "next";
import { DM_Sans, JetBrains_Mono, Press_Start_2P } from "next/font/google";
import "./globals.css";

import { DrillProvider } from "@/components/drill-through/drill-context";
import { DrillPanel } from "@/components/drill-through/panel";
import ExcelGrid from "@/components/ambient/excel-grid";
import StatusBadge from "@/components/ambient/status-badge";
import Clock from "@/components/ambient/clock";
import Coffee from "@/components/ambient/coffee";
import MiniChart from "@/components/ambient/mini-chart";
import Particles from "@/components/ambient/particles";
import MusicWidget from "@/components/ambient/music-widget";

const dmSans = DM_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

const pressStart2P = Press_Start_2P({
  variable: "--font-pixel",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://sulagna.dev'),
  title: { default: 'Sulagna Dey — Data Analyst & Power BI Specialist', template: '%s | Sulagna Dey' },
  description: 'Interactive dashboard portfolio showcasing data analysis, Power BI dashboards, and market intelligence work',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://sulagna.dev',
    siteName: 'Sulagna Dey',
    images: [{ url: '/og', width: 1200, height: 630 }],
  },
  twitter: { card: 'summary_large_image' },
  alternates: { canonical: 'https://sulagna.dev' },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${dmSans.variable} ${jetbrainsMono.variable} ${pressStart2P.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-body">
        <DrillProvider>
          {children}
          <DrillPanel />
        </DrillProvider>

        {/* ── Ambient decorations (rendered on every page) ── */}
        <ExcelGrid />
        <Particles />
        <Coffee />
        <Clock />
        <MiniChart />
        <MusicWidget />
        <StatusBadge />
      </body>
    </html>
  );
}
