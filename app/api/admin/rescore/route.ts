import { NextRequest, NextResponse } from 'next/server';
import { generateText } from 'ai';
import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import { requireAdminAuth } from '@/lib/require-admin-auth';
import { redis } from '@/lib/redis';
import type { TrackedItem, AiScoreResult } from '@/lib/types';

const openrouter = createOpenRouter({ apiKey: process.env.OPENROUTER_API_KEY ?? '' });

export async function POST(request: NextRequest): Promise<NextResponse> {
  const authError = await requireAdminAuth();
  if (authError) return authError;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { itemId, date } =
    typeof body === 'object' && body !== null
      ? (body as Record<string, unknown>)
      : {};

  if (typeof itemId !== 'string' || typeof date !== 'string') {
    return NextResponse.json({ error: 'itemId and date required' }, { status: 400 });
  }

  const raw = await redis.hget<string>(`items:${date}`, itemId);
  if (!raw) return NextResponse.json({ error: 'Item not found' }, { status: 404 });

  const item: TrackedItem = JSON.parse(raw) as TrackedItem;

  const { text } = await generateText({
    model: openrouter('qwen/qwen2.5-7b-instruct'),
    prompt:
      `Rate this article for a data analyst audience on three dimensions (1–10 each).\n\n` +
      `Title: ${item.title}\nSummary: ${item.summary}\n\n` +
      `Return ONLY JSON with no extra text: ` +
      `{"relevance": <1-10>, "novelty": <1-10>, "engagement": <1-10>}`,
  });

  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    return NextResponse.json({ error: 'Model returned invalid JSON' }, { status: 502 });
  }

  const scores = JSON.parse(jsonMatch[0]) as {
    relevance: number;
    novelty: number;
    engagement: number;
  };

  const result: AiScoreResult = {
    relevance: scores.relevance,
    novelty: scores.novelty,
    engagement: scores.engagement,
    composite: Math.round((scores.relevance + scores.novelty + scores.engagement) / 3),
  };

  const updated: TrackedItem = { ...item, aiScore: result.composite };
  await redis.hset(`items:${date}`, { [itemId]: JSON.stringify(updated) });

  return NextResponse.json({ ok: true, scores: result });
}
