import clsx from 'clsx';

export function AgiBadge({
  label = 'AGI',
  className,
}: {
  label?: string;
  className?: string;
}) {
  return (
    <span
      className={clsx(
        'ft-micro inline-flex items-center border border-brand-navy/20 bg-brand-paper px-2 py-1 text-brand-navy',
        className,
      )}
    >
      <span aria-hidden className="mr-1.5 inline-block h-1.5 w-1.5 bg-brand-navy" />
      {label}
    </span>
  );
}
