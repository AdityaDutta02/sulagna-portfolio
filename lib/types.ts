export type Platform = 'blog' | 'linkedin' | 'twitter';

export interface Feed {
  id: string;
  name: string;
  url: string;
  category: string;
  weight: 1 | 2 | 3 | 4 | 5;
  enabled: boolean;
}

export interface TrackedItem {
  id: string;
  title: string;
  url: string;
  source: string;
  summary: string;
  publishedAt: string; // ISO 8601
  heuristicScore: number; // 0–100
  aiScore?: number; // 1–10 composite
  platform?: Platform;
  draft?: string;
  tags: string[];
  discoverySource: 'rss' | 'ai-discovery';
}

export interface AiScoreResult {
  relevance: number;   // 1–10
  novelty: number;     // 1–10
  engagement: number;  // 1–10
  composite: number;   // 1–10
}

// Stored as JSON value in queue:{platform} hash, keyed by itemId
export interface QueueValue {
  itemDate: string;   // YYYY-MM-DD — the items:{date} hash this item lives in
  scheduled: string;  // YYYY-WW for blog, YYYY-MM-DD for linkedin/twitter
}
