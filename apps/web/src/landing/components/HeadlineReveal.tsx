import { motion } from 'framer-motion';
import { useReducedMotion } from '../hooks/useReducedMotion';

type Props = {
  text: string;
  className?: string;
  asHero?: boolean;
};

export function HeadlineReveal({ text, className = '', asHero = false }: Props) {
  const reduced = useReducedMotion();
  const lines = text.split('/').map((s) => s.trim()).filter(Boolean);

  if (reduced) {
    return (
      <h1 className={`display ${asHero ? 'display-hero' : ''} ${className}`}>
        {lines.map((line, i) => (
          <span key={i} style={{ display: 'block' }}>{line}</span>
        ))}
      </h1>
    );
  }

  return (
    <h1 className={`display ${asHero ? 'display-hero' : ''} ${className}`}>
      {lines.map((line, lineIdx) => (
        <span key={lineIdx} style={{ display: 'block', overflow: 'hidden' }}>
          <motion.span
            style={{ display: 'inline-block' }}
            initial={{ y: '110%' }}
            animate={{ y: 0 }}
            transition={{
              duration: 0.9,
              delay: 0.05 + lineIdx * 0.12,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </h1>
  );
}
