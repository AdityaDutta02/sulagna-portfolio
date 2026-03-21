import { ImpactCard } from '@/components/drill-through/impact-card';
import { BarChart, type BarChartRow } from '@/components/drill-through/bar-chart';
import { Section } from '@/components/drill-through/section';

const timelineRows: BarChartRow[] = [
  { label: 'Month 1', width: '30%', colour: 'var(--coral)', text: '30%' },
  { label: 'Month 2', width: '55%', colour: 'var(--coral)', text: '55%' },
  { label: 'Month 3', width: '80%', colour: 'var(--amber)', text: '80%' },
  { label: 'Month 4+', width: '95%', colour: 'var(--green)', text: '95%' },
];

export function Automation() {
  return (
    <div data-testid="report-automation">
      <ImpactCard value="95%" colour="var(--coral)" description="Manual work eliminated — transformed labor-intensive data collection into fully automated pipelines at Mechanismic Inc." />
      <Section title="Automation Timeline">
        <BarChart rows={timelineRows} />
      </Section>
    </div>
  );
}
