import { Header } from '@/components/dashboard/header';
import { Highlights } from '@/components/dashboard/highlights';
import { KpiTile } from '@/components/dashboard/kpi-tile';
import { kpis } from '@/lib/data';

export default function Dashboard() {
  return (
    <main className="relative z-[1] max-w-[1320px] mx-auto px-8 py-7 pb-20">
      <Header />
      <Highlights />
      <div className="grid grid-cols-12 gap-4">
        {kpis.map((kpi) => (
          <KpiTile key={kpi.id} kpi={kpi} className="col-span-3" />
        ))}
      </div>
    </main>
  );
}
