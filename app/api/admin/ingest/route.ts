import { NextRequest, NextResponse } from 'next/server';
import { generateText } from 'ai';
import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import { randomUUID } from 'crypto';
import { redis } from '@/lib/redis';
import { fetchFeedItems } from '@/lib/rss';
import { computeHeuristicScore, countKeywordMatches } from '@/lib/scoring';
import { DEFAULT_FEEDS } from '@/lib/feeds-default';
import { verifySession } from '@/lib/auth';
import { cookies } from 'next/headers';
import type { Feed, TrackedItem } from '@/lib/types';

const openrouter = createOpenRouter({ apiKey: process.env.OPENROUTER_API_KEY ?? '' });

function todayKey(): string {
  return `items:${new Date().toISOString().slice(0, 10)}`;
}

async function isAuthorized(request: NextRequest): Promise<boolean> {
  // Vercel Cron authorization
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret) {
    const auth = request.headers.get('authorization');
    if (auth === `Bearer ${cronSecret}`) return true;
  }
  // Manual trigger: admin session cookie
  const password = process.env.ADMIN_PASSWORD;
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!password || !secret) return false;
  const cookieStore = await cookies();
  const session = cookieStore.get('admin-session')?.value ?? '';
  return verifySession(session, password, secret);
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  if (!(await isAuthorized(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const key = todayKey();
  const now = new Date();

  // Load feeds from Redis; seed defaults on first run
  let feedsRaw = await redis.get<string>('feeds');
  if (!feedsRaw) {
    const serialized = JSON.stringify(DEFAULT_FEEDS);
    await redis.set('feeds', serialized);
    feedsRaw = serialized;
  }
  const feeds: Feed[] = JSON.parse(feedsRaw) as Feed[];
  const enabledFeeds = feeds.filter((f) => f.enabled);

  // Fetch all enabled feeds in parallel; skip failures
  const feedResults = await Promise.allSettled(
    enabledFeeds.map(async (feed) => ({
      feed,
      items: await fetchFeedItems(feed),
    }))
  );

  // Load existing URLs to dedup
  const existingRaw = (await redis.hgetall<Record<string, string>>(key)) ?? {};
  const existingUrls = new Set(
    Object.values(existingRaw).map((v) => {
      try { return (JSON.parse(v) as TrackedItem).url; } catch { return ''; }
    })
  );

  let newCount = 0;
  const cutoffMs = now.getTime() - 24 * 60 * 60 * 1000;

  for (const result of feedResults) {
    if (result.status === 'rejected') continue;
    const { feed, items } = result.value;
    for (const item of items) {
      // item.publishedAt is an ISO string — convert to Date for comparison
      const publishedDate = item.publishedAt ? new Date(item.publishedAt) : null;
      if (!publishedDate || publishedDate.getTime() < cutoffMs) continue;
      if (existingUrls.has(item.url)) continue;

      const hoursOld = (now.getTime() - publishedDate.getTime()) / (1000 * 60 * 60);
      const keywordMatches = countKeywordMatches(`${item.title} ${item.summary}`);
      const heuristicScore = computeHeuristicScore({ hoursOld, weight: feed.weight, keywordMatches });

      const tracked: TrackedItem = {
        id: randomUUID(),
        title: item.title,
        url: item.url,
        source: feed.name,
        summary: item.summary,
        publishedAt: publishedDate.toISOString(),
        heuristicScore,
        tags: [],
        discoverySource: 'rss',
      };

      await redis.hset(key, { [tracked.id]: JSON.stringify(tracked) });
      await redis.expire(key, 14 * 24 * 60 * 60); // 14 days TTL
      existingUrls.add(item.url);
      newCount++;
    }
  }

  // AI discovery scan — failure is non-fatal
  try {
    const { text } = await generateText({
      model: openrouter('qwen/qwen2.5-7b-instruct'),
      prompt:
        'List 5–10 significant developments in data analytics, Power BI, Python, SQL, Tableau, or ML/AI published in the last 24 hours. ' +
        'Return ONLY a JSON array with no extra text: [{"title":"...","url":"...","summary":"...","tags":["..."]}]',
    });

    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      const aiItems = JSON.parse(jsonMatch[0]) as Array<{
        title: string;
        url: string;
        summary: string;
        tags: string[];
      }>;

      for (const aiItem of aiItems) {
        if (!aiItem.title || !aiItem.url || existingUrls.has(aiItem.url)) continue;
        const keywordMatches = countKeywordMatches(`${aiItem.title} ${aiItem.summary ?? ''}`);
        const heuristicScore = computeHeuristicScore({ hoursOld: 0, weight: 3, keywordMatches });

        const tracked: TrackedItem = {
          id: randomUUID(),
          title: aiItem.title,
          url: aiItem.url,
          source: 'AI Discovery',
          summary: (aiItem.summary ?? '').slice(0, 500),
          publishedAt: now.toISOString(),
          heuristicScore,
          tags: Array.isArray(aiItem.tags) ? aiItem.tags : [],
          discoverySource: 'ai-discovery',
        };

        await redis.hset(key, { [tracked.id]: JSON.stringify(tracked) });
        await redis.expire(key, 14 * 24 * 60 * 60);
        existingUrls.add(aiItem.url);
        newCount++;
      }
    }
  } catch {
    // AI scan failure is non-fatal; RSS items already stored
  }

  return NextResponse.json({ ok: true, newItems: newCount });
}
