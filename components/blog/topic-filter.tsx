import Link from 'next/link';

interface TopicFilterProps { topics: string[]; activeTopic: string | null; }

export function TopicFilter({ topics, activeTopic }: TopicFilterProps) {
  const allTopics = ['All', ...topics];
  return (
    <div className="flex flex-wrap gap-2 mb-5">
      {allTopics.map(topic => {
        const isActive = topic === 'All' ? !activeTopic : activeTopic === topic;
        const href = topic === 'All' ? '/blog' : `/blog/topic/${topic}`;
        return (
          <Link key={topic} href={href}
            className="px-3.5 py-1.5 rounded-full text-[10px] font-medium transition-all no-underline"
            style={{
              fontFamily: 'var(--font-mono)',
              background: isActive ? 'var(--amber)' : 'var(--bg)',
              color: isActive ? '#fff' : 'var(--text)',
              border: `1px solid ${isActive ? 'var(--amber)' : 'var(--border)'}`,
            }}
          >{topic}</Link>
        );
      })}
    </div>
  );
}
