'use client';
import { useEffect, useState } from 'react';
export function ReadingBar() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(total > 0 ? (window.scrollY / total) * 100 : 0);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return <div className="fixed top-0 left-0 h-[3px] z-50 transition-[width] duration-150" style={{ width: `${progress}%`, background: 'var(--amber)' }} />;
}
