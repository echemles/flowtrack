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
        'rounded-lg border border-border-subtle bg-surface-card p-4 shadow-sm',
        className,
      )}
    >
      {children}
    </div>
  );
}
