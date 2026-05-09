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
        'inline-flex items-center rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 px-2 py-0.5 text-xs font-medium text-white',
        className,
      )}
    >
      {label}
    </span>
  );
}
