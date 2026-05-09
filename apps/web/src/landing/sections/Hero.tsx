import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { Eyebrow } from '../components/Eyebrow';
import { HeadlineReveal } from '../components/HeadlineReveal';
import { PillButton } from '../components/PillButton';
import { ScrollHint } from '../components/ScrollHint';
import { useReducedMotion } from '../hooks/useReducedMotion';

const HERO_IMG = `${import.meta.env.BASE_URL}landing/hero-port.jpg`;

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 600], [0, 60]);

  const [imgOk, setImgOk] = useState(true);
  useEffect(() => {
    const i = new Image();
    i.onload = () => setImgOk(true);
    i.onerror = () => setImgOk(false);
    i.src = HERO_IMG;
  }, []);

  return (
    <section
      ref={ref}
      style={{
        position: 'relative',
        minHeight: '100vh',
        background: 'var(--navy)',
        color: 'var(--paper)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* background image with parallax + ken-burns */}
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
          className={imgOk ? 'kenburns' : 'hero-fallback'}
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: imgOk ? `url(${HERO_IMG})` : 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.32,
            willChange: 'transform',
          }}
        />
        {/* navy gradient overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(180deg, rgba(1,28,77,0.85) 0%, rgba(1,28,77,0.4) 35%, rgba(1,28,77,0.95) 100%)',
          }}
        />
        {/* subtle grain rule top + bottom */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'var(--rule)' }} />
      </motion.div>

      {/* content */}
      <div
        className="lc"
        style={{
          position: 'relative',
          zIndex: 2,
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          paddingTop: 'calc(64px + clamp(40px, 8vh, 96px))',
          paddingBottom: 'clamp(36px, 6vh, 64px)',
          gap: 48,
        }}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Eyebrow>FlowTrack · Logistics Control Tower</Eyebrow>
        </motion.div>

        <div className="grid-12" style={{ alignItems: 'end' }}>
          <div style={{ gridColumn: 'span 12' }}>
            <HeadlineReveal text="Track / Every / Shipment" asHero />
          </div>
        </div>

        <div className="grid-12" style={{ alignItems: 'end' }}>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="body-md"
            style={{
              gridColumn: 'span 12',
              maxWidth: 520,
              color: 'var(--mute)',
              fontSize: 'clamp(15px, 1.2vw, 19px)',
            }}
          >
            One pane of glass for every container, every email, every exception.
            Built for freight teams who refuse to live in spreadsheets and carrier portals.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
            style={{
              gridColumn: 'span 12',
              display: 'flex',
              gap: 14,
              flexWrap: 'wrap',
              marginTop: 12,
            }}
          >
            <PillButton to="/app" variant="primary">See the demo →</PillButton>
            <PillButton variant="ghost-light">Watch 60s tour</PillButton>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.6 }}
          style={{ display: 'flex', justifyContent: 'flex-start' }}
        >
          <ScrollHint />
        </motion.div>
      </div>
    </section>
  );
}
