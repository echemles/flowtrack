import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PillButton } from '../components/PillButton';
import { getLenis } from '../hooks/useLenis';
import { useReducedMotion } from '../hooks/useReducedMotion';

// Sticky nav offset — keep in sync with `.landing-nav` height (64px header +
// some breathing room). Used by Lenis offset and by the scrollIntoView
// fallback so the section heading isn't tucked under the nav.
const NAV_OFFSET = -72;

type NavLink = { label: string; href: string; id: string };

const LINKS: NavLink[] = [
  { label: 'Product', href: '#control-tower', id: 'control-tower' },
  { label: 'Tracking', href: '#live-tracking', id: 'live-tracking' },
  { label: 'AGI', href: '#agi', id: 'agi' },
  { label: 'Pulse', href: '#pulse', id: 'pulse' },
];

export function Nav() {
  const [open, setOpen] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const reduced = useReducedMotion();

  // IntersectionObserver — highlight the nav link whose section is closest
  // to the middle of the viewport. threshold ~0.4 keeps the highlight from
  // flickering across short scrolls.
  useEffect(() => {
    const targets = LINKS.map((l) => document.getElementById(l.id)).filter(
      (el): el is HTMLElement => Boolean(el),
    );
    if (!targets.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        // Pick the most-visible intersecting entry as active.
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { threshold: [0.4], rootMargin: '-72px 0px -40% 0px' },
    );
    targets.forEach((t) => observer.observe(t));
    return () => observer.disconnect();
  }, []);

  const handleAnchorClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    if (!href.startsWith('#')) return;
    e.preventDefault();
    setOpen(false);

    const lenis = getLenis();
    if (lenis && !reduced) {
      lenis.scrollTo(href, {
        offset: NAV_OFFSET,
        duration: 1.2,
        easing: (t: number) => 1 - Math.pow(1 - t, 3),
      });
      return;
    }
    // Fallback: native scrollIntoView. Use 'instant' for reduced-motion users.
    const target = document.querySelector(href) as HTMLElement | null;
    if (!target) return;
    if (reduced) {
      target.scrollIntoView({ behavior: 'auto', block: 'start' });
    } else {
      const top = target.getBoundingClientRect().top + window.scrollY + NAV_OFFSET;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

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
          {LINKS.map((l) => {
            const isActive = activeId === l.id;
            return (
              <a
                key={l.label}
                href={l.href}
                onClick={(e) => handleAnchorClick(e, l.href)}
                aria-current={isActive ? 'true' : undefined}
                className={`nav-link${isActive ? ' nav-link-active' : ''}`}
                style={{
                  color: 'var(--paper)',
                  opacity: isActive ? 1 : 0.75,
                  textDecoration: 'none',
                  fontSize: 12,
                  fontWeight: 500,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  position: 'relative',
                  paddingBottom: 4,
                  transition: 'opacity 200ms ease',
                }}
              >
                {l.label}
                <span
                  aria-hidden
                  style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    bottom: -2,
                    height: 1,
                    background: 'var(--red)',
                    transform: isActive ? 'scaleX(1)' : 'scaleX(0)',
                    transformOrigin: 'left center',
                    transition: 'transform 240ms ease',
                  }}
                />
              </a>
            );
          })}
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span className="nav-cta">
            <PillButton to="/app" variant="primary">
              See the demo →
            </PillButton>
          </span>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-label="Menu"
            aria-expanded={open}
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
            paddingTop: 12,
            borderTop: '1px solid var(--rule)',
          }}
        >
          {LINKS.map((l) => {
            const isActive = activeId === l.id;
            return (
              <a
                key={l.label}
                href={l.href}
                onClick={(e) => handleAnchorClick(e, l.href)}
                aria-current={isActive ? 'true' : undefined}
                style={{
                  color: 'var(--paper)',
                  opacity: isActive ? 1 : 0.85,
                  textDecoration: 'none',
                  fontSize: 13,
                  fontWeight: 500,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  paddingTop: 6,
                  paddingBottom: 6,
                  minHeight: 44,
                  display: 'inline-flex',
                  alignItems: 'center',
                  borderLeft: isActive ? '2px solid var(--red)' : '2px solid transparent',
                  paddingLeft: 10,
                }}
              >
                {l.label}
              </a>
            );
          })}
          <div style={{ marginTop: 4 }}>
            <PillButton to="/app" variant="primary">See the demo →</PillButton>
          </div>
        </div>
      ) : null}

      <style>{`
        @media (max-width: 720px) {
          .nav-links { display: none !important; }
          .nav-burger { display: inline-flex !important; }
        }
        @media (max-width: 420px) {
          .nav-cta { display: none !important; }
        }
      `}</style>
    </header>
  );
}
