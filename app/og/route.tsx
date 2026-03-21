import { ImageResponse } from '@vercel/og';

export const runtime = 'edge';

export function GET(): ImageResponse {
  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          background: 'linear-gradient(135deg, #f6f5f1, #f5efe3)',
          fontFamily: 'monospace',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            marginBottom: '20px',
          }}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              background: '#c8973e',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontSize: '24px',
              fontWeight: 'bold',
            }}
          >
            SD
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#2c2a26' }}>
              Sulagna Dey
            </div>
            <div style={{ fontSize: '18px', color: '#8a8780' }}>
              Data Analyst &middot; Power BI Specialist
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <div
            style={{
              padding: '6px 16px',
              background: '#c8973e',
              color: '#fff',
              borderRadius: '20px',
              fontSize: '14px',
            }}
          >
            Gold Medalist
          </div>
          <div
            style={{
              padding: '6px 16px',
              background: 'rgba(90,154,110,0.15)',
              color: '#5a9a6e',
              borderRadius: '20px',
              fontSize: '14px',
              border: '1px solid rgba(90,154,110,0.3)',
            }}
          >
            PL-300 Certified
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
