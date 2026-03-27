// lib/__tests__/rss.test.ts
// @vitest-environment node

import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';
import { parseXml } from '../rss';

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
    expect(first.publishedAt).toBeInstanceOf(Date);
    expect(isNaN(first.publishedAt.getTime())).toBe(false);
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
});

describe('parseXml — edge cases', () => {
  it('returns empty array for empty XML', () => {
    expect(parseXml('<rss version="2.0"><channel></channel></rss>')).toEqual([]);
  });

  it('returns empty array for unrecognised format', () => {
    expect(parseXml('<html><body>hello</body></html>')).toEqual([]);
  });
});
