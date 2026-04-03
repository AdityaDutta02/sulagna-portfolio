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
    keywords: post.tags,
    authors: [{ name: 'Sulagna Dey', url: 'https://sulagna.dev' }],
    alternates: { canonical: `https://sulagna.dev/blog/${slug}` },
    openGraph: {
      type: 'article',
      title: post.title,
      description: post.excerpt,
      publishedTime: post.date,
      modifiedTime: post.updated ?? post.date,
      authors: ['Sulagna Dey'],
      tags: post.tags,
      images: [{ url: `/blog/og/${slug}`, width: 1200, height: 630, alt: post.title }],
    },
    twitter: { card: 'summary_large_image', title: post.title, description: post.excerpt, images: [`/blog/og/${slug}`] },
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

  const wordCount = post.content.trim().split(/\s+/).length;
  const postJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    author: {
      '@type': 'Person',
      name: 'Sulagna Dey',
      jobTitle: 'Data Analyst & Power BI Specialist',
      url: 'https://sulagna.dev',
      sameAs: ['https://linkedin.com/in/sulagna-dey'],
    },
    publisher: { '@type': 'Person', name: 'Sulagna Dey', url: 'https://sulagna.dev' },
    datePublished: post.date,
    dateModified: post.updated ?? post.date,
    image: `https://sulagna.dev/blog/og/${post.slug}`,
    keywords: post.tags.join(', '),
    wordCount,
    articleSection: post.topic,
    inLanguage: 'en',
    url: `https://sulagna.dev/blog/${post.slug}`,
    mainEntityOfPage: { '@type': 'WebPage', '@id': `https://sulagna.dev/blog/${post.slug}` },
  };

  return (
    <PostLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(postJsonLd) }}
      />

      {/* ── Article header ── */}
      <header className="mb-8">
        {/* Meta row: topic + date + reading time + share */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <span
              className="px-2.5 py-1 rounded-full text-[9px] font-semibold uppercase tracking-wider"
              style={{ fontFamily: 'var(--font-mono)', background: 'var(--amber-glow)', color: 'var(--amber)' }}
            >
              {post.topic}
            </span>
            <span className="text-[11px]" style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-dim)' }}>
              {post.date}
            </span>
            <span className="text-[11px]" style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-dim)' }}>
              {post.readingTime} min read
            </span>
          </div>
          <ShareButtons title={post.title} />
        </div>

        {/* Title */}
        <h1
          className="text-2xl sm:text-3xl md:text-[36px] font-bold leading-tight mb-5"
          style={{ fontFamily: 'var(--font-mono)', color: 'var(--text)', letterSpacing: '-0.5px' }}
        >
          {post.title}
        </h1>

        {/* Excerpt as lede */}
        <p
          className="text-base leading-relaxed mb-6"
          style={{ color: 'var(--text-muted)', maxWidth: '580px' }}
        >
          {post.excerpt}
        </p>

        {/* Key metrics bar */}
        <KeyMetrics dataPoints={post.dataPoints} sources={post.sources} insightScore={post.insightScore} />
      </header>

      {/* ── Article body ── */}
      <article className="prose-custom">
        <MDXRemote source={post.content} components={mdxComponents} />
      </article>

      {/* ── Tags ── */}
      <div className="flex flex-wrap gap-1.5 mt-10 pt-6" style={{ borderTop: '1px solid var(--border)' }}>
        {post.tags.map(tag => (
          <span
            key={tag}
            className="px-3 py-1 rounded-full text-[10px] font-medium"
            style={{
              fontFamily: 'var(--font-mono)',
              background: 'var(--bg-subtle)',
              border: '1px solid var(--border)',
              color: 'var(--text-muted)',
            }}
          >
            #{tag}
          </span>
        ))}
      </div>

      {/* ── Author ── */}
      <AuthorCard />

      {/* ── Related posts ── */}
      {related.length > 0 && (
        <div className="mt-14">
          <div
            className="text-xs font-semibold uppercase tracking-widest mb-5 pb-3"
            style={{
              fontFamily: 'var(--font-mono)',
              color: 'var(--text-dim)',
              borderBottom: '1px solid var(--border)',
            }}
          >
            More from the Research Feed
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {related.map(p => <PostCard key={p.slug} post={p} />)}
          </div>
        </div>
      )}
    </PostLayout>
  );
}
