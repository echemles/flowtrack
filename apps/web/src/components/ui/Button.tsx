import { ButtonHTMLAttributes, ReactNode } from 'react';
import clsx from 'clsx';

type Variant = 'primary' | 'secondary' | 'ghost';

const VARIANT_CLASSES: Record<Variant, string> = {
  primary: 'bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-300',
  secondary:
    'border border-border-subtle bg-surface-card text-text-primary hover:bg-surface-canvas focus-visible:ring-blue-200',
  ghost:
    'bg-transparent text-text-secondary hover:bg-surface-canvas hover:text-text-primary focus-visible:ring-blue-200',
};

export function Button({
  variant = 'primary',
  className,
  children,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  children: ReactNode;
}) {
  return (
    <button
      {...rest}
      className={clsx(
        'inline-flex items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-60',
        VARIANT_CLASSES[variant],
        className,
      )}
    >
      {children}
    </button>
  );
}
