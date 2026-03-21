import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { getAllPosts, getPostBySlug } from '@/lib/blog';
import { PostLayout } from '@/components/blog/post-layout';
import { ShareButtons } from '@/components/blog/share-buttons';
import { KeyMetrics } from '@/components/blog/key-metrics';
import { AuthorCard } from '@/components/blog/author-card';
import { PostCard } from '@/components/blog/post-card';
import { DataCallout } from '@/components/blog/data-callout';
import type { Metadata } from 'next';

const mdxComponents = { DataCallout };

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `https://sulagna.dev/blog/${slug}` },
    openGraph: { images: [{ url: `/blog/og/${slug}`, width: 1200, height: 630 }] },
  };
}

export function generateStaticParams() {
  return getAllPosts().map(p => ({ slug: p.slug }));
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const allPosts = getAllPosts();
  const related = allPosts.filter(p => p.slug !== post.slug).slice(0, 3);

  // Static JSON-LD — all values sourced from MDX frontmatter, not user runtime input
  const postJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    author: {
      '@type': 'Person',
      name: 'Sulagna Dey',
      jobTitle: 'Data Analyst',
      url: 'https://sulagna.dev',
    },
    datePublished: post.date,
    dateModified: post.updated ?? post.date,
    image: `https://sulagna.dev/blog/og/${post.slug}`,
    keywords: post.tags.join(', '),
  };

  return (
    <PostLayout>
      {/* Static JSON-LD structured data — MDX frontmatter values, not user input */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(postJsonLd) }}
      />
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="px-2 py-0.5 rounded text-[9px] font-semibold uppercase" style={{ fontFamily: 'var(--font-mono)', background: 'var(--amber-glow)', color: 'var(--amber)' }}>{post.topic}</span>
          <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>{post.date}</span>
          <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>{post.readingTime} min read ☕</span>
        </div>
        <ShareButtons title={post.title} />
      </div>
      <h1 className="text-2xl font-bold mb-4" style={{ fontFamily: 'var(--font-mono)', color: 'var(--text)' }}>{post.title}</h1>
      <KeyMetrics dataPoints={post.dataPoints} sources={post.sources} insightScore={post.insightScore} />
      <article className="prose-custom" style={{ fontSize: '15px', color: 'var(--text)', lineHeight: 1.8 }}>
        <MDXRemote source={post.content} components={mdxComponents} />
      </article>
      <div className="flex flex-wrap gap-1.5 mt-6 mb-4">
        {post.tags.map(tag => (
          <span key={tag} className="px-2.5 py-1 rounded-full text-[9px]" style={{ fontFamily: 'var(--font-mono)', background: 'var(--bg-subtle)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}>{tag}</span>
        ))}
      </div>
      <AuthorCard />
      {related.length > 0 && (
        <div className="mt-10">
          <div className="text-[10px] font-semibold uppercase tracking-widest mb-4" style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>Related Posts</div>
          <div className="grid grid-cols-3 gap-4">
            {related.map(p => <PostCard key={p.slug} post={p} />)}
          </div>
        </div>
      )}
    </PostLayout>
  );
}
