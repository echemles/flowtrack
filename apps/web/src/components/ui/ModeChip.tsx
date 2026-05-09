const MODE_DOT: Record<string, string> = {
  AIR: '#011C4D',
  SEA: '#1F4FA8',
  ROAD: '#F32735',
  ECOM: '#5A6F94',
  COURIER: '#0A1326',
};

export function ModeChip({ mode }: { mode: string }) {
  const upper = mode.toUpperCase();
  const dot = MODE_DOT[upper] ?? '#011C4D';
  return (
    <span className="ft-micro inline-flex items-center gap-1.5 border border-brand-rule bg-brand-paper px-2 py-1 text-brand-navy">
      <span
        aria-hidden
        className="inline-block h-1.5 w-1.5"
        style={{ background: dot }}
      />
      {upper}
    </span>
  );
}
