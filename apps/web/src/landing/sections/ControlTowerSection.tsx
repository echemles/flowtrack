import { Eyebrow } from '../components/Eyebrow';
import { HeadlineReveal } from '../components/HeadlineReveal';
import { GhostNumeral } from '../components/GhostNumeral';
import { Reveal } from '../components/Reveal';

const BULLETS = [
  'Live container ETAs across air, sea, road, ecommerce + courier.',
  'Inbox tied to shipments — no more "which thread was that?"',
  'AGI watches the whole fleet, escalates only what needs you.',
  'Pulse view: cash in transit, variance exposure, on-time %.',
];

export function ControlTowerSection() {
  return (
    <section
      id="control-tower"
      style={{
        background: 'var(--ink)',
        color: 'var(--paper)',
        position: 'relative',
        padding: 'clamp(96px, 14vh, 200px) 0',
        overflow: 'hidden',
      }}
    >
      <div aria-hidden className="ghost-frame">
        <div className="ghost-sticky ghost-left">
          <div className="ghost-pad-left">
            <GhostNumeral n="02" light />
          </div>
        </div>
      </div>

      <div className="lc" style={{ position: 'relative', zIndex: 1 }}>
        <div className="grid-12" style={{ rowGap: 56, alignItems: 'start' }}>
          <Reveal className="ct-left">
            <div style={{ marginBottom: 28 }}>
              <Eyebrow>One Pane of Glass</Eyebrow>
            </div>
            <HeadlineReveal text="Every Alert. / Every KPI. / Every Lane." />
            <p
              className="body-md"
              style={{
                marginTop: 32,
                maxWidth: 460,
                color: 'var(--mute)',
              }}
            >
              FlowTrack replaces the carrier-portal carousel.
              One screen. Every shipment, every exception, every
              dollar in transit — surfaced in real-time.
            </p>
          </Reveal>

          <Reveal className="ct-right" delay={0.1}>
            <div
              style={{
                width: '100%',
                aspectRatio: '16 / 10',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid var(--rule)',
                backgroundImage: 'url(/landing/dashboard.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'top center',
              }}
            />
            <div
              style={{
                marginTop: 12,
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: 'var(--mute)',
              }}
            >
              · Live screenshot · /app
            </div>
          </Reveal>
        </div>

        <div style={{ marginTop: 'clamp(64px, 10vh, 128px)' }}>
          <hr className="hairline-dark" style={{ marginBottom: 40 }} />
          <div className="grid-12" style={{ rowGap: 28 }}>
            {BULLETS.map((b, i) => (
              <Reveal key={b} delay={i * 0.06} className="ct-bullet">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, paddingRight: 16 }}>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: '0.18em',
                      color: 'var(--red)',
                    }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <p style={{ color: 'var(--paper)', fontSize: 16, lineHeight: 1.45, margin: 0 }}>
                    {b}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .ct-left { grid-column: span 12; }
        .ct-right { grid-column: span 12; }
        .ct-bullet { grid-column: span 12; }
        @media (min-width: 900px) {
          .ct-left { grid-column: span 5; }
          .ct-right { grid-column: 7 / span 6; }
          .ct-bullet { grid-column: span 3; }
        }
      `}</style>
    </section>
  );
}
