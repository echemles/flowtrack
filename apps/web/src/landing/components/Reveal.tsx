import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion';

type Props = {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: 'div' | 'section' | 'span' | 'li';
};

export function Reveal({ children, delay = 0, y = 32, className = '', as = 'div' }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-15% 0px', amount: 0.05 });
  const reduced = useReducedMotion();
  const Comp = motion[as];

  if (reduced) {
    return <Comp ref={ref as any} className={className}>{children}</Comp>;
  }

  return (
    <Comp
      ref={ref as any}
      className={className}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y }}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </Comp>
  );
}
