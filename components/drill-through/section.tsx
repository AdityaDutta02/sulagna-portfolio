interface SectionProps {
  title: string;
  children: React.ReactNode;
}

export function Section({ title, children }: SectionProps) {
  return (
    <div className="mb-7">
      <div
        className="text-[10px] font-semibold uppercase mb-3 pb-2"
        style={{
          fontFamily: 'var(--font-mono)',
          letterSpacing: '1.5px',
          color: 'var(--text-muted)',
          borderBottom: '1px solid var(--border)',
        }}
      >
        {title}
      </div>
      {children}
    </div>
  );
}
