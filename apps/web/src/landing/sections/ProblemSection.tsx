import { Eyebrow } from '../components/Eyebrow';
import { HeadlineReveal } from '../components/HeadlineReveal';
import { GhostNumeral } from '../components/GhostNumeral';
import { Reveal } from '../components/Reveal';

export function ProblemSection() {
  return (
    <section
      id="problem"
      style={{
        background: 'var(--bone)',
        color: 'var(--navy)',
        position: 'relative',
        padding: 'clamp(96px, 14vh, 200px) 0',
        overflow: 'hidden',
      }}
    >
      {/* sticky ghost numeral */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          pointerEvents: 'none',
        }}
      >
        <div style={{ position: 'sticky', top: '8vh', display: 'flex', justifyContent: 'flex-end' }}>
          <div style={{ paddingRight: 'clamp(16px, 4vw, 64px)' }}>
            <GhostNumeral n="01" />
          </div>
        </div>
      </div>

      <div className="lc" style={{ position: 'relative', zIndex: 1 }}>
        <div className="grid-12" style={{ rowGap: 64 }}>
          <Reveal className="reveal-col" delay={0}>
            <div style={{ marginBottom: 24 }}>
              <Eyebrow>Fragmented Visibility</Eyebrow>
            </div>
          </Reveal>

          <div className="grid-12" style={{ gridColumn: 'span 12', alignItems: 'start', rowGap: 48 }}>
            <Reveal className="left-col" delay={0.05}>
              <p
                className="body-md"
                style={{
                  maxWidth: 380,
                  fontSize: 'clamp(15px, 1.05vw, 17px)',
                }}
              >
                Freight teams juggle a TMS, three carrier portals,
                two WhatsApp groups, an inbox, and a spreadsheet
                that nobody trusts.
                <br /><br />
                The shipment is visible. The picture isn't.
              </p>
            </Reveal>

            <Reveal className="right-col" delay={0.12}>
              <HeadlineReveal text="7 Tools. / 0 Answers." />
            </Reveal>
          </div>

          <Reveal className="image-row" delay={0.15}>
            <div
              style={{
                marginTop: 48,
                width: '100%',
                aspectRatio: '16 / 9',
                backgroundImage: 'url(/landing/problem-fragments.jpg)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                borderRadius: 0,
                boxShadow: 'inset 0 0 0 1px var(--rule-light)',
              }}
            />
          </Reveal>
        </div>
      </div>

      <style>{`
        .reveal-col { grid-column: span 12; }
        .left-col { grid-column: span 12; }
        .right-col { grid-column: span 12; }
        .image-row { grid-column: span 12; }
        @media (min-width: 900px) {
          .left-col { grid-column: span 4; }
          .right-col { grid-column: 6 / span 7; }
        }
      `}</style>
    </section>
  );
}
