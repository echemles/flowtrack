import clsx from 'clsx';

export function KpiTile({
  label,
  value,
  delta,
  footnote,
  className,
}: {
  label: string;
  value: string | number;
  delta?: string;
  footnote?: string;
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
      <div className="mt-1 text-2xl font-semibold text-text-primary">{value}</div>
      {delta ? (
        <div className="mt-1 text-xs font-medium text-emerald-700">{delta}</div>
      ) : null}
      {footnote ? (
        <div className="mt-1 text-xs text-text-secondary">{footnote}</div>
      ) : null}
    </div>
  );
}
