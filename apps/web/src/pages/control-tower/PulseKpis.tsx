import type { Kpi } from '@flowtrack/shared';
import { Activity } from 'lucide-react';
import { formatMoneyCompactK, formatMoney } from '../../lib/format';
import clsx from 'clsx';

const INDUSTRY_COLORS: Record<string, string> = {
  Industrial: 'bg-slate-100 text-slate-700',
  Electronics: 'bg-blue-100 text-blue-700',
  Beauty: 'bg-pink-100 text-pink-700',
  Apparel: 'bg-violet-100 text-violet-700',
  Pharma: 'bg-emerald-100 text-emerald-700',
  Food: 'bg-amber-100 text-amber-700',
};

function findKpi(pulse: Kpi[], slug: string) {
  return pulse.find((k) => k.slug === slug);
}

export function PulseKpis({ pulse }: { pulse: Kpi[] }) {
  const onTime = findKpi(pulse, 'on_time_delivery');
  const valueInTransit = findKpi(pulse, 'value_in_transit');
  const outstanding = findKpi(pulse, 'outstanding');
  const disputed = findKpi(pulse, 'disputed');
  const variance = findKpi(pulse, 'variance_exposure');
  const industries = findKpi(pulse, 'industry_coverage');

  return (
    <section className="rounded-lg border border-border-subtle bg-surface-card p-4">
      <header className="mb-4 flex items-center justify-between">
        <div className="flex items-start gap-2">
          <div className="rounded-md bg-violet-50 p-1.5">
            <Activity size={14} className="text-violet-600" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-text-primary">Pulse</h3>
            <p className="text-xs text-text-secondary">Financial · operational health</p>
          </div>
        </div>
        <button className="rounded-md border border-border-subtle bg-surface-card px-2 py-1 text-[11px] text-text-secondary hover:bg-surface-canvas">
          ROI calc
        </button>
      </header>

      {/* On-time bar */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-text-secondary">
          <span>On-time delivery</span>
          <span className="text-emerald-600 text-base">{onTime?.value_pct ?? 100}%</span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-surface-canvas">
          <div
            className="h-full bg-emerald-500"
            style={{ width: `${onTime?.value_pct ?? 100}%` }}
          />
        </div>
        <p className="text-[11px] text-text-muted">vs. 92% industry benchmark</p>
      </div>

      {/* KPI grid */}
      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCell
          label="VALUE IN TRANSIT"
          value={valueInTransit ? formatMoneyCompactK(valueInTransit.value_minor ?? 0) : '$371K'}
          footnote="declared cargo across 9 active shipments"
          tone="neutral"
        />
        <KpiCell
          label="OUTSTANDING"
          value={outstanding ? formatMoney(outstanding.value_minor ?? 0, 'USD', { cents: false }) : '$48,498'}
          footnote="8 unpaid invoices"
          tone="neutral"
        />
        <KpiCell
          label="DISPUTED"
          value={disputed ? formatMoney(disputed.value_minor ?? 0, 'USD', { cents: false }) : '$23,740'}
          footnote="2 active disputes"
          tone="danger"
        />
        <KpiCell
          label="VARIANCE EXPOSURE"
          value={variance ? formatMoney(variance.value_minor ?? 0, 'USD', { cents: false }) : '$3,390'}
          footnote="cumulative over-quote across all invoices"
          tone="warn"
        />
      </div>

      {/* Industry coverage */}
      <div className="mt-5 space-y-2">
        <div className="text-[11px] font-bold uppercase tracking-wider text-text-secondary">
          Industry coverage
        </div>
        <div className="flex flex-wrap gap-2">
          {(industries?.text ?? []).map((entry) => {
            const [name, count] = entry.split(':').map((s) => s.trim());
            return (
              <span
                key={entry}
                className={clsx(
                  'inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium',
                  INDUSTRY_COLORS[name] ?? 'bg-slate-100 text-slate-700',
                )}
              >
                {name} <span className="text-[10px] opacity-70">{count}</span>
              </span>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function KpiCell({
  label,
  value,
  footnote,
  tone,
}: {
  label: string;
  value: string;
  footnote: string;
  tone: 'neutral' | 'warn' | 'danger';
}) {
  const valueCls =
    tone === 'danger'
      ? 'text-red-600'
      : tone === 'warn'
        ? 'text-amber-600'
        : 'text-text-primary';
  return (
    <div>
      <div className="text-[11px] font-bold uppercase tracking-wider text-text-secondary">
        {label}
      </div>
      <div className={clsx('mt-0.5 text-2xl font-semibold', valueCls)}>{value}</div>
      <div className="mt-0.5 text-[11px] text-text-muted">{footnote}</div>
    </div>
  );
}
