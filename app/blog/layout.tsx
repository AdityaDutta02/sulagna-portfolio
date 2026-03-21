export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <style>{`body::before { display: none !important; }`}</style>
      {children}
    </>
  );
}
