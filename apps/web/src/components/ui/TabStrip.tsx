import clsx from 'clsx';

export type Tab = { id: string; label: string; count?: number };

export function TabStrip({
  tabs,
  activeId,
  onChange,
  className,
}: {
  tabs: Tab[];
  activeId: string;
  onChange: (id: string) => void;
  className?: string;
}) {
  return (
    <div
      className={clsx(
        'flex items-center gap-2 border-b border-brand-rule',
        className,
      )}
    >
      {tabs.map((t) => {
        const active = t.id === activeId;
        return (
          <button
            key={t.id}
            type="button"
            onClick={() => onChange(t.id)}
            className={clsx(
              '-mb-px border-b-2 px-3 py-2.5 ft-eyebrow transition-colors',
              active
                ? 'border-brand-red text-brand-navy'
                : 'border-transparent text-brand-navy/50 hover:text-brand-navy',
            )}
          >
            {t.label}
            {typeof t.count === 'number' ? (
              <span className="ml-1.5 text-brand-navy/40">{t.count}</span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
