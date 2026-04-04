import KeystaticApp from './keystatic';

// Full-screen overlay so portfolio ambient decorations don't bleed into the CMS.
export default function KeystaticLayout() {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 50, background: '#fff' }}>
      <KeystaticApp />
    </div>
  );
}
