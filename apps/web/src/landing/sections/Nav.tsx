import { useState } from 'react';
import { Link } from 'react-router-dom';
import { PillButton } from '../components/PillButton';

export function Nav() {
  const [open, setOpen] = useState(false);

  const links = [
    { label: 'Product', href: '#control-tower' },
    { label: 'Pulse', href: '#pulse' },
    { label: 'AGI', href: '#agi' },
    { label: 'Pricing', href: '#cta' },
  ];

  return (
    <header className="landing-nav">
      <div
        className="lc"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: 64,
        }}
      >
        <Link
          to="/"
          style={{
            color: 'var(--paper)',
            textDecoration: 'none',
            fontWeight: 700,
            fontSize: 13,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <span style={{
            width: 8, height: 8, background: 'var(--red)', borderRadius: 2, display: 'inline-block',
          }} />
          FlowTrack
        </Link>

        <nav
          style={{
            display: 'flex',
            gap: 36,
            alignItems: 'center',
          }}
          className="nav-links"
        >
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              style={{
                color: 'var(--paper)',
                opacity: 0.75,
                textDecoration: 'none',
                fontSize: 12,
                fontWeight: 500,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
              }}
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <PillButton to="/app" variant="primary">
            See the demo →
          </PillButton>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-label="Menu"
            className="nav-burger"
            style={{
              display: 'none',
              background: 'transparent',
              border: '1px solid var(--rule)',
              color: 'var(--paper)',
              borderRadius: 999,
              width: 40,
              height: 40,
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            ☰
          </button>
        </div>
      </div>

      {open ? (
        <div
          className="lc"
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 14,
            paddingBottom: 24,
            paddingTop: 8,
            borderTop: '1px solid var(--rule)',
          }}
        >
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              onClick={() => setOpen(false)}
              style={{
                color: 'var(--paper)',
                textDecoration: 'none',
                fontSize: 13,
                fontWeight: 500,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
              }}
            >
              {l.label}
            </a>
          ))}
        </div>
      ) : null}

      <style>{`
        @media (max-width: 720px) {
          .nav-links { display: none !important; }
          .nav-burger { display: inline-flex !important; }
        }
      `}</style>
    </header>
  );
}
