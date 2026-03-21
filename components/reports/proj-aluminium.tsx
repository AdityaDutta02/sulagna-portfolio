import { ImpactCard } from '@/components/drill-through/impact-card';
import { KpiRow, type KpiRowItem } from '@/components/drill-through/kpi-row';
import { BarChart, type BarChartRow } from '@/components/drill-through/bar-chart';
import { FilterBar } from '@/components/drill-through/filter-bar';
import { DataTable } from '@/components/drill-through/data-table';
import { Section } from '@/components/drill-through/section';

const kpiItems: KpiRowItem[] = [
  { label: 'Data Points', value: '12K+', colour: 'var(--amber)', delta: 'monthly records' },
  { label: 'Active Clients', value: '24', colour: 'var(--green)', delta: '↑ 35% engagement', deltaUp: true },
  { label: 'Report Cadence', value: 'Monthly', colour: 'var(--blue)', delta: 'automated delivery' },
];

const coverageRows: BarChartRow[] = [
  { label: 'Rolled Coils', width: '90%', colour: 'var(--amber)', text: '90%' },
  { label: 'Plate & Sheet', width: '85%', colour: 'var(--amber)', text: '85%' },
  { label: 'Foil Stock', width: '78%', colour: 'var(--amber)', text: '78%' },
  { label: 'Can Stock', width: '65%', colour: 'var(--warm-brown)', text: '65%' },
];

const pipelineHeaders = ['Stage', 'Tool', 'Frequency', 'Status'];
const pipelineRows: (string | { text: string; bg: string; colour: string })[][] = [
  ['Data Collection', 'Python Scrapers', 'Daily', { text: 'AUTO', bg: 'var(--green-bg)', colour: 'var(--green)' }],
  ['Cleaning', 'Power Query / DAX', 'Daily', { text: 'AUTO', bg: 'var(--green-bg)', colour: 'var(--green)' }],
  ['Dashboard Build', 'Power BI Service', 'Scheduled', { text: 'AUTO', bg: 'var(--green-bg)', colour: 'var(--green)' }],
  ['Client Delivery', 'Email + Portal', 'Monthly', { text: 'SEMI-AUTO', bg: 'var(--amber-glow)', colour: 'var(--amber)' }],
];

export function ProjAluminium() {
  return (
    <div data-testid="report-proj-aluminium">
      <ImpactCard value="LIVE" colour="var(--green)" description="Production Power BI dashboard used by AlCircle clients to track aluminium flat-rolled product market trends across global regions." />
      <Section title="Filter by Region">
        <FilterBar items={['All Regions', 'Asia Pacific', 'Europe', 'Americas', 'Middle East']} />
      </Section>
      <Section title="Key Metrics">
        <KpiRow items={kpiItems} />
      </Section>
      <Section title="Market Coverage">
        <BarChart rows={coverageRows} />
      </Section>
      <Section title="Pipeline Architecture">
        <DataTable headers={pipelineHeaders} rows={pipelineRows} />
      </Section>
      <Section title="Technical Details">
        <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.7 }}>
          The dashboard uses incremental refresh on a 50GB+ dataset. Built parameterized RLS (row-level security) for multi-tenant client access. DAX measures power YoY comparisons, rolling averages, and forecast models. Data sourced from trade databases, LME feeds, and proprietary AlCircle research.
        </p>
      </Section>
    </div>
  );
}
