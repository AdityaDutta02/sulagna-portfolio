import { NextRequest, NextResponse } from 'next/server';
import { requireAdminAuth } from '@/lib/require-admin-auth';
import { redis } from '@/lib/redis';
import type { Platform } from '@/lib/types';

// GET /api/admin/styleguides?platform=blog|linkedin|twitter
export async function GET(request: NextRequest): Promise<NextResponse> {
  const authError = await requireAdminAuth();
  if (authError) return authError;

  const platform = request.nextUrl.searchParams.get('platform') as Platform | null;
  if (!platform || !['blog', 'linkedin', 'twitter'].includes(platform)) {
    return NextResponse.json({ error: 'platform required' }, { status: 400 });
  }

  const guide = (await redis.get<string>(`styleguide:${platform}`)) ?? '';
  return NextResponse.json({ platform, guide });
}

// PUT /api/admin/styleguides — save a style guide
// Body: { platform, guide }
export async function PUT(request: NextRequest): Promise<NextResponse> {
  const authError = await requireAdminAuth();
  if (authError) return authError;

  let body: unknown;
  try { body = await request.json(); } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { platform, guide } = (body ?? {}) as Record<string, unknown>;
  if (
    typeof platform !== 'string' || !['blog', 'linkedin', 'twitter'].includes(platform) ||
    typeof guide !== 'string'
  ) {
    return NextResponse.json({ error: 'platform and guide required' }, { status: 400 });
  }

  await redis.set(`styleguide:${platform}`, guide);
  return NextResponse.json({ ok: true });
}
