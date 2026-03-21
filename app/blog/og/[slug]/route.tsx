import { ImageResponse } from '@vercel/og';
import { getPostBySlug } from '@/lib/blog';

export const runtime = 'edge';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
): Promise<ImageResponse> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  const title = post?.title ?? 'Blog Post';
  const topic = post?.topic ?? '';

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          background: 'linear-gradient(135deg, #f6f5f1, #f5efe3)',
          padding: '60px',
          fontFamily: 'monospace',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '24px',
          }}
        >
          <div
            style={{
              padding: '4px 12px',
              background: 'rgba(200,151,62,0.15)',
              color: '#c8973e',
              borderRadius: '12px',
              fontSize: '14px',
              fontWeight: 'bold',
              textTransform: 'uppercase',
            }}
          >
            {topic}
          </div>
        </div>
        <div
          style={{
            fontSize: '48px',
            fontWeight: 'bold',
            color: '#2c2a26',
            lineHeight: 1.2,
            marginBottom: '24px',
            maxWidth: '900px',
          }}
        >
          {title}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              background: '#c8973e',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontSize: '16px',
              fontWeight: 'bold',
            }}
          >
            SD
          </div>
          <div style={{ fontSize: '16px', color: '#8a8780' }}>
            Sulagna Dey — Data Science Blog
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
