import { NextRequest, NextResponse } from 'next/server';

export async function parseBody(
  request: NextRequest,
): Promise<[Record<string, unknown>, null] | [null, NextResponse]> {
  try {
    const body = await request.json() as Record<string, unknown>;
    return [body, null];
  } catch {
    return [null, NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })];
  }
}
