import { ReadingBar } from './reading-bar';
interface PostLayoutProps { children: React.ReactNode; }
export function PostLayout({ children }: PostLayoutProps) {
  return (
    <>
      <ReadingBar />
      <div className="max-w-[720px] mx-auto px-6 py-8">{children}</div>
    </>
  );
}
