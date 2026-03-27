'use client';

import React, { useState, useEffect } from 'react';
import type { Platform, QueueValue, TrackedItem } from '@/lib/types';

interface QueueEntry {
  itemId: string;
  value: QueueValue;
  item?: TrackedItem;
}

const PLATFORMS: Platform[] = ['blog', 'linkedin', 'twitter'];
const PLATFORM_LABELS: Record<Platform, string> = {
  blog: 'Blog (1/week)',
  linkedin: 'LinkedIn (3/week)',
  twitter: 'Twitter (7/day)',
};

export function QueueClient(): React.JSX.Element {
  const [entries, setEntries] = useState<Record<Platform, QueueEntry[]>>({
    blog: [], linkedin: [], twitter: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { void loadAll(); }, []);

  async function loadAll(): Promise<void> {
    setLoading(true);
    setError(null);
    try {
      const results = await Promise.all(
        PLATFORMS.map(async (p) => {
          const res = await fetch(`/api/admin/queue?platform=${p}`);
          if (!res.ok) throw new Error(`Failed to load ${p} queue (${res.status})`);
          const data = await res.json() as { entries: Record<string, QueueValue> };
          const entryPairs = Object.entries(data.entries ?? {});

          // Collect unique itemDates, fetch each once
          const uniqueDates = [...new Set(entryPairs.map(([, v]) => v.itemDate))];
          const itemsByDate: Record<string, TrackedItem[]> = {};
          await Promise.all(
            uniqueDates.map(async (d) => {
              const itemRes = await fetch(`/api/admin/items?date=${d}`);
              if (!itemRes.ok) throw new Error(`Failed to load items for date ${d} (${itemRes.status})`);
              const itemData = await itemRes.json() as { items: TrackedItem[] };
              itemsByDate[d] = itemData.items ?? [];
            })
          );

          const items: QueueEntry[] = entryPairs.map(([itemId, value]) => {
            const item = itemsByDate[value.itemDate]?.find((i) => i.id === itemId);
            return { itemId, value, item };
          });
          items.sort((a, b) => (b.item?.heuristicScore ?? 0) - (a.item?.heuristicScore ?? 0));
          return [p, items] as [Platform, QueueEntry[]];
        })
      );
      setEntries(Object.fromEntries(results) as Record<Platform, QueueEntry[]>);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load queue');
    } finally {
      setLoading(false);
    }
  }

  async function handleRemove(platform: Platform, itemId: string): Promise<void> {
    try {
      const res = await fetch('/api/admin/queue', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ platform, itemId }),
      });
      if (!res.ok) throw new Error(`Remove failed (${res.status})`);
      await loadAll();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove item');
    }
  }

  if (loading) return <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Loading…</p>;

  return (
    <div>
      {error && (
        <p style={{ color: 'var(--coral)', fontSize: '12px', fontFamily: 'var(--font-mono)', marginBottom: '0.75rem' }}>
          {error}
        </p>
      )}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
        {PLATFORMS.map((platform) => (
          <div key={platform}>
            <h3
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                color: 'var(--text-muted)',
                letterSpacing: '0.08em',
                marginBottom: '0.75rem',
              }}
            >
              {PLATFORM_LABELS[platform].toUpperCase()}
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {entries[platform].length === 0 ? (
                <div
                  style={{
                    border: '1px dashed var(--border)',
                    borderRadius: '6px',
                    padding: '1rem',
                    fontSize: '12px',
                    color: 'var(--text-muted)',
                    textAlign: 'center',
                  }}
                >
                  Empty — assign from Inbox
                </div>
              ) : (
                entries[platform].map(({ itemId, value, item }) => (
                  <div
                    key={itemId}
                    style={{
                      border: '1px solid var(--border)',
                      borderRadius: '6px',
                      padding: '0.75rem',
                      background: 'var(--bg-card)',
                    }}
                  >
                    <p
                      style={{
                        fontSize: '12px',
                        color: 'var(--text)',
                        marginBottom: '0.375rem',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {item?.title ?? itemId}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                        {value.scheduled} · {item?.heuristicScore ?? '?'}
                      </span>
                      <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.375rem' }}>
                        <a
                          href={`/admin/generate?itemId=${itemId}&date=${value.itemDate}`}
                          style={{
                            fontSize: '11px',
                            fontFamily: 'var(--font-mono)',
                            color: 'var(--amber)',
                            textDecoration: 'none',
                          }}
                        >
                          Generate
                        </a>
                        <button
                          onClick={() => { void handleRemove(platform, itemId); }}
                          style={{
                            fontSize: '11px',
                            fontFamily: 'var(--font-mono)',
                            color: 'var(--coral)',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            padding: 0,
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
