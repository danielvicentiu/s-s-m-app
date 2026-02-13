import { ImageResponse } from 'next/og';

// Route segment config
export const runtime = 'edge';

// Image metadata
export const alt = 's-s-m.ro — Platformă SSM & PSI';
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

// Locale-specific taglines
const taglines: Record<string, string> = {
  ro: 'Platformă digitală pentru conformitate SSM & PSI',
  bg: 'Дигитална платформа за съответствие ОБЗ и ППО',
  hu: 'Digitális platform a munkavédelem és tűzvédelem megfelelőségéhez',
  de: 'Digitale Plattform für Arbeitsschutz & Brandschutz',
  pl: 'Cyfrowa platforma zgodności BHP i ochrony przeciwpożarowej',
  en: 'Digital platform for OSH & Fire Safety compliance',
};

// Locale-specific titles
const titles: Record<string, string> = {
  ro: 'SSM & PSI',
  bg: 'ОБЗ & ППО',
  hu: 'Munkavédelem & Tűzvédelem',
  de: 'Arbeitsschutz & Brandschutz',
  pl: 'BHP & Ochrona przeciwpożarowa',
  en: 'OSH & Fire Safety',
};

export default async function Image({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const tagline = taglines[locale] || taglines.ro;
  const title = titles[locale] || titles.ro;

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
          background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 50%, #60a5fa 100%)',
          padding: '80px',
          fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        }}
      >
        {/* Top section - Logo and brand */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
          }}
        >
          {/* Logo/Brand */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '20px',
            }}
          >
            <div
              style={{
                width: '80px',
                height: '80px',
                background: 'white',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '48px',
                fontWeight: 'bold',
                color: '#1e40af',
              }}
            >
              S
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div
                style={{
                  fontSize: '64px',
                  fontWeight: 'bold',
                  color: 'white',
                  letterSpacing: '-0.02em',
                  lineHeight: 1,
                }}
              >
                s-s-m.ro
              </div>
              <div
                style={{
                  fontSize: '28px',
                  color: 'rgba(255, 255, 255, 0.9)',
                  marginTop: '8px',
                }}
              >
                {title}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom section - Tagline */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            width: '100%',
          }}
        >
          <div
            style={{
              fontSize: '36px',
              color: 'white',
              lineHeight: 1.4,
              maxWidth: '900px',
              fontWeight: '500',
            }}
          >
            {tagline}
          </div>

          {/* Decorative element */}
          <div
            style={{
              display: 'flex',
              gap: '12px',
            }}
          >
            <div
              style={{
                width: '60px',
                height: '6px',
                background: 'white',
                borderRadius: '3px',
              }}
            />
            <div
              style={{
                width: '40px',
                height: '6px',
                background: 'rgba(255, 255, 255, 0.6)',
                borderRadius: '3px',
              }}
            />
            <div
              style={{
                width: '20px',
                height: '6px',
                background: 'rgba(255, 255, 255, 0.4)',
                borderRadius: '3px',
              }}
            />
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
