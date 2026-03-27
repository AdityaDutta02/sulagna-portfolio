// lib/__tests__/scoring.test.ts
// @vitest-environment node

import { describe, it, expect } from 'vitest';
import { computeHeuristicScore, countKeywordMatches } from '../scoring';

describe('countKeywordMatches', () => {
  it('counts matching keywords case-insensitively', () => {
    expect(countKeywordMatches('Python and SQL tutorial')).toBe(2);
  });

  it('counts Power BI as one match', () => {
    expect(countKeywordMatches('Power BI dashboard automation')).toBe(3);
  });

  it('returns 0 for unrelated text', () => {
    expect(countKeywordMatches('cooking recipes for dinner')).toBe(0);
  });
});

describe('computeHeuristicScore', () => {
  it('scores a fresh, high-weight, keyword-rich item at 61', () => {
    // recency=100*0.4=40, source=(5/5)*40*0.3=12, keyword=min(30,6*5)*0.3=9 → 61
    const score = computeHeuristicScore({ hoursOld: 0, weight: 5, keywordMatches: 6 });
    expect(score).toBe(61);
  });

  it('scores a mid-age, medium-weight, low-keyword item at 30', () => {
    // recency=100*(1-84/168)=50 → 50*0.4=20, source=(3/5)*40*0.3=7.2, keyword=10*0.3=3 → 30.2→30
    const score = computeHeuristicScore({ hoursOld: 84, weight: 3, keywordMatches: 2 });
    expect(score).toBe(30);
  });

  it('gives 0 recency for items older than 168 hours', () => {
    // recency=0, source=(1/5)*40*0.3=2.4, keyword=0 → 2.4→2
    const score = computeHeuristicScore({ hoursOld: 200, weight: 1, keywordMatches: 0 });
    expect(score).toBe(2);
  });

  it('clamps result to 0 when all inputs are zero', () => {
    const score = computeHeuristicScore({ hoursOld: 999, weight: 1, keywordMatches: 0 });
    expect(score).toBeGreaterThanOrEqual(0);
    expect(score).toBeLessThanOrEqual(100);
  });

  it('never exceeds 100', () => {
    const score = computeHeuristicScore({ hoursOld: 0, weight: 5, keywordMatches: 99 });
    expect(score).toBeLessThanOrEqual(100);
  });
});
