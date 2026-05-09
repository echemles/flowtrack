import { Eyebrow } from '../components/Eyebrow';
import { HeadlineReveal } from '../components/HeadlineReveal';
import { GhostNumeral } from '../components/GhostNumeral';
import { Reveal } from '../components/Reveal';
import { Counter } from '../components/Counter';

export function PulseSection() {
  return (
    <section
      id="pulse"
      style={{
        background: 'var(--bone)',
        color: 'var(--navy)',
        position: 'relative',
        padding: 'clamp(96px, 14vh, 200px) 0',
        overflow: 'hidden',
      }}
    >
      <div aria-hidden className="ghost-frame">
        <div className="ghost-sticky ghost-right">
          <div className="ghost-pad-right">
            <GhostNumeral n="05" />
          </div>
        </div>
      </div>

      <div className="lc" style={{ position: 'relative', zIndex: 1 }}>
        <div className="grid-12" style={{ rowGap: 56 }}>
          <Reveal className="pulse-left">
            <div style={{ marginBottom: 28 }}>
              <Eyebrow>Pulse</Eyebrow>
            </div>
            <HeadlineReveal text="What's In / Transit Is / What You Own." />
            <p className="body-md" style={{ marginTop: 32, maxWidth: 440 }}>
              Pulse turns your shipping board into a CFO-grade
              picture. Cash exposure, variance, on-time delivery
              — the numbers a finance director asks for at the
              end of every quarter.
            </p>
          </Reveal>

          <Reveal className="pulse-right" delay={0.1}>
            <div className="kpi-grid">
              <div className="kpi-tile">
                <div className="kpi-label">On-Time</div>
                <div className="kpi-value">
                  <Counter to={100} suffix="%" />
                </div>
                <div className="kpi-foot">Last 30 days</div>
              </div>
              <div className="kpi-tile">
                <div className="kpi-label">Value in Transit</div>
                <div className="kpi-value">
                  <Counter
                    to={371}
                    prefix="$"
                    suffix="K"
                    format={(n) => Math.round(n).toString()}
                  />
                </div>
                <div className="kpi-foot">12 active shipments</div>
              </div>
              <div className="kpi-tile">
                <div className="kpi-label">Variance Exposure</div>
                <div className="kpi-value">
                  <Counter to={3390} prefix="$" />
                </div>
                <div className="kpi-foot">Disputable line items</div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>

      <style>{`
        .pulse-left { grid-column: span 12; }
        .pulse-right { grid-column: span 12; }
        .kpi-grid {
          display: grid;
          grid-template-columns: 1fr;
          border-top: 1px solid var(--rule-light);
        }
        .kpi-tile {
          padding: 28px 0;
          border-bottom: 1px solid var(--rule-light);
        }
        .kpi-label {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--red);
          margin-bottom: 18px;
        }
        .kpi-value {
          font-family: 'Switzer', sans-serif;
          font-weight: 300;
          font-size: clamp(40px, 5.5vw, 88px);
          line-height: 0.92;
          letter-spacing: -0.02em;
          color: var(--navy);
        }
        .kpi-foot {
          margin-top: 14px;
          font-size: 13px;
          color: rgba(1, 28, 77, 0.55);
        }
        @media (min-width: 640px) {
          .kpi-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 0;
          }
          .kpi-tile {
            padding: 28px 24px;
            border-bottom: none;
            border-right: 1px solid var(--rule-light);
          }
          .kpi-tile:first-child { padding-left: 0; }
          .kpi-tile:last-child { border-right: none; padding-right: 0; }
        }
        @media (min-width: 900px) {
          .pulse-left { grid-column: span 5; }
          .pulse-right { grid-column: 7 / span 6; }
        }
      `}</style>
    </section>
  );
}
