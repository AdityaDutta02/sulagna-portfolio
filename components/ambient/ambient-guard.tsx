"use client";

import { usePathname } from "next/navigation";
import Coffee from "./coffee";
import StatusBadge from "./status-badge";

// Only render dashboard-specific ambient decorations on the home page.
// Blog, admin, and keystatic pages get a clean layout.
// MiniChart (EQ bars) removed — the music widget already has EQ animation.
export default function AmbientGuard() {
  const pathname = usePathname();
  if (pathname !== "/") return null;
  return (
    <>
      <Coffee />
      <StatusBadge />
    </>
  );
}
