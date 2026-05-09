import { Eyebrow } from '../components/Eyebrow';
import { HeadlineReveal } from '../components/HeadlineReveal';
import { GhostNumeral } from '../components/GhostNumeral';
import { Reveal } from '../components/Reveal';

const ACTIONS = [
  {
    tag: 'Escalation',
    body: 'Escalate to ops lead — container MSCU3429812 cleared customs but is still sitting at Algeciras Day 4.',
  },
  {
    tag: 'Document',
    body: 'Request commercial invoice from supplier Henan Yidu Trading — required for DDP entry into Rotterdam.',
  },
  {
    tag: 'Dispute',
    body: 'Open dispute with Maersk finance — invoice INV-44819 charged demurrage that was already pre-paid.',
  },
];

export function AgiSection() {
  return (
    <section
      id="agi"
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
            <GhostNumeral n="04" light />
          </div>
        </div>
      </div>

      <div className="lc" style={{ position: 'relative', zIndex: 1 }}>
        <div className="grid-12" style={{ rowGap: 56 }}>
          <Reveal className="agi-text">
            <div style={{ marginBottom: 28 }}>
              <Eyebrow>AGI Triage</Eyebrow>
            </div>
            <HeadlineReveal text="It Handles / Tickets. / You Handle / Exceptions." />
          </Reveal>

          <Reveal className="agi-body" delay={0.12}>
            <p className="body-md" style={{ maxWidth: 480, color: 'var(--mute)' }}>
              FlowTrack's agent reads every email, every WhatsApp,
              every customs document. It drafts the next move and
              waits for your approval — or executes if you've
              given it a leash.
            </p>
          </Reveal>
        </div>

        <div style={{ marginTop: 'clamp(72px, 10vh, 128px)' }}>
          <hr className="hairline-dark" style={{ marginBottom: 0 }} />
          <div className="grid-12" style={{ marginTop: 0 }}>
            {ACTIONS.map((a, i) => (
              <Reveal
                key={a.tag}
                delay={i * 0.08}
                className={`agi-card${i === 0 ? ' agi-card-first' : ''}${i === ACTIONS.length - 1 ? ' agi-card-last' : ''}`}
              >
                <div className="agi-card-inner">
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: '0.18em',
                      textTransform: 'uppercase',
                      color: 'var(--red)',
                      marginBottom: 16,
                    }}
                  >
                    {String(i + 1).padStart(2, '0')} · {a.tag}
                  </div>
                  <p style={{ color: 'var(--paper)', fontSize: 16, lineHeight: 1.5, margin: 0 }}>
                    {a.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
          <hr className="hairline-dark" style={{ marginTop: 0 }} />
        </div>
      </div>

      <style>{`
        .agi-text { grid-column: span 12; }
        .agi-body { grid-column: span 12; }
        .agi-card { grid-column: span 12; }
        .agi-card-inner {
          padding: 28px 0;
          border-bottom: 1px solid var(--rule);
          height: 100%;
        }
        .agi-card-last .agi-card-inner { border-bottom: none; }
        @media (min-width: 900px) {
          .agi-text { grid-column: span 7; }
          .agi-body { grid-column: 9 / span 4; align-self: end; }
          .agi-card { grid-column: span 4; }
          .agi-card-inner {
            padding: 36px 28px 36px 28px;
            border-bottom: none;
            border-right: 1px solid var(--rule);
          }
          .agi-card-first .agi-card-inner { padding-left: 0; }
          .agi-card-last .agi-card-inner { border-right: none; padding-right: 0; }
        }
      `}</style>
    </section>
  );
}
