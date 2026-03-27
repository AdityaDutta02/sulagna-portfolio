const KEYWORDS = [
  'power bi',
  'python',
  'sql',
  'tableau',
  'ml',
  'ai',
  'analytics',
  'data',
  'visualisation',
  'automation',
  'dashboard',
  'pandas',
];

export function countKeywordMatches(text: string): number {
  const lower = text.toLowerCase();
  return KEYWORDS.filter((kw) => lower.includes(kw)).length;
}

interface ScoreInput {
  hoursOld: number;
  weight: number; // 1–5
  keywordMatches: number;
}

export function computeHeuristicScore(input: ScoreInput): number {
  const recencyScore = 100 * Math.max(0, 1 - input.hoursOld / 168);
  const sourceScore = (input.weight / 5) * 100;
  const keywordScore = Math.min(100, input.keywordMatches * (100 / 12));

  const raw =
    recencyScore * 0.4 + sourceScore * 0.3 + keywordScore * 0.3;
  return Math.round(Math.min(100, Math.max(0, raw)));
}
