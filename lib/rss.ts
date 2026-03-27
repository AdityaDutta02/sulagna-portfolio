import { XMLParser } from 'fast-xml-parser';
import type { Feed } from './types';

export interface ParsedItem {
  title: string;
  url: string;
  summary: string;
  publishedAt: string;
  sourceLabel: string;
}

type RawNode = Record<string, unknown>;

// Tags that must always be parsed as arrays even when there is only one element.
const ALWAYS_ARRAY_TAGS = ['item', 'entry', 'link'] as const;

const xmlParser = new XMLParser({
  // Preserve attribute values like href, rel, version.
  ignoreAttributes: false,
  // Prefix all XML attributes with @_ to avoid collisions with element names.
  attributeNamePrefix: '@_',
  // Force these tags to always deserialise as arrays, even with a single child.
  isArray: (name) => (ALWAYS_ARRAY_TAGS as readonly string[]).includes(name),
});

// --- Shared helpers ---------------------------------------------------------

/** Extract a plain string from a value that may be a string, an XML object
 *  with a `#text` property, or a single-element array of either (fast-xml-parser
 *  forces certain tags to always be arrays via the `isArray` option). */
function textOf(value: unknown): string {
  const scalar = Array.isArray(value) ? value[0] : value;
  if (typeof scalar === 'object' && scalar !== null) {
    return String((scalar as RawNode)['#text'] ?? '').trim();
  }
  return String(scalar ?? '').trim();
}

/** Run each raw node through `parser`, dropping any that return null. */
function mapItems(nodes: RawNode[], parser: (n: RawNode, label: string) => ParsedItem | null, sourceLabel: string): ParsedItem[] {
  return nodes.map((n) => parser(n, sourceLabel)).filter((x): x is ParsedItem => x !== null);
}

// --- Public API -------------------------------------------------------------

/**
 * Parse an RSS 2.0 or Atom XML string and return a normalised list of items.
 * Returns an empty array for unrecognised formats or malformed XML.
 */
export function parseXml(xml: string, sourceLabel = ''): ParsedItem[] {
  let parsed: RawNode;
  try {
    parsed = xmlParser.parse(xml) as RawNode;
  } catch {
    return [];
  }

  // RSS 2.0 — items live under rss.channel.item[]
  const rss = parsed['rss'] as RawNode | undefined;
  if (rss) {
    const channel = rss['channel'] as RawNode | undefined;
    if (!channel) return [];
    const items = (channel['item'] as RawNode[] | undefined) ?? [];
    return mapItems(items, parseRssItem, sourceLabel);
  }

  // Atom — entries live under feed.entry[]
  const feed = parsed['feed'] as RawNode | undefined;
  if (feed) {
    const entries = (feed['entry'] as RawNode[] | undefined) ?? [];
    return mapItems(entries, parseAtomEntry, sourceLabel);
  }

  return [];
}

/** Fetch a remote feed URL, parse it, and return the items. Never throws. */
export async function fetchFeedItems(feed: Feed): Promise<ParsedItem[]> {
  try {
    const response = await fetch(feed.url, {
      headers: { 'User-Agent': 'sulagna.dev-cms/1.0' },
      signal: AbortSignal.timeout(10_000),
    });
    if (!response.ok) return [];
    const xml = await response.text();
    return parseXml(xml, feed.name);
  } catch {
    return [];
  }
}

// --- Format-specific parsers ------------------------------------------------

function parseRssItem(item: RawNode, sourceLabel: string): ParsedItem | null {
  const title = textOf(item['title']);
  const link = textOf(item['link']);
  const description = textOf(item['description']);
  const pubDate = item['pubDate'] as string | undefined;
  if (!title || !link) return null;
  const date = pubDate ? new Date(pubDate) : new Date();
  return {
    title,
    url: link,
    summary: description.slice(0, 500),
    publishedAt: date.toISOString(),
    sourceLabel,
  };
}

function parseAtomEntry(entry: RawNode, sourceLabel: string): ParsedItem | null {
  const title = textOf(entry['title']);

  // Link is always an array (isArray config); find rel=alternate or fall back to first.
  const linkArr = entry['link'] as RawNode[] | undefined;
  let url = '';
  if (linkArr && linkArr.length > 0) {
    // An entry with no rel attribute is implicitly the alternate representation.
    const isAlternate = (l: RawNode): boolean => !l['@_rel'] || l['@_rel'] === 'alternate';
    const preferred = linkArr.find(isAlternate);
    url = String((preferred ?? linkArr[0])!['@_href'] ?? '').trim();
  }

  const summary = textOf(entry['summary'] ?? entry['content']).slice(0, 500);
  const published = String(entry['published'] ?? entry['updated'] ?? '').trim();
  if (!title || !url) return null;
  const date = published ? new Date(published) : new Date();
  return {
    title,
    url,
    summary,
    publishedAt: date.toISOString(),
    sourceLabel,
  };
}
