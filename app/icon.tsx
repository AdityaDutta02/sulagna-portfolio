import { ImageResponse } from '@vercel/og';

export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#f6f5f1',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'flex-end',
          padding: '3px 4px',
          gap: '3px',
          borderRadius: '5px',
        }}
      >
        {/* Three ascending bars using amber design tokens */}
        <div style={{ background: '#c8973e', width: '6px', height: '8px',  borderRadius: '1.5px', flexShrink: 0 }} />
        <div style={{ background: '#a27a2e', width: '6px', height: '14px', borderRadius: '1.5px', flexShrink: 0 }} />
        <div style={{ background: '#7d5e1f', width: '6px', height: '21px', borderRadius: '1.5px', flexShrink: 0 }} />
      </div>
    ),
    { ...size },
  );
}
