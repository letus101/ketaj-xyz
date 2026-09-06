import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const title = searchParams.get('title') || 'ketaj.xyz - Security Research';
    const category = searchParams.get('category') || 'Blog';

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            backgroundColor: '#0A0C14', // --background dark
            color: '#E7EAF0', // --foreground dark
            padding: '80px',
            fontFamily: 'sans-serif',
          }}
        >
          {/* Top category badge */}
          <div
            style={{
              display: 'flex',
              padding: '12px 24px',
              backgroundColor: 'rgba(184, 118, 15, 0.1)',
              border: '2px solid #F2A93B',
              color: '#F2A93B',
              fontSize: 24,
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
            }}
          >
            {category}
          </div>

          {/* Title */}
          <div
            style={{
              display: 'flex',
              fontSize: 64,
              fontWeight: 800,
              lineHeight: 1.2,
              marginTop: '40px',
              marginBottom: 'auto',
              maxWidth: '900px',
            }}
          >
            {title}
          </div>

          {/* Footer branding */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              width: '100%',
              justifyContent: 'space-between',
              borderTop: '2px solid #1E2333',
              paddingTop: '40px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div
                style={{
                  color: '#B0212B',
                  fontSize: 48,
                  fontWeight: 900,
                  marginRight: 16,
                }}
              >
                KETAJ
              </div>
              <div style={{ color: '#E7EAF0', fontSize: 48, fontWeight: 300 }}>.xyz</div>
            </div>
            <div style={{ color: '#8A95A5', fontSize: 24 }}>
              Security Research & Writeups
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: any) {
    console.log(`${e.message}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
