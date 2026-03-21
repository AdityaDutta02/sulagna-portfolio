import { ImpactCard } from '@/components/drill-through/impact-card';
import { KpiRow, type KpiRowItem } from '@/components/drill-through/kpi-row';
import { BarChart, type BarChartRow } from '@/components/drill-through/bar-chart';
import { Section } from '@/components/drill-through/section';

const beforeAfterItems: KpiRowItem[] = [
  { label: 'Before', value: '~8 hrs', colour: 'var(--coral)' },
  { label: 'After', value: '~2.4 hrs', colour: 'var(--green)', delta: '↓ 70%', deltaUp: true },
  { label: 'Saved/Month', value: '5.6 hrs', colour: 'var(--amber)', delta: '↑ per cycle', deltaUp: true },
];

const reportTypeRows: BarChartRow[] = [
  { label: 'Market Overview', width: '82%', colour: 'var(--green)', text: '82%' },
  { label: 'Price Tracking', width: '75%', colour: 'var(--green)', text: '75%' },
  { label: 'Client Briefs', width: '68%', colour: 'var(--green)', text: '68%' },
  { label: 'Forecast Models', width: '55%', colour: 'var(--amber)', text: '55%' },
];

const methodologyText =
  'Improvement measured by comparing average wall-clock time from raw data receipt to ' +
  'final PDF/Power BI publish across 3 months pre-automation vs 3 months post. Timings ' +
  'exclude scheduled refresh windows. Forecast Models show a lower gain due to manual ' +
  'analyst review steps that remain intentionally human-gated.';

export function ReportSpeed() {
  return (
    <div data-testid="report-speed">
      <ImpactCard value="70%" colour="var(--green)" description="Faster report generation at AlCircle — cutting average turnaround from ~8 hrs to ~2.4 hrs per cycle through Power BI automation and templated data pipelines." />
      <Section title="Before vs After">
        <KpiRow items={beforeAfterItems} />
      </Section>
      <Section title="Improvement by Report Type">
        <BarChart rows={reportTypeRows} />
      </Section>
      <Section title="Methodology">
        <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.7 }}>{methodologyText}</p>
      </Section>
    </div>
  );
}
