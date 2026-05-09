import { ButtonHTMLAttributes, ReactNode } from 'react';
import clsx from 'clsx';

type Variant = 'primary' | 'secondary' | 'ghost';

// Sharp-corner rectangular buttons. Eyebrow type, no border-radius.
const BASE =
  'inline-flex items-center justify-center gap-2 px-3 py-1.5 ft-eyebrow transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap';

const VARIANT_CLASSES: Record<Variant, string> = {
  primary:
    'bg-brand-red text-brand-paper border border-brand-red hover:bg-brand-redInk hover:border-brand-redInk',
  secondary:
    'bg-transparent text-brand-navy border border-brand-navy hover:bg-brand-navy/5',
  ghost:
    'bg-transparent text-brand-navy border border-transparent hover:bg-brand-navy/5',
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
      className={clsx(BASE, VARIANT_CLASSES[variant], className)}
    >
      {children}
    </button>
  );
}
