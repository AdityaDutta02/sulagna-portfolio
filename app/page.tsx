import { Header } from '@/components/dashboard/header';
import { Highlights } from '@/components/dashboard/highlights';
import { DashboardGrid } from '@/components/dashboard/dashboard-grid';
import { GridToggle } from '@/components/ambient/grid-toggle';
import { kpis } from '@/lib/data';

export default function Dashboard() {
  const personJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Sulagna Dey',
    jobTitle: 'Data Analyst & Power BI Specialist',
    description: 'Data Analyst at AlCircle specializing in aluminium market intelligence, Power BI dashboards, and data automation. PL-300 Certified. Gold Medalist from Midnapore College.',
    url: 'https://sulagna.dev',
    sameAs: ['https://linkedin.com/in/sulagna-dey'],
    image: 'https://sulagna.dev/og',
    alumniOf: [
      { '@type': 'CollegeOrUniversity', name: "St. Xavier's College, Kolkata" },
      { '@type': 'CollegeOrUniversity', name: 'Midnapore College' },
    ],
    knowsAbout: ['Power BI', 'Data Analysis', 'Python', 'SQL', 'Tableau', 'Machine Learning', 'Market Analysis', 'Aluminium Market Intelligence', 'Data Visualization', 'DAX', 'ETL', 'Data Automation'],
    hasCredential: [
      { '@type': 'EducationalOccupationalCredential', name: 'Microsoft Power BI PL-300' },
      { '@type': 'EducationalOccupationalCredential', name: 'Tata Data Visualization' },
      { '@type': 'EducationalOccupationalCredential', name: 'Deloitte Analytics' },
    ],
    worksFor: { '@type': 'Organization', name: 'AlCircle' },
  };

  return (
    <main className="relative z-[1] max-w-[1320px] mx-auto px-8 py-4 pb-8">
      {/* Enables excel-grid overlay on dashboard only — blog pages omit this */}
      <GridToggle />
      {/* Static JSON-LD — hardcoded schema data, not user input, safe to render */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />
      <h2 className="sr-only">Data Analyst &amp; Market Analyst Portfolio — Power BI Specialist in Aluminium Market Intelligence</h2>
      <Header />
      <Highlights />
      <DashboardGrid kpis={kpis} />
    </main>
  );
}
