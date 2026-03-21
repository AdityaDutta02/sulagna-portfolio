import { Header } from '@/components/dashboard/header';
import { Highlights } from '@/components/dashboard/highlights';

export default function Dashboard() {
  return (
    <main className="relative z-[1] max-w-[1320px] mx-auto px-8 py-7 pb-20">
      <Header />
      <Highlights />
    </main>
  );
}
