import clsx from 'clsx';

type Tone = 'navy' | 'red' | 'mute';

const STATUS_TONE: Record<string, Tone> = {
  on_time: 'navy',
  delivered: 'mute',
  done: 'mute',
  in_transit: 'navy',
  active: 'navy',
  arriving: 'navy',
  dispatched: 'navy',
  planned: 'mute',
  delayed: 'red',
  at_risk: 'red',
  overdue: 'red',
  flagged: 'red',
  incident: 'red',
  disputed: 'red',
  outstanding: 'red',
  paid: 'mute',
};

export type StatusPillStatus = keyof typeof STATUS_TONE | string;

const LABELS: Record<string, string> = {
  on_time: 'On time',
  in_transit: 'In transit',
  at_risk: 'At risk',
};

const TONE_TEXT: Record<Tone, string> = {
  navy: 'text-brand-navy',
  red: 'text-brand-red',
  mute: 'text-brand-navy/55',
};
const TONE_BORDER: Record<Tone, string> = {
  navy: 'border-brand-rule',
  red: 'border-brand-red/45',
  mute: 'border-brand-rule',
};
const TONE_DOT: Record<Tone, string> = {
  navy: '#011C4D',
  red: '#F32735',
  mute: 'rgba(1,28,77,0.5)',
};

export function StatusPill({ status }: { status: StatusPillStatus }) {
  const key = String(status).toLowerCase().replace(/[\s-]+/g, '_');
  const tone: Tone = STATUS_TONE[key] ?? 'mute';
  const label = LABELS[key] ?? key.replace(/_/g, ' ');
  return (
    <span
      className={clsx(
        'ft-micro inline-flex items-center gap-1.5 border bg-brand-paper px-2 py-1',
        TONE_BORDER[tone],
        TONE_TEXT[tone],
      )}
    >
      <span
        aria-hidden
        className="inline-block h-1.5 w-1.5"
        style={{ background: TONE_DOT[tone] }}
      />
      {label}
    </span>
  );
}
