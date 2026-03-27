import { NextRequest, NextResponse } from 'next/server';
import { requireAdminAuth } from '@/lib/require-admin-auth';
import { redis } from '@/lib/redis';
import type { TrackedItem } from '@/lib/types';

export async function GET(request: NextRequest): Promise<NextResponse> {
  const authError = await requireAdminAuth();
  if (authError) return authError;

  const date = request.nextUrl.searchParams.get('date');
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ error: 'date (YYYY-MM-DD) required' }, { status: 400 });
  }

  const raw = (await redis.hgetall<Record<string, string>>(`items:${date}`)) ?? {};
  const items: TrackedItem[] = [];
  for (const val of Object.values(raw)) {
    try { items.push(JSON.parse(val) as TrackedItem); } catch { /* skip corrupt */ }
  }
  items.sort((a, b) => b.heuristicScore - a.heuristicScore);

  return NextResponse.json({ date, items });
}
