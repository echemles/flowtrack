import type { Kpi } from '@flowtrack/shared';
import { Activity } from 'lucide-react';
import { formatMoneyCompactK, formatMoney } from '../../lib/format';
import clsx from 'clsx';

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
    <section className="border border-brand-rule bg-brand-paper p-4 sm:p-5">
      <header className="mb-5 flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
        <div className="flex items-center gap-2.5">
          <div className="border border-brand-rule p-1.5">
            <Activity size={14} className="text-brand-red" />
          </div>
          <div>
            <h3
              className="text-brand-navy"
              style={{
                fontFamily: 'Switzer, sans-serif',
                fontWeight: 400,
                fontSize: '18px',
                lineHeight: 1.2,
                letterSpacing: '-0.005em',
              }}
            >
              Pulse
            </h3>
            <p className="ft-micro mt-1 text-brand-navy/55">Financial · operational health</p>
          </div>
        </div>
        <button
          type="button"
          onClick={(e) => e.preventDefault()}
          className="ft-pill ft-pill-ghost ft-pill-sm min-h-[44px] sm:min-h-0"
        >
          ROI calc
        </button>
      </header>

      {/* On-time bar */}
      <div className="space-y-2">
        <div className="ft-eyebrow flex items-center justify-between text-brand-navy/55">
          <span>On-time delivery</span>
          <span
            className="text-brand-navy"
            style={{
              fontFamily: 'Switzer, sans-serif',
              fontWeight: 300,
              fontSize: '24px',
              letterSpacing: '-0.01em',
            }}
          >
            {onTime?.value_pct ?? 100}%
          </span>
        </div>
        <div className="h-1 overflow-hidden bg-brand-bone">
          <div
            className="h-full bg-brand-navy"
            style={{ width: `${onTime?.value_pct ?? 100}%` }}
          />
        </div>
        <p className="text-[12px] text-brand-navy/55">vs. 92% industry benchmark</p>
      </div>

      {/* KPI grid */}
      <div className="mt-6 grid grid-cols-1 gap-5 min-[480px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
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
          tone="danger"
        />
      </div>

      {/* Industry coverage */}
      <div className="mt-6 space-y-2.5">
        <div className="ft-eyebrow text-brand-navy/55">Industry coverage</div>
        <div className="flex flex-wrap gap-2">
          {(industries?.text ?? []).map((entry) => {
            const [name, count] = entry.split(':').map((s) => s.trim());
            return (
              <span
                key={entry}
                className="ft-micro inline-flex items-center gap-1.5 border border-brand-rule bg-brand-paper px-2 py-1 text-brand-navy"
              >
                {name} <span className="text-brand-navy/50">{count}</span>
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
  const valueCls = tone === 'danger' ? 'text-brand-red' : 'text-brand-navy';
  return (
    <div>
      <div className="ft-micro text-brand-navy/55">{label}</div>
      <div
        className={clsx('mt-2', valueCls)}
        style={{
          fontFamily: 'Switzer, sans-serif',
          fontWeight: 300,
          fontSize: '34px',
          lineHeight: 1.04,
          letterSpacing: '-0.01em',
        }}
      >
        {value}
      </div>
      <div className="mt-1.5 text-[12px] text-brand-navy/55">{footnote}</div>
    </div>
  );
}
