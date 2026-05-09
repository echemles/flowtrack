import clsx from 'clsx';

const STATUS_STYLES: Record<string, string> = {
  on_time: 'bg-emerald-100 text-emerald-700 ring-emerald-200',
  delivered: 'bg-emerald-100 text-emerald-700 ring-emerald-200',
  in_transit: 'bg-blue-100 text-blue-700 ring-blue-200',
  arriving: 'bg-indigo-100 text-indigo-700 ring-indigo-200',
  dispatched: 'bg-sky-100 text-sky-700 ring-sky-200',
  planned: 'bg-slate-100 text-slate-700 ring-slate-200',
  delayed: 'bg-amber-100 text-amber-800 ring-amber-200',
  at_risk: 'bg-amber-100 text-amber-800 ring-amber-200',
  overdue: 'bg-red-100 text-red-700 ring-red-200',
  flagged: 'bg-red-100 text-red-700 ring-red-200',
  disputed: 'bg-orange-100 text-orange-700 ring-orange-200',
  outstanding: 'bg-amber-100 text-amber-800 ring-amber-200',
  paid: 'bg-emerald-100 text-emerald-700 ring-emerald-200',
};

export type StatusPillStatus = keyof typeof STATUS_STYLES | string;

const LABELS: Record<string, string> = {
  on_time: 'On time',
  in_transit: 'In transit',
  at_risk: 'At risk',
};

export function StatusPill({ status }: { status: StatusPillStatus }) {
  const key = String(status).toLowerCase().replace(/[\s-]+/g, '_');
  const cls = STATUS_STYLES[key] ?? 'bg-slate-100 text-slate-700 ring-slate-200';
  const label = LABELS[key] ?? key.replace(/_/g, ' ');
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium capitalize ring-1',
        cls,
      )}
    >
      {label}
    </span>
  );
}
