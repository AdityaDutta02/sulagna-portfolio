import { ImpactCard } from '@/components/drill-through/impact-card';
import { BarChart, type BarChartRow } from '@/components/drill-through/bar-chart';
import { DataTable } from '@/components/drill-through/data-table';
import { Section } from '@/components/drill-through/section';

const accuracyRows: BarChartRow[] = [
  { label: 'BERT (baseline)', width: '88%', colour: 'var(--blue)', text: '88% acc' },
  { label: 'MambaBERT', width: '86%', colour: 'var(--green)', text: '86% acc' },
];

const speedRows: BarChartRow[] = [
  { label: 'BERT (baseline)', width: '50%', colour: 'var(--coral)', text: '1.0x' },
  { label: 'MambaBERT', width: '85%', colour: 'var(--green)', text: '1.7x faster' },
];

const stackHeaders = ['Component', 'Technology'];
const stackRows: string[][] = [
  ['Framework', 'PyTorch + HuggingFace'],
  ['Model Base', 'BERT-base-uncased'],
  ['SSM Layer', 'Mamba (S6)'],
  ['Training', 'Cloud GPU (Linux)'],
  ['Evaluation', 'IMDB, SST-2, Yelp'],
];

export function ProjMamba() {
  return (
    <div data-testid="report-proj-mamba">
      <ImpactCard value="🤖" colour="var(--coral)" description="Hybrid Mamba SSM + BERT model for efficient long-text sentiment analysis, reducing compute costs while maintaining accuracy on cloud infrastructure." />
      <Section title="Accuracy Comparison">
        <BarChart rows={accuracyRows} />
      </Section>
      <Section title="Inference Speed">
        <BarChart rows={speedRows} />
      </Section>
      <Section title="Stack">
        <DataTable headers={stackHeaders} rows={stackRows} />
      </Section>
      <Section title="Architecture">
        <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.7 }}>
          Replaced BERT self-attention layers with Mamba SSM blocks for O(n) complexity on long sequences. The hybrid approach retains BERT bidirectional understanding for short contexts while using SSM linear scaling for long-text passages (&gt;2048 tokens).
        </p>
      </Section>
    </div>
  );
}
