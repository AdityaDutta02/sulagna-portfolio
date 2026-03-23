export default function BlogLayout({ children }: { children: React.ReactNode }) {
  // Grid overlay is opt-in via GridToggle on dashboard page only.
  // Blog pages simply don't mount GridToggle, so no grid appears.
  return <>{children}</>;
}
