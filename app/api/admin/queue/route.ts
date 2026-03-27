import { NextRequest, NextResponse } from 'next/server';
import { requireAdminAuth } from '@/lib/require-admin-auth';
import { redis } from '@/lib/redis';
import type { Platform, QueueValue } from '@/lib/types';

function queueKey(platform: Platform): string {
  return `queue:${platform}`;
}

// GET /api/admin/queue?platform=blog|linkedin|twitter
export async function GET(request: NextRequest): Promise<NextResponse> {
  const authError = await requireAdminAuth();
  if (authError) return authError;

  const platform = request.nextUrl.searchParams.get('platform') as Platform | null;
  if (!platform || !['blog', 'linkedin', 'twitter'].includes(platform)) {
    return NextResponse.json({ error: 'platform required' }, { status: 400 });
  }

  const raw = (await redis.hgetall<Record<string, string>>(queueKey(platform))) ?? {};
  const entries: Record<string, QueueValue> = {};
  for (const [itemId, val] of Object.entries(raw)) {
    try { entries[itemId] = JSON.parse(val) as QueueValue; } catch { /* skip corrupt entries */ }
  }

  return NextResponse.json({ platform, entries });
}

// POST /api/admin/queue — assign item to queue
// Body: { platform, itemId, itemDate, scheduled }
export async function POST(request: NextRequest): Promise<NextResponse> {
  const authError = await requireAdminAuth();
  if (authError) return authError;

  let body: unknown;
  try { body = await request.json(); } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { platform, itemId, itemDate, scheduled } =
    (body ?? {}) as Record<string, unknown>;

  if (
    typeof platform !== 'string' || !['blog', 'linkedin', 'twitter'].includes(platform) ||
    typeof itemId !== 'string' ||
    typeof itemDate !== 'string' ||
    typeof scheduled !== 'string'
  ) {
    return NextResponse.json({ error: 'platform, itemId, itemDate, scheduled required' }, { status: 400 });
  }

  const value: QueueValue = { itemDate, scheduled };
  await redis.hset(queueKey(platform as Platform), { [itemId]: JSON.stringify(value) });
  return NextResponse.json({ ok: true });
}

// DELETE /api/admin/queue — remove item from queue
// Body: { platform, itemId }
export async function DELETE(request: NextRequest): Promise<NextResponse> {
  const authError = await requireAdminAuth();
  if (authError) return authError;

  let body: unknown;
  try { body = await request.json(); } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { platform, itemId } = (body ?? {}) as Record<string, unknown>;
  if (typeof platform !== 'string' || typeof itemId !== 'string') {
    return NextResponse.json({ error: 'platform and itemId required' }, { status: 400 });
  }

  await redis.hdel(queueKey(platform as Platform), itemId);
  return NextResponse.json({ ok: true });
}
