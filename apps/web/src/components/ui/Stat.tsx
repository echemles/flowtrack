import clsx from 'clsx';

export function Stat({
  label,
  value,
  delta,
  deltaTone = 'auto',
  className,
}: {
  label: string;
  value: string | number;
  delta?: string;
  /**
   * Logistics convention: red = bad, navy = good. 'auto' infers from a leading - or +.
   */
  deltaTone?: 'positive' | 'negative' | 'auto';
  className?: string;
}) {
  const tone =
    deltaTone === 'auto'
      ? typeof delta === 'string' && /^-/.test(delta.trim())
        ? 'negative'
        : 'positive'
      : deltaTone;
  return (
    <div
      className={clsx(
        'border border-brand-rule bg-brand-paper p-4',
        className,
      )}
    >
      <div className="ft-micro text-brand-navy/55">{label}</div>
      <div
        className="mt-2 text-brand-navy"
        style={{
          fontFamily: 'Switzer, sans-serif',
          fontWeight: 300,
          fontSize: '40px',
          lineHeight: 1.04,
          letterSpacing: '-0.01em',
        }}
      >
        {value}
      </div>
      {delta ? (
        <div
          className={clsx(
            'mt-1 text-[13px]',
            tone === 'negative' ? 'text-brand-red' : 'text-brand-navy/70',
          )}
        >
          {delta}
        </div>
      ) : null}
    </div>
  );
}
