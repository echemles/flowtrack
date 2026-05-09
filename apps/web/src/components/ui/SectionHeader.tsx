import { ReactNode } from 'react';

export function SectionHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-3 flex items-end justify-between gap-4">
      <div>
        <h2
          className="text-brand-navy"
          style={{
            fontFamily: 'Switzer, sans-serif',
            fontWeight: 400,
            fontSize: '22px',
            lineHeight: 1.2,
            letterSpacing: '-0.005em',
          }}
        >
          {title}
        </h2>
        {subtitle ? (
          <p className="ft-micro mt-1.5 text-brand-navy/55">{subtitle}</p>
        ) : null}
      </div>
      {action}
    </div>
  );
}
