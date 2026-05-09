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
        <div className="mt-1 text-[13px] text-brand-navy/70">{delta}</div>
      ) : null}
      {footnote ? (
        <div className="mt-1 text-[12px] text-brand-navy/55">{footnote}</div>
      ) : null}
    </div>
  );
}
