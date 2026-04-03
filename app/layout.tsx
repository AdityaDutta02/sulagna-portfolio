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
  title: { default: 'Sulagna Dey — Data Analyst, Power BI Specialist & Market Intelligence', template: '%s | Sulagna Dey' },
  description: 'Sulagna Dey is a data analyst and Power BI specialist at AlCircle, building aluminium market intelligence dashboards, automating 500+ data pipelines, and writing about data visualization, Python, SQL, and machine learning. PL-300 Certified. Gold Medalist.',
  keywords: ['data analyst', 'Power BI', 'data visualization', 'market intelligence', 'aluminium market', 'DAX', 'Python', 'SQL', 'machine learning', 'data automation', 'Sulagna Dey'],
  authors: [{ name: 'Sulagna Dey', url: 'https://sulagna.dev' }],
  creator: 'Sulagna Dey',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://sulagna.dev',
    siteName: 'Sulagna Dey — Data Analyst & Power BI Specialist',
    title: 'Sulagna Dey — Data Analyst, Power BI Specialist & Market Intelligence',
    description: 'Data analyst building aluminium market intelligence dashboards. PL-300 Certified. Writing about Power BI, data visualization, Python, and machine learning.',
    images: [{ url: '/og', width: 1200, height: 630, alt: 'Sulagna Dey — Data Analyst & Power BI Specialist' }],
  },
  twitter: { card: 'summary_large_image', creator: '@sulagnadey', title: 'Sulagna Dey — Data Analyst & Power BI Specialist', description: 'Data analyst building market intelligence dashboards. PL-300 Certified.', images: ['/og'] },
  alternates: { canonical: 'https://sulagna.dev', types: { 'application/rss+xml': [{ url: '/blog/feed.xml', title: 'Sulagna Dey — Data Science Insights RSS Feed' }] } },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 } },
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
