import { ImpactCard } from '@/components/drill-through/impact-card';
import { KpiRow, type KpiRowItem } from '@/components/drill-through/kpi-row';
import { BarChart, type BarChartRow } from '@/components/drill-through/bar-chart';
import { Section } from '@/components/drill-through/section';

const kpiItems: KpiRowItem[] = [
  { label: 'Endpoints', value: '500+', colour: 'var(--amber)', delta: '↑ automated', deltaUp: true },
  { label: 'Manual Work Cut', value: '95%', colour: 'var(--green)', delta: '↓ eliminated', deltaUp: true },
  { label: 'Data Quality', value: '99.2%', colour: 'var(--blue)', delta: '↑ accuracy', deltaUp: true },
];

const sourceRows: BarChartRow[] = [
  { label: 'News Feeds', width: '82%', colour: 'var(--amber)', text: '200+' },
  { label: 'Market Data', width: '55%', colour: 'var(--amber)', text: '120+' },
  { label: 'Company Sites', width: '44%', colour: 'var(--blue)', text: '100+' },
  { label: 'Gov Portals', width: '36%', colour: 'var(--blue)', text: '80+' },
];

export function DataSources() {
  return (
    <div data-testid="report-data-sources">
      <ImpactCard
        value="500+"
        colour="var(--amber)"
        description="Web sources automated into a single unified data pipeline — eliminating manual copy-paste across news feeds, market data providers, company sites, and government portals."
      />

      <KpiRow items={kpiItems} />

      <Section title="Sources by Category">
        <BarChart rows={sourceRows} />
      </Section>

      <Section title="Pipeline Overview">
        <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.7 }}>
          Built during the Mechanismic internship using Python-based scrapers with rotating
          proxies, structured JSON output, and a validation layer that flags anomalies before
          data reaches downstream reports. The pipeline runs on a daily schedule with error
          alerting via email digest.
        </p>
      </Section>
    </div>
  );
}
