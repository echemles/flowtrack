import { Link } from 'react-router-dom';
import {
  ChevronDown,
  AlertTriangle,
  AlertOctagon,
  DollarSign,
  Stamp,
} from 'lucide-react';
import { BillingResponseSchema } from '@flowtrack/shared';
import { useApi } from '../lib/useApi';
import { DataState } from '../components/ui/DataState';
import { StatusPill } from '../components/ui/StatusPill';
import { formatMoney, formatMoneyWhole } from '../lib/format';
import clsx from 'clsx';

export function BillingPage() {
  const state = useApi('/billing', BillingResponseSchema);
  return (
    <div className="mx-auto max-w-[1180px] space-y-4">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1
            className="text-brand-navy"
            style={{
              fontFamily: 'Switzer, sans-serif',
              fontWeight: 400,
              fontSize: '28px',
              lineHeight: 1.1,
              letterSpacing: '-0.01em',
            }}
          >
            Billing Center
          </h1>
          <p className="ft-micro mt-2 text-brand-navy/55">Carrier invoices &amp; reconciliation</p>
        </div>
        <div className="-mx-1 flex items-center gap-2 overflow-x-auto px-1 sm:mx-0 sm:overflow-visible sm:px-0">
          <button className="ft-pill ft-pill-ghost ft-pill-sm shrink-0">
            All Entities <ChevronDown size={12} />
          </button>
          <button className="ft-pill ft-pill-ghost ft-pill-sm shrink-0">Public tracking</button>
        </div>
      </header>

      <DataState state={state}>
        {(d) => (
          <>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <Tile
                label="Outstanding (USD)"
                value={formatMoneyWhole(d.stats.outstanding_minor, d.stats.currency)}
                icon={<DollarSign size={14} />}
                tone="warn"
              />
              <Tile
                label="Disputed (USD)"
                value={formatMoneyWhole(d.stats.disputed_minor, d.stats.currency)}
                icon={<AlertTriangle size={14} />}
                tone="danger-soft"
              />
              <Tile
                label="Flagged Discrepancies"
                value={d.stats.flagged_count.toString()}
                icon={<AlertOctagon size={14} />}
                tone="danger"
              />
            </div>

            <div className="border border-brand-rule bg-brand-paper">
              <header className="flex flex-col gap-3 border-b border-brand-rule px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="ft-eyebrow text-brand-navy/55">Invoices</div>
                  <p className="mt-1 text-[13px] text-brand-navy/70">
                    {d.invoices.length} carrier invoices · expected vs. actual · USD rollup
                  </p>
                </div>
                <button className="ft-pill ft-pill-primary ft-pill-sm self-start sm:self-auto">
                  <Stamp size={12} /> Reconcile batch
                </button>
              </header>

              {/* Desktop table */}
              <div className="hidden md:block">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-brand-rule bg-brand-bone/40">
                      <th className="ft-eyebrow px-4 py-3 text-brand-navy/55">Shipment</th>
                      <th className="ft-eyebrow px-4 py-3 text-brand-navy/55">Carrier</th>
                      <th className="ft-eyebrow px-4 py-3 text-right text-brand-navy/55">Expected</th>
                      <th className="ft-eyebrow px-4 py-3 text-right text-brand-navy/55">Actual</th>
                      <th className="ft-eyebrow px-4 py-3 text-right text-brand-navy/55">Variance</th>
                      <th className="ft-eyebrow px-4 py-3 text-brand-navy/55">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {d.invoices.map((inv) => {
                      const variancePct =
                        inv.expected_minor > 0
                          ? Math.round((inv.variance_minor / inv.expected_minor) * 1000) / 10
                          : 0;
                      return (
                        <tr
                          key={inv.id}
                          className="border-b border-brand-rule last:border-b-0 hover:bg-brand-bone/40"
                        >
                          <td className="px-4 py-3">
                            {inv.shipment_ref ? (
                              <Link
                                to={`/shipments/${inv.shipment_ref}`}
                                className="font-medium text-brand-navy hover:text-brand-red"
                              >
                                {inv.shipment_ref}
                              </Link>
                            ) : '—'}
                            <div className="text-[11px] text-brand-navy/50">{inv.number}</div>
                          </td>
                          <td className="px-4 py-3 text-brand-navy">{inv.carrier ?? '—'}</td>
                          <td className="px-4 py-3 text-right tabular-nums">
                            {formatMoney(inv.expected_minor, inv.currency, { cents: false })}
                          </td>
                          <td className="px-4 py-3 text-right tabular-nums">
                            {formatMoney(inv.actual_minor, inv.currency, { cents: false })}
                          </td>
                          <td className="px-4 py-3 text-right tabular-nums">
                            {inv.variance_minor === 0 ? (
                              <span className="text-brand-navy/40">—</span>
                            ) : (
                              <span className={inv.variance_minor < 0 ? 'text-brand-navy' : 'text-brand-red'}>
                                {variancePct >= 0 ? '+' : ''}
                                {variancePct.toFixed(1)}%
                                <span className="ml-1 text-[10px] opacity-70">
                                  {inv.variance_minor >= 0 ? '+' : ''}
                                  {formatMoney(inv.variance_minor, inv.currency, { cents: false })}
                                </span>
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <StatusPill status={inv.status} />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <ul className="block md:hidden">
                {d.invoices.map((inv) => {
                  const variancePct =
                    inv.expected_minor > 0
                      ? Math.round((inv.variance_minor / inv.expected_minor) * 1000) / 10
                      : 0;
                  return (
                    <li
                      key={inv.id}
                      className="border-b border-brand-rule last:border-b-0 px-4 py-3"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          {inv.shipment_ref ? (
                            <Link
                              to={`/shipments/${inv.shipment_ref}`}
                              className="font-medium text-brand-navy"
                            >
                              {inv.shipment_ref}
                            </Link>
                          ) : (
                            <span className="font-medium text-brand-navy">{inv.number}</span>
                          )}
                          <div className="text-[11px] text-brand-navy/50">
                            {inv.number} · {inv.carrier ?? '—'}
                          </div>
                        </div>
                        <StatusPill status={inv.status} />
                      </div>
                      <dl className="mt-2 grid grid-cols-3 gap-x-2 text-[12px]">
                        <div>
                          <dt className="ft-micro text-brand-navy/55">Expected</dt>
                          <dd className="mt-0.5 tabular-nums text-brand-navy">
                            {formatMoney(inv.expected_minor, inv.currency, { cents: false })}
                          </dd>
                        </div>
                        <div>
                          <dt className="ft-micro text-brand-navy/55">Actual</dt>
                          <dd className="mt-0.5 tabular-nums text-brand-navy">
                            {formatMoney(inv.actual_minor, inv.currency, { cents: false })}
                          </dd>
                        </div>
                        <div>
                          <dt className="ft-micro text-brand-navy/55">Variance</dt>
                          <dd
                            className={clsx(
                              'mt-0.5 tabular-nums',
                              inv.variance_minor === 0
                                ? 'text-brand-navy/40'
                                : inv.variance_minor < 0
                                  ? 'text-brand-navy'
                                  : 'text-brand-red',
                            )}
                          >
                            {inv.variance_minor === 0
                              ? '—'
                              : `${variancePct >= 0 ? '+' : ''}${variancePct.toFixed(1)}%`}
                          </dd>
                        </div>
                      </dl>
                    </li>
                  );
                })}
              </ul>
            </div>
          </>
        )}
      </DataState>
    </div>
  );
}

function Tile({
  label,
  value,
  icon,
  tone,
}: {
  label: string;
  value: string;
  icon: JSX.Element;
  tone: 'warn' | 'danger' | 'danger-soft';
}) {
  return (
    <div className="flex items-start justify-between border border-brand-rule bg-brand-paper p-4">
      <div>
        <div className="ft-eyebrow text-brand-navy/55">{label}</div>
        <div
          className="mt-2 text-brand-navy"
          style={{
            fontFamily: 'Switzer, sans-serif',
            fontWeight: 300,
            fontSize: '28px',
            lineHeight: 1.04,
            letterSpacing: '-0.01em',
          }}
        >
          {value}
        </div>
      </div>
      <div
        className={clsx(
          'border p-2',
          tone === 'danger'
            ? 'border-brand-red/30 text-brand-red'
            : tone === 'danger-soft'
              ? 'border-brand-red/20 text-brand-red'
              : 'border-brand-rule text-brand-navy/70',
        )}
      >
        {icon}
      </div>
    </div>
  );
}
