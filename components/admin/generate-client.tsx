'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import type { Platform, TrackedItem } from '@/lib/types';

const PLATFORMS: Platform[] = ['blog', 'linkedin', 'twitter'];

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '11px',
  fontFamily: 'var(--font-mono)',
  color: 'var(--text-muted)',
  marginBottom: '0.375rem',
  letterSpacing: '0.05em',
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '0.375rem 0.5rem',
  border: '1px solid var(--border)',
  borderRadius: '4px',
  background: 'var(--bg)',
  color: 'var(--text)',
  fontFamily: 'var(--font-mono)',
  fontSize: '13px',
  boxSizing: 'border-box',
};

export function GenerateClient(): React.JSX.Element {
  const searchParams = useSearchParams();
  const today = new Date().toISOString().slice(0, 10);

  const [date, setDate] = useState(searchParams.get('date') ?? today);
  const [items, setItems] = useState<TrackedItem[]>([]);
  const [itemId, setItemId] = useState(searchParams.get('itemId') ?? '');
  const [platform, setPlatform] = useState<Platform>('linkedin');
  const [draft, setDraft] = useState('');
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

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

  useEffect(() => {
    setItemId('');
    setDraft('');
  }, [date]);

  useEffect(() => {
    setError(null);
  }, [itemId]);

  // Pre-fill draft if item already has one
  useEffect(() => {
    if (!itemId) return;
    const item = items.find((i) => i.id === itemId);
    if (item?.draft) setDraft(item.draft);
  }, [itemId, items]);

  async function handleGenerate(): Promise<void> {
    if (!itemId) return;
    setGenerating(true);
    setError(null);
    setDraft('');
    try {
      const res = await fetch('/api/admin/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId, date, platform }),
      });
      const data = await res.json() as { draft?: string; error?: string };
      if (res.ok && data.draft) {
        setDraft(data.draft);
      } else {
        setError(data.error ?? 'Generation failed — try again');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Generation failed — try again');
    } finally {
      setGenerating(false);
    }
  }

  async function handleCopy(): Promise<void> {
    try {
      await navigator.clipboard.writeText(draft);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError('Failed to copy to clipboard');
    }
  }

  const selectedItem = items.find((i) => i.id === itemId);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '1.5rem', alignItems: 'start' }}>
      {/* Controls sidebar */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>
          <label style={labelStyle}>Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            style={inputStyle}
          />
        </div>
        <div>
          <label style={labelStyle}>Item</label>
          <select
            value={itemId}
            onChange={(e) => setItemId(e.target.value)}
            disabled={loading}
            style={inputStyle}
          >
            <option value="">{loading ? 'Loading…' : 'Select item…'}</option>
            {items.map((item) => (
              <option key={item.id} value={item.id}>
                [{item.heuristicScore}] {item.title.slice(0, 60)}
              </option>
            ))}
          </select>
        </div>
        {selectedItem && (
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', lineHeight: 1.5 }}>
            Source: {selectedItem.source}<br />
            Score: {selectedItem.heuristicScore}{selectedItem.aiScore ? ` / AI: ${selectedItem.aiScore}` : ''}
          </div>
        )}
        <div>
          <label style={labelStyle}>Platform</label>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {PLATFORMS.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPlatform(p)}
                style={{
                  padding: '0.375rem 0.75rem',
                  border: '1px solid var(--border)',
                  borderRadius: '4px',
                  fontSize: '12px',
                  fontFamily: 'var(--font-mono)',
                  cursor: 'pointer',
                  background: platform === p ? 'var(--amber-light)' : 'var(--bg)',
                  color: platform === p ? 'var(--amber)' : 'var(--text-muted)',
                  fontWeight: platform === p ? 600 : 400,
                }}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
        <button
          type="button"
          onClick={() => { void handleGenerate(); }}
          disabled={!itemId || generating}
          style={{
            padding: '0.5rem',
            background: 'var(--amber)',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            fontFamily: 'var(--font-mono)',
            fontSize: '13px',
            cursor: !itemId || generating ? 'not-allowed' : 'pointer',
            opacity: !itemId || generating ? 0.6 : 1,
          }}
        >
          {generating ? 'Generating…' : 'Generate'}
        </button>
        <a
          href="/admin/style-guides"
          style={{ fontSize: '11px', color: 'var(--text-muted)', textDecoration: 'none', fontFamily: 'var(--font-mono)' }}
        >
          Edit style guide →
        </a>
      </div>

      {/* Draft output */}
      <div>
        {error && (
          <p style={{ color: 'var(--coral)', fontSize: '12px', marginBottom: '0.75rem', fontFamily: 'var(--font-mono)' }}>
            {error}
          </p>
        )}
        <textarea
          value={draft}
          readOnly
          placeholder={generating ? 'Generating…' : 'Draft will appear here'}
          style={{
            width: '100%',
            minHeight: '400px',
            padding: '1rem',
            border: '1px solid var(--border)',
            borderRadius: '6px',
            background: 'var(--bg-subtle)',
            color: 'var(--text)',
            fontFamily: 'var(--font-mono)',
            fontSize: '13px',
            lineHeight: 1.7,
            resize: 'vertical',
            boxSizing: 'border-box',
          }}
        />
        {draft && (
          <button
            type="button"
            onClick={() => { void handleCopy(); }}
            style={{
              marginTop: '0.75rem',
              padding: '0.5rem 1.25rem',
              background: copied ? 'var(--green)' : 'var(--amber)',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              fontFamily: 'var(--font-mono)',
              fontSize: '13px',
              cursor: 'pointer',
              transition: 'background 0.2s',
            }}
          >
            {copied ? 'Copied ✓' : 'Copy to clipboard'}
          </button>
        )}
      </div>
    </div>
  );
}
