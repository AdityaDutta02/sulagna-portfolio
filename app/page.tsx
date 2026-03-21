import { Header } from '@/components/dashboard/header';
import { Highlights } from '@/components/dashboard/highlights';
import { DashboardGrid } from '@/components/dashboard/dashboard-grid';
import { kpis } from '@/lib/data';

export default function Dashboard() {
  return (
    <main className="relative z-[1] max-w-[1320px] mx-auto px-8 py-7 pb-20">
      <Header />
      <Highlights />
      <DashboardGrid kpis={kpis} />
    </main>
  );
}
