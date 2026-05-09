import clsx from 'clsx';

const MODE_STYLES: Record<string, string> = {
  AIR: 'bg-mode-air/10 text-mode-air ring-mode-air/30',
  SEA: 'bg-mode-sea/10 text-mode-sea ring-mode-sea/30',
  ROAD: 'bg-mode-road/10 text-mode-road ring-mode-road/30',
  ECOM: 'bg-mode-ecom/10 text-mode-ecom ring-mode-ecom/30',
  COURIER: 'bg-mode-courier/10 text-mode-courier ring-mode-courier/30',
};

export function ModeChip({ mode }: { mode: string }) {
  const upper = mode.toUpperCase();
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1',
        MODE_STYLES[upper] ?? 'bg-slate-100 text-slate-700 ring-slate-300',
      )}
    >
      {upper}
    </span>
  );
}
