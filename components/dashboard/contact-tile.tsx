import { contact } from '@/lib/data';

interface ContactTileProps {
  className?: string;
}

interface ContactLinkProps {
  href: string;
  label: string;
  colSpan?: boolean;
  primary?: boolean;
  newTab?: boolean;
  testId: string;
}

function ContactLink(props: ContactLinkProps) {
  const { href, label, colSpan = false, primary = false, newTab = false, testId } = props;

  const baseStyle: React.CSSProperties = primary
    ? { background: 'var(--amber)', borderColor: 'var(--amber)', color: '#fff' }
    : { background: 'var(--bg)', borderColor: 'var(--border)', color: 'var(--text)' };

  function handleMouseEnter(e: React.MouseEvent<HTMLAnchorElement>): void {
    const el = e.currentTarget;
    el.style.background = primary ? '#b5882e' : 'var(--cream)';
    el.style.borderColor = primary ? '#b5882e' : 'var(--amber)';
    el.style.boxShadow = primary
      ? '0 6px 16px rgba(0,0,0,0.12)'
      : '0 4px 12px rgba(0,0,0,0.08)';
  }

  function handleMouseLeave(e: React.MouseEvent<HTMLAnchorElement>): void {
    const el = e.currentTarget;
    el.style.background = baseStyle.background as string;
    el.style.borderColor = baseStyle.borderColor as string;
    el.style.boxShadow = 'none';
  }

  return (
    <a
      href={href}
      target={newTab ? '_blank' : undefined}
      rel={newTab ? 'noopener noreferrer' : undefined}
      className={`${colSpan ? 'col-span-2 ' : ''}flex flex-1 items-center justify-center gap-1.5 rounded-lg border px-2.5 py-3 text-center no-underline transition-all duration-200 hover:-translate-y-0.5`}
      style={{ ...baseStyle, fontSize: '11px', fontWeight: primary ? 600 : 500 }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      data-testid={testId}
    >
      {label}
    </a>
  );
}

export function ContactTile({ className = '' }: ContactTileProps) {
  return (
    <div
      className={`relative cursor-default overflow-hidden rounded-xl p-5 ${className}`}
      style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
      data-testid="contact-tile"
    >
      {/* Label */}
      <div
        className="mb-3 text-[10px] uppercase tracking-widest"
        style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}
      >
        <span
          style={{
            fontFamily: 'var(--font-pixel)',
            fontSize: '6px',
            color: 'var(--amber)',
            marginRight: '5px',
          }}
          aria-hidden="true"
        >
          ▶
        </span>
        Transmit
      </div>

      {/* Desktop: horizontal pill layout */}
      <div className="hidden lg:flex items-center gap-2 mt-1">
        <ContactLink href={contact.resumePath} label="Resume" testId="contact-resume" />
        <ContactLink
          href={contact.linkedin}
          label="LinkedIn"
          newTab
          primary
          testId="contact-linkedin"
        />
        <ContactLink
          href={`mailto:${contact.email}`}
          label="Email"
          testId="contact-email"
        />
      </div>

      {/* Mobile: stacked grid layout */}
      <div className="grid grid-cols-2 gap-2 mt-1 lg:hidden">
        <ContactLink href={contact.resumePath} label="Resume" testId="contact-resume-mobile" />
        <ContactLink
          href={contact.linkedin}
          label="LinkedIn"
          newTab
          primary
          testId="contact-linkedin-mobile"
        />
        <ContactLink
          href={`mailto:${contact.email}`}
          label={contact.email}
          colSpan
          testId="contact-email-mobile"
        />
      </div>
    </div>
  );
}
