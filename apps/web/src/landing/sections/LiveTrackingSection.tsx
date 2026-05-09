import { Eyebrow } from '../components/Eyebrow';
import { HeadlineReveal } from '../components/HeadlineReveal';
import { GhostNumeral } from '../components/GhostNumeral';
import { Reveal } from '../components/Reveal';

export function LiveTrackingSection() {
  return (
    <section
      id="live"
      style={{
        background: 'var(--bone)',
        color: 'var(--navy)',
        position: 'relative',
        padding: 'clamp(96px, 14vh, 200px) 0',
        overflow: 'hidden',
      }}
    >
      <div aria-hidden style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <div style={{ position: 'sticky', top: '8vh', display: 'flex', justifyContent: 'flex-end' }}>
          <div style={{ paddingRight: 'clamp(16px, 4vw, 64px)' }}>
            <GhostNumeral n="03" />
          </div>
        </div>
      </div>

      <div className="lc" style={{ position: 'relative', zIndex: 1 }}>
        <div className="grid-12" style={{ rowGap: 56 }}>
          <Reveal className="lt-image">
            <div
              style={{
                width: 'calc(100% + clamp(20px, 4vw, 64px))',
                aspectRatio: '4 / 3',
                backgroundImage: 'url(/landing/routes-globe.jpg)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                marginLeft: 'calc(clamp(20px, 4vw, 64px) * -1)',
              }}
            />
          </Reveal>

          <Reveal className="lt-text" delay={0.12}>
            <div style={{ marginBottom: 28 }}>
              <Eyebrow>ETA-AGI</Eyebrow>
            </div>
            <HeadlineReveal text="We Predict / Late Before / It Is Late." />
            <p
              className="body-md"
              style={{ marginTop: 32, maxWidth: 460 }}
            >
              When a carrier says ETA <strong style={{ fontWeight: 500 }}>04 May</strong>, our
              ETA-AGI model says <strong style={{ fontWeight: 500, color: 'var(--red)' }}>02 May</strong>.
              We're right more often than the carrier — and we tell you before the
              shipper has to ask. Lane-aware confidence intervals, live port
              dwell, weather, customs queue.
            </p>

            <div
              style={{
                marginTop: 28,
                paddingTop: 20,
                borderTop: '1px solid var(--rule-light)',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 20,
                maxWidth: 460,
              }}
            >
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', color: 'var(--red)' }}>
                  Carrier
                </div>
                <div style={{ fontSize: 22, fontWeight: 200, marginTop: 6 }}>04 MAY</div>
              </div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', color: 'var(--red)' }}>
                  ETA-AGI
                </div>
                <div style={{ fontSize: 22, fontWeight: 200, marginTop: 6 }}>02 MAY</div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>

      <style>{`
        .lt-image { grid-column: span 12; }
        .lt-text { grid-column: span 12; }
        @media (min-width: 900px) {
          .lt-image { grid-column: span 7; }
          .lt-text { grid-column: 9 / span 4; }
        }
      `}</style>
    </section>
  );
}
