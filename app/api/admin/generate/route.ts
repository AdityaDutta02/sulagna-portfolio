import { NextRequest, NextResponse } from 'next/server';
import { generateText } from 'ai';
import { requireAdminAuth } from '@/lib/require-admin-auth';
import { getRedis } from '@/lib/redis';
import { openrouter } from '@/lib/openrouter';
import type { Platform, TrackedItem } from '@/lib/types';

const PLATFORM_LABELS: Record<Platform, string> = {
  blog: 'blog post',
  linkedin: 'LinkedIn post',
  twitter: 'tweet (max 280 chars)',
};

export async function POST(request: NextRequest): Promise<NextResponse> {
  const authError = await requireAdminAuth();
  if (authError) return authError;

  let body: unknown;
  try { body = await request.json(); } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { itemId, date, platform } = (body ?? {}) as Record<string, unknown>;

  if (
    typeof itemId !== 'string' ||
    typeof date !== 'string' ||
    typeof platform !== 'string' ||
    !['blog', 'linkedin', 'twitter'].includes(platform)
  ) {
    return NextResponse.json({ error: 'itemId, date, platform required' }, { status: 400 });
  }

  const raw = await getRedis().hget<string>(`items:${date}`, itemId);
  if (!raw) return NextResponse.json({ error: 'Item not found' }, { status: 404 });

  const item: TrackedItem = JSON.parse(raw) as TrackedItem;
  const guide = (await getRedis().get<string>(`styleguide:${platform}`)) ?? '';

  const systemPrompt = guide
    ? `You are a content writer for ${PLATFORM_LABELS[platform as Platform]}.\nFollow this style guide exactly:\n\n${guide}`
    : `You are a content writer for ${PLATFORM_LABELS[platform as Platform]}.`;

  const userPrompt =
    `Write a ${PLATFORM_LABELS[platform as Platform]} about the following topic.\n\n` +
    `Title: ${item.title}\n` +
    `Summary: ${item.summary}\n` +
    `Source URL: ${item.url}\n\n` +
    `Return only the post content, ready to copy and paste.`;

  let draft: string;
  try {
    const result = await generateText({
      model: openrouter('deepseek/deepseek-chat'),
      system: systemPrompt,
      prompt: userPrompt,
    });
    draft = result.text;
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json(
      { error: `Generation failed — try again. Detail: ${message}` },
      { status: 500 }
    );
  }

  // Persist draft back to item in Redis
  const updated: TrackedItem = { ...item, draft, platform: platform as Platform };
  await getRedis().hset(`items:${date}`, { [itemId]: JSON.stringify(updated) });

  return NextResponse.json({ ok: true, draft });
}
