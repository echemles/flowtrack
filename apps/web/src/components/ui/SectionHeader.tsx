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
        <h2 className="text-base font-semibold text-text-primary">{title}</h2>
        {subtitle ? (
          <p className="text-xs text-text-secondary">{subtitle}</p>
        ) : null}
      </div>
      {action}
    </div>
  );
}
