export interface KpiRowItem {
  label: string;
  value: string;
  colour: string;
  delta?: string;
  deltaUp?: boolean;
}

interface KpiRowProps {
  items: KpiRowItem[];
}

export function KpiRow({ items }: KpiRowProps) {
  return (
    <div
      className="grid gap-3 mb-5"
      style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` }}
      data-testid="kpi-row"
    >
      {items.map((item) => (
        <div
          key={item.label}
          className="rounded-lg p-3.5"
          style={{
            background: 'var(--bg)',
            border: '1px solid var(--border)',
          }}
          data-testid={`kpi-row-item-${item.label}`}
        >
          <div
            className="uppercase tracking-wide mb-1"
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '9px',
              fontWeight: 500,
              color: 'var(--text-dim)',
            }}
          >
            {item.label}
          </div>
          <div
            className="font-mono text-2xl font-bold"
            style={{ color: item.colour }}
          >
            {item.value}
          </div>
          {item.delta !== undefined && (
            <div
              className="font-mono mt-0.5"
              style={{
                fontSize: '10px',
                color: item.deltaUp ? 'var(--green)' : 'var(--text-muted)',
              }}
            >
              {item.delta}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
