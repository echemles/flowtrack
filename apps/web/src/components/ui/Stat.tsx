import clsx from 'clsx';

export function Stat({
  label,
  value,
  delta,
  className,
}: {
  label: string;
  value: string | number;
  delta?: string;
  className?: string;
}) {
  return (
    <div
      className={clsx(
        'rounded-lg border border-border-subtle bg-surface-card p-4',
        className,
      )}
    >
      <div className="text-xs uppercase tracking-wide text-text-muted">{label}</div>
      <div className="mt-1 text-xl font-semibold">{value}</div>
      {delta ? (
        <div className="mt-1 text-xs text-text-secondary">{delta}</div>
      ) : null}
    </div>
  );
}
