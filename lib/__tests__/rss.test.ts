// lib/__tests__/rss.test.ts
// @vitest-environment node

import { vi, describe, it, expect, beforeEach } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';
import { parseXml, fetchFeedItems } from '../rss';

const rss2Xml = readFileSync(join(__dirname, 'fixtures/rss2.xml'), 'utf-8');
const atomXml = readFileSync(join(__dirname, 'fixtures/atom.xml'), 'utf-8');

describe('parseXml — RSS 2.0', () => {
  it('returns 2 items', () => {
    const items = parseXml(rss2Xml);
    expect(items).toHaveLength(2);
  });

  it('extracts title, url, summary, publishedAt from first item', () => {
    const items = parseXml(rss2Xml);
    const first = items[0]!;
    expect(first.title).toBe('Python 3.13 Released');
    expect(first.url).toBe('https://example.com/python-313');
    expect(first.summary).toContain('Python 3.13');
    expect(typeof first.publishedAt).toBe('string');
    expect(first.publishedAt).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });
});

describe('parseXml — Atom', () => {
  it('returns 2 entries', () => {
    const items = parseXml(atomXml);
    expect(items).toHaveLength(2);
  });

  it('extracts title, url, summary from first entry', () => {
    const items = parseXml(atomXml);
    const first = items[0]!;
    expect(first.title).toBe('SQL Performance Tips');
    expect(first.url).toBe('https://example.com/sql-tips');
    expect(first.summary).toContain('SQL');
  });

  it('handles rel="alternate" link on second entry', () => {
    const items = parseXml(atomXml);
    expect(items[1]!.url).toBe('https://example.com/ml-deploy');
  });

  it('falls back to <updated> when <published> is absent', () => {
    const xml = `<?xml version="1.0"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <entry>
    <title>Test</title>
    <link href="https://example.com/test"/>
    <summary>Summary</summary>
    <updated>2024-03-01T12:00:00Z</updated>
  </entry>
</feed>`;
    const items = parseXml(xml);
    expect(items).toHaveLength(1);
    expect(items[0]!.publishedAt).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });
});

describe('parseXml — edge cases', () => {
  it('returns empty array for empty XML', () => {
    expect(parseXml('<rss version="2.0"><channel></channel></rss>')).toEqual([]);
  });

  it('returns empty array for unrecognised format', () => {
    expect(parseXml('<html><body>hello</body></html>')).toEqual([]);
  });

  it('missing description field returns empty string for summary', () => {
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <item>
      <title>No Description Item</title>
      <link>https://example.com/no-desc</link>
    </item>
  </channel>
</rss>`;
    const items = parseXml(xml);
    expect(items).toHaveLength(1);
    expect(items[0]!.summary).toBe('');
  });

  it('invalid XML returns empty array', () => {
    expect(parseXml('not valid xml!!!')).toEqual([]);
  });

  it('future-dated items are not filtered out', () => {
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <item>
      <title>Future Post</title>
      <link>https://example.com/future</link>
      <pubDate>Fri, 01 Jan 2100 12:00:00 GMT</pubDate>
    </item>
  </channel>
</rss>`;
    const items = parseXml(xml);
    expect(items).toHaveLength(1);
    expect(items[0]!.title).toBe('Future Post');
  });
});

describe('fetchFeedItems', () => {
  it('is exported as a function', () => {
    expect(typeof fetchFeedItems).toBe('function');
  });

  const mockFeed = { id: '1', name: 'Test Feed', url: 'https://example.com/feed', category: 'Test', weight: 3 as const, enabled: true };

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('returns [] on network error', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('Network error'));
    const result = await fetchFeedItems(mockFeed);
    expect(result).toEqual([]);
  });

  it('returns [] on non-OK HTTP response', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response('Not Found', { status: 404 }));
    const result = await fetchFeedItems(mockFeed);
    expect(result).toEqual([]);
  });

  it('populates sourceLabel from feed.name', async () => {
    const xml = `<?xml version="1.0"?>
<rss version="2.0"><channel>
  <item><title>T</title><link>https://x.com</link><description>D</description><pubDate>Thu, 01 Jan 2026 00:00:00 GMT</pubDate></item>
</channel></rss>`;
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(xml, { status: 200 }));
    const result = await fetchFeedItems(mockFeed);
    expect(result).toHaveLength(1);
    expect(result[0]!.sourceLabel).toBe('Test Feed');
  });
});
