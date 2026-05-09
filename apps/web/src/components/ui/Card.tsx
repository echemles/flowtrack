import { ReactNode } from 'react';
import clsx from 'clsx';

export function Card({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={clsx(
        'border border-brand-rule bg-brand-paper p-4',
        className,
      )}
    >
      {children}
    </div>
  );
}

/**
 * Card section header with eyebrow type and trailing hairline rule.
 * Drop in at top of a Card body. Tone navy by default; set tone="red" for accent.
 */
export function CardHeader({
  children,
  tone = 'navy',
  trailing,
  className,
}: {
  children: ReactNode;
  tone?: 'navy' | 'red';
  trailing?: ReactNode;
  className?: string;
}) {
  return (
    <div className={clsx('flex items-center gap-3', className)}>
      <span
        className={clsx(
          'ft-eyebrow whitespace-nowrap',
          tone === 'red' ? 'text-brand-red' : 'text-brand-navy',
        )}
      >
        {children}
      </span>
      <span aria-hidden className="h-px flex-1 bg-brand-rule" />
      {trailing ? <div className="shrink-0">{trailing}</div> : null}
    </div>
  );
}
