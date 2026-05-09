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
        'flex items-center gap-1 border-b border-border-subtle text-sm',
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
              '-mb-px border-b-2 px-3 py-2 transition-colors',
              active
                ? 'border-blue-600 font-semibold text-blue-700'
                : 'border-transparent text-text-secondary hover:text-text-primary',
            )}
          >
            {t.label}
            {typeof t.count === 'number' ? (
              <span className="ml-1 rounded-full bg-surface-canvas px-1.5 text-xs text-text-muted">
                {t.count}
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
