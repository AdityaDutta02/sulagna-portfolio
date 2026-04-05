"use client";

import { usePathname } from "next/navigation";
import Coffee from "./coffee";
import Clock from "./clock";
import MiniChart from "./mini-chart";
import StatusBadge from "./status-badge";

// Only render dashboard-specific ambient decorations on the home page.
// Blog, admin, and keystatic pages get a clean layout.
export default function AmbientGuard() {
  const pathname = usePathname();
  if (pathname !== "/") return null;
  return (
    <>
      <Coffee />
      <Clock />
      <MiniChart />
      <StatusBadge />
    </>
  );
}
