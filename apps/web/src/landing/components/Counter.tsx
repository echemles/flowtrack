import { useEffect, useRef, useState } from 'react';
import { animate, useInView } from 'framer-motion';
import { useReducedMotion } from '../hooks/useReducedMotion';

type Props = {
  to: number;
  prefix?: string;
  suffix?: string;
  format?: (n: number) => string;
  duration?: number;
  className?: string;
};

export function Counter({ to, prefix = '', suffix = '', format, duration = 1.4, className = '' }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-10% 0px' });
  const [val, setVal] = useState(0);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) {
      setVal(to);
      return;
    }
    if (!inView) return;
    const controls = animate(0, to, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setVal(v),
    });
    return () => controls.stop();
  }, [inView, to, duration, reduced]);

  const display = format ? format(val) : Math.round(val).toLocaleString();

  return (
    <span ref={ref} className={className}>
      {prefix}{display}{suffix}
    </span>
  );
}
