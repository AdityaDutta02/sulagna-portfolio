'use client';

import React, { useState, useEffect } from 'react';
import type { Platform } from '@/lib/types';

const PLATFORMS: Platform[] = ['blog', 'linkedin', 'twitter'];

const EMPTY_HINT = `## Tone\n\n## Audience\n\n## Format & Length\n\n## Always include\n\n## Avoid\n\n## Example post\n`;

export function StyleGuidesClient(): React.JSX.Element {
  const [activePlatform, setActivePlatform] = useState<Platform>('blog');
  const [guides, setGuides] = useState<Record<Platform, string>>({
    blog: '', linkedin: '', twitter: '',
  });
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { void loadAll(); }, []);

  async function loadAll(): Promise<void> {
    setLoading(true);
    setError(null);
    try {
      const results = await Promise.all(
        PLATFORMS.map(async (p) => {
          const res = await fetch(`/api/admin/styleguides?platform=${p}`);
          if (!res.ok) throw new Error(`Failed to load ${p} style guide (${res.status})`);
          const data = await res.json() as { guide: string };
          return [p, data.guide] as [Platform, string];
        })
      );
      setGuides(Object.fromEntries(results) as Record<Platform, string>);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load style guides');
    } finally {
      setLoading(false);
    }
  }

  async function handleSave(): Promise<void> {
    setSaving(true);
    setSavedMsg('');
    setError(null);
    try {
      const res = await fetch('/api/admin/styleguides', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ platform: activePlatform, guide: guides[activePlatform] }),
      });
      if (!res.ok) throw new Error(`Save failed (${res.status})`);
      setSavedMsg('Saved ✓');
      setTimeout(() => setSavedMsg(''), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Loading…</p>;

  return (
    <div>
      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
        {PLATFORMS.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => { setActivePlatform(p); setSavedMsg(''); }}
            style={{
              padding: '0.375rem 1rem',
              border: 'none',
              borderRadius: '4px',
              fontSize: '12px',
              fontFamily: 'var(--font-mono)',
              cursor: 'pointer',
              background: activePlatform === p ? 'var(--amber-light)' : 'transparent',
              color: activePlatform === p ? 'var(--amber)' : 'var(--text-muted)',
              fontWeight: activePlatform === p ? 600 : 400,
            }}
          >
            {p}
          </button>
        ))}
      </div>

      {error && (
        <p style={{ color: 'var(--coral)', fontSize: '12px', fontFamily: 'var(--font-mono)', marginBottom: '0.75rem' }}>
          {error}
        </p>
      )}

      {/* Editor */}
      <textarea
        value={guides[activePlatform]}
        placeholder={EMPTY_HINT}
        onChange={(e) =>
          setGuides((prev) => ({ ...prev, [activePlatform]: e.target.value }))
        }
        style={{
          width: '100%',
          height: 'calc(100vh - 260px)',
          padding: '1rem',
          border: '1px solid var(--border)',
          borderRadius: '6px',
          background: 'var(--bg-subtle)',
          color: 'var(--text)',
          fontFamily: 'var(--font-mono)',
          fontSize: '13px',
          lineHeight: 1.7,
          resize: 'none',
          boxSizing: 'border-box',
        }}
      />

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.75rem' }}>
        <button
          type="button"
          onClick={() => { void handleSave(); }}
          disabled={saving}
          style={{
            padding: '0.5rem 1.25rem',
            background: 'var(--amber)',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            fontFamily: 'var(--font-mono)',
            fontSize: '13px',
            cursor: saving ? 'not-allowed' : 'pointer',
            opacity: saving ? 0.7 : 1,
          }}
        >
          {saving ? 'Saving\u2026' : 'Save'}
        </button>
        {savedMsg && (
          <span style={{ fontSize: '12px', color: 'var(--green)', fontFamily: 'var(--font-mono)' }}>
            {savedMsg}
          </span>
        )}
      </div>
    </div>
  );
}
