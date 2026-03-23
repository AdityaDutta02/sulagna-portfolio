'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { type BlogPost } from '@/lib/blog';
import TOPIC_COLOURS from './topic-colours.json';

// TopicStyle describes the bg/text CSS variable pair for a topic pill.
type TopicStyle = { bg: string; text: string };
const FALLBACK_STYLE: TopicStyle = { bg: 'var(--bg-subtle)', text: 'var(--text-muted)' };
const MONO_STYLE = { fontFamily: 'var(--font-mono)' } as const;
const COLOUR_MAP = TOPIC_COLOURS as Record<string, TopicStyle>;

export interface PostCardProps {
  post: BlogPost;
  featured?: boolean;
}

export function PostCard({ post, featured = false }: PostCardProps) {
  const topicStyle = COLOUR_MAP[post.topic.toLowerCase()] ?? FALLBACK_STYLE;
  const padding    = featured ? 'p-5' : 'p-4';
  const titleSize  = featured ? 'text-[16px]' : 'text-[14px]';
  const clampClass = featured ? 'line-clamp-3' : 'line-clamp-2';

  return (
    <motion.div
      className={`relative overflow-hidden rounded-xl ${padding} bg-[var(--bg-card)] border border-[var(--border)]`}
      whileHover={{ y: -3, boxShadow: 'var(--shadow-card)', borderColor: 'var(--amber)' }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      data-testid={`post-card-${post.slug}`}
    >
      <motion.div
        className="absolute top-0 left-1/2 h-[2px] -translate-x-1/2"
        style={{ background: 'var(--amber)', width: '0%' }}
        whileHover={{ width: '100%' }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        aria-hidden="true"
      />

      <Link
        href={`/blog/${post.slug}`}
        className="flex flex-col gap-2 h-full no-underline"
        data-testid={`post-card-link-${post.slug}`}
      >
        <span
          className="inline-flex self-start items-center rounded-full px-2 py-[3px] text-[8px] font-semibold uppercase tracking-widest"
          style={{ ...MONO_STYLE, background: topicStyle.bg, color: topicStyle.text }}
          data-testid={`post-topic-${post.slug}`}
        >
          {post.topic}
        </span>

        <h2
          className={`${titleSize} font-bold leading-snug`}
          style={{ ...MONO_STYLE, color: 'var(--text)' }}
        >
          {post.title}
        </h2>

        <p
          className={`text-[11px] leading-relaxed ${clampClass}`}
          style={{ color: 'var(--text-muted)' }}
        >
          {post.excerpt}
        </p>

        <div
          className="flex items-center gap-3 mt-auto pt-1 text-[9px]"
          style={{ ...MONO_STYLE, color: 'var(--text-dim)' }}
        >
          <span>&#9749; {post.readingTime} min read</span>
          <span>{post.date}</span>
        </div>
      </Link>
    </motion.div>
  );
}
