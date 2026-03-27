'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ScoreBar } from './score-bar';
import type { TrackedItem, Platform } from '@/lib/types';

const PLATFORM_COLORS: Record<string, string> = {
  blog: 'var(--blue)',
  linkedin: 'var(--plum)',
  twitter: 'var(--green)',
};

const CONTROL_BASE_STYLE: React.CSSProperties = {
  border: '1px solid var(--border)',
  borderRadius: '4px',
  background: 'var(--bg)',
  color: 'var(--text-muted)',
  fontSize: '11px',
  fontFamily: 'var(--font-mono)',
  cursor: 'pointer',
};

// --- Inbox component ---

export function InboxClient(): React.JSX.Element {
  const today = new Date().toISOString().slice(0, 10);
  const [date, setDate] = useState(today);
  const [items, setItems] = useState<TrackedItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);
  const [scanMsg, setScanMsg] = useState('');

  const router = useRouter();

  const loadItems = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/items?date=${date}`);
      if (!res.ok) throw new Error(`Failed to load items (${res.status})`);
      const data = await res.json() as { items: TrackedItem[] };
      setItems(data.items ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load items');
    } finally {
      setLoading(false);
    }
  }, [date]);

  useEffect(() => { void loadItems(); }, [loadItems]);

  async function postAndReload(url: string, body: Record<string, unknown>): Promise<void> {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`Request failed (${res.status})`);
    await loadItems();
  }

  async function handleRunScan(): Promise<void> {
    setScanning(true);
    setScanMsg('');
    try {
      const res = await fetch('/api/admin/ingest', { method: 'POST' });
      const data = await res.json() as { newItems?: number; error?: string };
      setScanMsg(data.error ? `Error: ${data.error}` : `Done — ${data.newItems ?? 0} new items`);
      await loadItems();
    } finally {
      setScanning(false);
    }
  }

  async function handleRescore(item: TrackedItem): Promise<void> {
    try {
      await postAndReload('/api/admin/rescore', { itemId: item.id, date });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Rescore failed');
    }
  }

  async function handleAssignPlatform(item: TrackedItem, platform: Platform): Promise<void> {
    try {
      const scheduled = platform === 'blog' ? getISOWeek(new Date()) : today;
      await postAndReload('/api/admin/queue', { platform, itemId: item.id, itemDate: date, scheduled });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Queue assignment failed');
    }
  }

  return (
    <div>
      {/* Toolbar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          style={{
            padding: '0.375rem 0.5rem',
            border: '1px solid var(--border)',
            borderRadius: '4px',
            background: 'var(--bg)',
            color: 'var(--text)',
            fontFamily: 'var(--font-mono)',
            fontSize: '13px',
          }}
        />
        <button
          onClick={() => { void handleRunScan(); }}
          disabled={scanning}
          style={{
            padding: '0.375rem 0.875rem',
            background: 'var(--amber)',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            fontSize: '12px',
            fontFamily: 'var(--font-mono)',
            cursor: scanning ? 'not-allowed' : 'pointer',
            opacity: scanning ? 0.7 : 1,
          }}
        >
          {scanning ? 'Scanning…' : 'Run scan now'}
        </button>
        {scanMsg && (
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            {scanMsg}
          </span>
        )}
        <span style={{ marginLeft: 'auto', fontSize: '12px', color: 'var(--text-muted)' }}>
          {items.length} items
        </span>
      </div>

      {error && (
        <p style={{ color: 'var(--coral)', fontSize: '12px', fontFamily: 'var(--font-mono)', marginBottom: '0.75rem' }}>
          {error}
        </p>
      )}

      {/* Table */}
      {loading ? (
        <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Loading…</p>
      ) : items.length === 0 ? (
        <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>No items for this date. Run a scan.</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                {['Title', 'Source', 'Age', 'Score', 'AI', 'Platform', 'Actions'].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: '0.5rem 0.75rem',
                      textAlign: 'left',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '11px',
                      color: 'var(--text-muted)',
                      fontWeight: 500,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map((item) => {
                const hoursOld = Math.round(
                  (Date.now() - new Date(item.publishedAt).getTime()) / 3_600_000
                );
                return (
                  <tr
                    key={item.id}
                    style={{ borderBottom: '1px solid var(--border)', verticalAlign: 'middle' }}
                  >
                    <td style={{ padding: '0.625rem 0.75rem', maxWidth: '320px' }}>
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          color: 'var(--text)',
                          textDecoration: 'none',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {item.title}
                      </a>
                    </td>
                    <td style={{ padding: '0.625rem 0.75rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                      {item.source}
                    </td>
                    <td style={{ padding: '0.625rem 0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '11px', whiteSpace: 'nowrap' }}>
                      {hoursOld}h
                    </td>
                    <td style={{ padding: '0.625rem 0.75rem' }}>
                      <ScoreBar score={item.heuristicScore} />
                    </td>
                    <td style={{ padding: '0.625rem 0.75rem', fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-muted)' }}>
                      {item.aiScore ?? '—'}
                    </td>
                    <td style={{ padding: '0.625rem 0.75rem' }}>
                      {item.platform && (
                        <span
                          style={{
                            padding: '2px 8px',
                            borderRadius: '12px',
                            fontSize: '11px',
                            fontFamily: 'var(--font-mono)',
                            background: `${PLATFORM_COLORS[item.platform]}22`,
                            color: PLATFORM_COLORS[item.platform],
                          }}
                        >
                          {item.platform}
                        </span>
                      )}
                    </td>
                    <td style={{ padding: '0.625rem 0.75rem', whiteSpace: 'nowrap' }}>
                      <div style={{ display: 'flex', gap: '0.375rem' }}>
                        <ActionBtn onClick={() => { void handleRescore(item); }}>Re-score</ActionBtn>
                        <select
                          defaultValue=""
                          onChange={(e) => {
                            if (e.target.value) {
                              void handleAssignPlatform(item, e.target.value as Platform);
                              e.target.value = '';
                            }
                          }}
                          style={{ ...CONTROL_BASE_STYLE, padding: '2px 4px' }}
                        >
                          <option value="">→ Queue</option>
                          <option value="blog">Blog</option>
                          <option value="linkedin">LinkedIn</option>
                          <option value="twitter">Twitter</option>
                        </select>
                        <ActionBtn onClick={() => router.push(`/admin/generate?itemId=${item.id}&date=${date}`)}>
                          Generate
                        </ActionBtn>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function ActionBtn({ onClick, children }: { onClick: () => void; children: string }): React.JSX.Element {
  return (
    <button
      onClick={onClick}
      style={{ ...CONTROL_BASE_STYLE, padding: '2px 8px' }}
    >
      {children}
    </button>
  );
}

function getISOWeek(date: Date): string {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  return `${d.getUTCFullYear()}-W${String(weekNo).padStart(2, '0')}`;
}
