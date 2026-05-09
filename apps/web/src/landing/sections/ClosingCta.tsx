import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { HeadlineReveal } from '../components/HeadlineReveal';
import { PillButton } from '../components/PillButton';
import { Eyebrow } from '../components/Eyebrow';
import { useReducedMotion } from '../hooks/useReducedMotion';

export function ClosingCta() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [60, -60]);

  return (
    <section
      id="cta"
      ref={ref}
      style={{
        position: 'relative',
        background: 'var(--navy)',
        color: 'var(--paper)',
        padding: 'clamp(120px, 18vh, 240px) 0',
        overflow: 'hidden',
        textAlign: 'center',
      }}
    >
      <motion.div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          y: reduced ? 0 : y,
          zIndex: 0,
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'url(/landing/ship-night.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.22,
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(180deg, var(--navy) 0%, rgba(1,28,77,0.55) 50%, var(--navy) 100%)',
          }}
        />
      </motion.div>

      <div className="lc" style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ marginBottom: 32, display: 'flex', justifyContent: 'center' }}>
          <Eyebrow>Ready</Eyebrow>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center', maxWidth: 1100 }}>
            <HeadlineReveal text="Ready To See / Your Fleet / Like This?" />
          </div>
        </div>

        <div
          style={{
            marginTop: 56,
            display: 'flex',
            justifyContent: 'center',
            gap: 16,
            flexWrap: 'wrap',
          }}
        >
          <PillButton to="/app" variant="primary">Start the demo →</PillButton>
        </div>

        <p
          style={{
            marginTop: 36,
            color: 'var(--mute)',
            fontSize: 13,
            letterSpacing: '0.04em',
          }}
        >
          No credit card. Live data, your shipments, in under 10 minutes.
        </p>
      </div>
    </section>
  );
}
