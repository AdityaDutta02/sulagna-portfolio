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
    jobTitle: 'Data Analyst',
    url: 'https://sulagna.dev',
    sameAs: ['https://linkedin.com/in/sulagna-dey'],
    alumniOf: [
      { '@type': 'CollegeOrUniversity', name: "St. Xavier's College, Kolkata" },
      { '@type': 'CollegeOrUniversity', name: 'Midnapore College' },
    ],
    knowsAbout: ['Power BI', 'Data Analysis', 'Python', 'SQL', 'Tableau', 'Machine Learning', 'Data Analysis', 'Market Analysis', 'Power BI', 'Aluminium Market Intelligence', 'Data Visualization'],
    hasCredential: {
      '@type': 'EducationalOccupationalCredential',
      name: 'Microsoft Power BI PL-300',
    },
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
