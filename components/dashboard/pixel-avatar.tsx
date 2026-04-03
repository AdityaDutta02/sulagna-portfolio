// Server component — renders an 8x8 pixel art face using a CSS grid of coloured divs.
// Pixel codes: n=transparent p=hair s=skin e=eyes m=mouth b=body

interface PixelAvatarProps {
  size?: number;
}

type PixelCode = 'n' | 'p' | 's' | 'e' | 'm' | 'b';

const COLOUR_MAP: Record<PixelCode, string> = {
  n: 'transparent',
  p: '#3a2a1a',
  s: '#d4a878',
  e: '#2c2a26',
  m: 'var(--coral)',
  b: 'var(--amber)',
};

// 64 characters, row-major: rows 1-8 of the 8×8 face grid.
const PIXELS = 'nnppppnnnpppppppnpsssspnnsessensnssssssnnnsmmsnnnnnbbbbnnnnbbbbbbn' as const;

export function PixelAvatar({ size = 40 }: PixelAvatarProps) {
  const cellSize = size / 8;

  return (
    <div
      data-testid="pixel-avatar"
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(8, ${cellSize}px)`,
        gridTemplateRows: `repeat(8, ${cellSize}px)`,
        width: size,
        height: size,
        imageRendering: 'pixelated',
      }}
    >
      {Array.from(PIXELS).map((code, index) => (
        <div
          key={index}
          style={{ backgroundColor: COLOUR_MAP[code as PixelCode] }}
        />
      ))}
    </div>
  );
}
