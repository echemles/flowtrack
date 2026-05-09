import { useEffect } from 'react';
import './landing.css';
import { useLenis } from './hooks/useLenis';
import { Nav } from './sections/Nav';
import { Hero } from './sections/Hero';
import { Marquee } from './sections/Marquee';
import { ProblemSection } from './sections/ProblemSection';
import { ControlTowerSection } from './sections/ControlTowerSection';
import { LiveTrackingSection } from './sections/LiveTrackingSection';
import { AgiSection } from './sections/AgiSection';
import { PulseSection } from './sections/PulseSection';
import { ClosingCta } from './sections/ClosingCta';
import { Footer } from './sections/Footer';

export function Landing() {
  useLenis();

  useEffect(() => {
    const prev = document.body.style.background;
    document.body.style.background = 'var(--navy)';
    return () => { document.body.style.background = prev; };
  }, []);

  return (
    <div className="landing-root">
      <Nav />
      <Hero />
      <Marquee />
      <ProblemSection />
      <ControlTowerSection />
      <LiveTrackingSection />
      <AgiSection />
      <PulseSection />
      <ClosingCta />
      <Footer />
    </div>
  );
}
