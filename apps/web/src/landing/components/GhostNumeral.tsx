type Props = {
  n: string;
  light?: boolean;
  className?: string;
};

export function GhostNumeral({ n, light = false, className = '' }: Props) {
  return (
    <span
      aria-hidden
      className={`ghost-numeral ${className}`}
      style={{ color: light ? 'var(--paper)' : 'var(--navy)' }}
    >
      {n}
    </span>
  );
}
