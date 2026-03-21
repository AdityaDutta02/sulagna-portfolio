interface ImpactCardProps {
  value: string;
  colour: string;
  description: string;
}

export function ImpactCard({ value, colour, description }: ImpactCardProps) {
  return (
    <div
      className="rounded-lg p-5 flex items-center gap-4 mb-5"
      style={{
        background: 'linear-gradient(135deg, var(--amber-glow), var(--cream))',
        border: '1px solid var(--amber-light)',
      }}
      data-testid="impact-card"
    >
      <div
        className="font-mono font-bold shrink-0"
        style={{
          fontSize: '42px',
          color: colour,
          lineHeight: 1,
        }}
        data-testid="impact-card-value"
      >
        {value}
      </div>
      <div
        style={{
          fontSize: '13px',
          color: 'var(--warm-brown)',
          lineHeight: 1.5,
        }}
      >
        {description}
      </div>
    </div>
  );
}
