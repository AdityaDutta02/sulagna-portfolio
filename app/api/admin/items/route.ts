import { NextRequest, NextResponse } from 'next/server';
import { requireAdminAuth } from '@/lib/require-admin-auth';
import { getRedis } from '@/lib/redis';
import type { TrackedItem } from '@/lib/types';

export async function GET(request: NextRequest): Promise<NextResponse> {
  const authError = await requireAdminAuth();
  if (authError) return authError;

  const date = request.nextUrl.searchParams.get('date');
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ error: 'date (YYYY-MM-DD) required' }, { status: 400 });
  }

  const raw = (await getRedis().hgetall<Record<string, TrackedItem | string>>(`items:${date}`)) ?? {};
  const items: TrackedItem[] = [];
  for (const val of Object.values(raw)) {
    if (!val) continue;
    try {
      items.push(typeof val === 'string' ? JSON.parse(val) as TrackedItem : val);
    } catch { /* skip corrupt */ }
  }
  items.sort((a, b) => b.heuristicScore - a.heuristicScore);

  return NextResponse.json({ date, items });
}

// PUT /api/admin/items — save edited draft back to item
// Body: { itemId, date, draft }
export async function PUT(request: NextRequest): Promise<NextResponse> {
  const authError = await requireAdminAuth();
  if (authError) return authError;

  let body: unknown;
  try { body = await request.json(); } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { itemId, date, draft } = (body ?? {}) as Record<string, unknown>;
  if (typeof itemId !== 'string' || typeof date !== 'string' || typeof draft !== 'string') {
    return NextResponse.json({ error: 'itemId, date, draft required' }, { status: 400 });
  }

  const raw = await getRedis().hget<TrackedItem | string>(`items:${date}`, itemId);
  if (!raw) return NextResponse.json({ error: 'Item not found' }, { status: 404 });

  const item: TrackedItem = typeof raw === 'string' ? JSON.parse(raw) as TrackedItem : raw;
  await getRedis().hset(`items:${date}`, { [itemId]: { ...item, draft } });

  return NextResponse.json({ ok: true });
}
