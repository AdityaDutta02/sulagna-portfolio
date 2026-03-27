import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { requireAdminAuth } from '@/lib/require-admin-auth';
import { getRedis } from '@/lib/redis';
import { parseBody } from '@/lib/parse-body';
import { DEFAULT_FEEDS } from '@/lib/feeds-default';
import type { Feed } from '@/lib/types';

async function loadFeeds(): Promise<Feed[]> {
  const raw = await getRedis().get<Feed[] | string>('feeds');
  if (!raw) return DEFAULT_FEEDS;
  if (Array.isArray(raw)) return raw;
  try { return JSON.parse(raw) as Feed[]; } catch { return DEFAULT_FEEDS; }
}

async function saveFeeds(feeds: Feed[]): Promise<void> {
  await getRedis().set('feeds', feeds);
}

// GET — list all feeds
export async function GET(): Promise<NextResponse> {
  const authError = await requireAdminAuth();
  if (authError) return authError;
  return NextResponse.json({ feeds: await loadFeeds() });
}

// POST — add a feed
export async function POST(request: NextRequest): Promise<NextResponse> {
  const authError = await requireAdminAuth();
  if (authError) return authError;

  const [body, parseError] = await parseBody(request);
  if (parseError) return parseError;

  const { name, url, category, weight, enabled } = body;
  if (typeof name !== 'string' || typeof url !== 'string' || typeof category !== 'string') {
    return NextResponse.json({ error: 'name, url, category required' }, { status: 400 });
  }

  const newFeed: Feed = {
    id: randomUUID(),
    name,
    url,
    category,
    weight: (typeof weight === 'number' && weight >= 1 && weight <= 5 ? weight : 3) as Feed['weight'],
    enabled: enabled !== false,
  };

  const feeds = await loadFeeds();
  feeds.push(newFeed);
  await saveFeeds(feeds);
  return NextResponse.json({ ok: true, feed: newFeed });
}

// PUT — update a feed
export async function PUT(request: NextRequest): Promise<NextResponse> {
  const authError = await requireAdminAuth();
  if (authError) return authError;

  const [body, parseError] = await parseBody(request);
  if (parseError) return parseError;

  const { id, ...updates } = body;
  if (typeof id !== 'string') {
    return NextResponse.json({ error: 'id required' }, { status: 400 });
  }

  const feeds = await loadFeeds();
  const idx = feeds.findIndex((f) => f.id === id);
  if (idx === -1) return NextResponse.json({ error: 'Feed not found' }, { status: 404 });

  feeds[idx] = { ...feeds[idx]!, ...updates } as Feed;
  await saveFeeds(feeds);
  return NextResponse.json({ ok: true });
}

// DELETE — remove a feed
export async function DELETE(request: NextRequest): Promise<NextResponse> {
  const authError = await requireAdminAuth();
  if (authError) return authError;

  const id = request.nextUrl.searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });

  const feeds = await loadFeeds();
  const filtered = feeds.filter((f) => f.id !== id);
  await saveFeeds(filtered);
  return NextResponse.json({ ok: true });
}
