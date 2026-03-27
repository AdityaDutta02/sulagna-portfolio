'use client';

import React, { useState, useEffect } from 'react';
import type { Feed } from '@/lib/types';

const DOTS = ['●', '●', '●', '○', '○'];

export function SourcesClient(): React.JSX.Element {
  const [feeds, setFeeds] = useState<Feed[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [newFeed, setNewFeed] = useState({ name: '', url: '', category: '', weight: 3 });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { void loadFeeds(); }, []);

  async function loadFeeds(): Promise<void> {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/feeds');
      if (!res.ok) throw new Error(`Failed to load feeds (${res.status})`);
      const data = await res.json() as { feeds: Feed[] };
      setFeeds(data.feeds ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load feeds');
    } finally {
      setLoading(false);
    }
  }

  async function putFeed(patch: Partial<Feed> & { id: string }, errMsg: string): Promise<boolean> {
    try {
      const res = await fetch('/api/admin/feeds', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patch),
      });
      if (!res.ok) throw new Error(`${errMsg} (${res.status})`);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : errMsg);
      return false;
    }
  }

  async function handleToggle(feed: Feed): Promise<void> {
    const ok = await putFeed({ id: feed.id, enabled: !feed.enabled }, 'Toggle failed');
    if (ok) setFeeds((prev) => prev.map((f) => f.id === feed.id ? { ...f, enabled: !f.enabled } : f));
  }

  async function handleWeightChange(feed: Feed, weight: number): Promise<void> {
    const ok = await putFeed({ id: feed.id, weight: weight as Feed['weight'] }, 'Weight update failed');
    if (ok) setFeeds((prev) => prev.map((f) => f.id === feed.id ? { ...f, weight: weight as Feed['weight'] } : f));
  }

  async function handleDelete(id: string): Promise<void> {
    if (!confirm('Delete this feed?')) return;
    try {
      const res = await fetch(`/api/admin/feeds?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
      if (!res.ok) throw new Error(`Delete failed (${res.status})`);
      setFeeds((prev) => prev.filter((f) => f.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete feed');
    }
  }

  async function handleAdd(): Promise<void> {
    if (!newFeed.name || !newFeed.url) return;
    try {
      const res = await fetch('/api/admin/feeds', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newFeed),
      });
      if (!res.ok) throw new Error(`Add failed (${res.status})`);
      setNewFeed({ name: '', url: '', category: '', weight: 3 });
      setAdding(false);
      await loadFeeds();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add feed');
    }
  }

  function handleReset(): void {
    if (!confirm('Reset to the 20 default feeds? This will overwrite all current feeds.')) return;
    alert('To reset: delete all feeds manually, then run a scan — defaults are auto-seeded on first ingest.');
  }

  return (
    <div>
      {loading && <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Loading…</p>}
      {!loading && error && (
        <p style={{ color: 'var(--coral)', fontSize: '12px', fontFamily: 'var(--font-mono)', marginBottom: '0.75rem' }}>
          {error}
        </p>
      )}

      {/* Toolbar */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}>
        <button type="button" onClick={() => setAdding(true)} style={btnStyle('var(--amber)')}>
          + Add feed
        </button>
        <button type="button" onClick={handleReset} style={btnStyle('var(--text-muted)')}>
          Reset to defaults
        </button>
      </div>

      {/* Add form */}
      {adding && (
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap', alignItems: 'center', padding: '0.75rem', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '6px' }}>
          {(['name', 'url', 'category'] as const).map((field) => (
            <input
              key={field}
              placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
              value={newFeed[field]}
              onChange={(e) => setNewFeed((p) => ({ ...p, [field]: e.target.value }))}
              style={{ ...inputStyle, width: field === 'url' ? '280px' : '160px' }}
            />
          ))}
          <select
            value={newFeed.weight}
            onChange={(e) => setNewFeed((p) => ({ ...p, weight: Number(e.target.value) }))}
            style={{ ...inputStyle, width: '80px' }}
          >
            {[1, 2, 3, 4, 5].map((w) => <option key={w} value={w}>Weight {w}</option>)}
          </select>
          <button type="button" onClick={() => { void handleAdd(); }} style={btnStyle('var(--green)')}>Add</button>
          <button type="button" onClick={() => setAdding(false)} style={btnStyle('var(--text-muted)')}>Cancel</button>
        </div>
      )}

      {/* Table */}
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid var(--border)' }}>
            {['Name', 'URL', 'Category', 'Weight', 'Enabled', ''].map((h) => (
              <th key={h} style={{ padding: '0.5rem 0.75rem', textAlign: 'left', fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-muted)', fontWeight: 500 }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {feeds.map((feed) => (
            <tr key={feed.id} style={{ borderBottom: '1px solid var(--border)' }}>
              <td style={cellStyle}>{feed.name}</td>
              <td style={{ ...cellStyle, fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-muted)', maxWidth: '240px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {feed.url}
              </td>
              <td style={cellStyle}>{feed.category}</td>
              <td style={cellStyle}>
                <select
                  value={feed.weight}
                  onChange={(e) => { void handleWeightChange(feed, Number(e.target.value)); }}
                  style={{ ...inputStyle, width: '60px', padding: '2px 4px' }}
                >
                  {[1, 2, 3, 4, 5].map((w) => (
                    <option key={w} value={w}>
                      {DOTS.slice(0, w).join('') + DOTS.slice(w).join('')}
                    </option>
                  ))}
                </select>
              </td>
              <td style={cellStyle}>
                <button
                  type="button"
                  onClick={() => { void handleToggle(feed); }}
                  style={{
                    width: '36px',
                    height: '20px',
                    borderRadius: '10px',
                    border: 'none',
                    cursor: 'pointer',
                    background: feed.enabled ? 'var(--green)' : 'var(--border)',
                    position: 'relative',
                    transition: 'background 0.2s',
                  }}
                  aria-label={feed.enabled ? 'Disable' : 'Enable'}
                >
                  <span style={{
                    position: 'absolute',
                    top: '2px',
                    left: feed.enabled ? '18px' : '2px',
                    width: '16px',
                    height: '16px',
                    borderRadius: '50%',
                    background: '#fff',
                    transition: 'left 0.2s',
                  }} />
                </button>
              </td>
              <td style={cellStyle}>
                <button
                  type="button"
                  onClick={() => { void handleDelete(feed.id); }}
                  style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--coral)', background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function btnStyle(color: string): React.CSSProperties {
  return {
    padding: '0.375rem 0.875rem',
    background: color,
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    fontSize: '12px',
    fontFamily: 'var(--font-mono)',
    cursor: 'pointer',
  };
}

const inputStyle: React.CSSProperties = {
  padding: '0.375rem 0.5rem',
  border: '1px solid var(--border)',
  borderRadius: '4px',
  background: 'var(--bg)',
  color: 'var(--text)',
  fontFamily: 'var(--font-mono)',
  fontSize: '12px',
  boxSizing: 'border-box',
};

const cellStyle: React.CSSProperties = {
  padding: '0.625rem 0.75rem',
};
