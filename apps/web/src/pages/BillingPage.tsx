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
      <header className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-text-primary">Billing Center</h1>
          <p className="mt-0.5 text-xs text-text-secondary">
            Carrier invoices & reconciliation
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="inline-flex items-center gap-1.5 rounded-md border border-border-subtle bg-surface-card px-3 py-1.5 text-xs text-text-secondary hover:bg-surface-canvas">
            All Entities <ChevronDown size={12} />
          </button>
          <button className="inline-flex items-center gap-1.5 rounded-md border border-border-subtle bg-surface-card px-3 py-1.5 text-xs text-text-secondary hover:bg-surface-canvas">
            Public tracking
          </button>
        </div>
      </header>

      <DataState state={state}>
        {(d) => (
          <>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
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

            <div className="rounded-lg border border-border-subtle bg-surface-card">
              <header className="flex items-center justify-between border-b border-border-subtle px-4 py-3">
                <div>
                  <h2 className="text-sm font-semibold text-text-primary">Invoices</h2>
                  <p className="text-xs text-text-secondary">
                    {d.invoices.length} carrier invoices · Expected vs. actual · Native currencies, rollups in USD
                  </p>
                </div>
                <button className="inline-flex items-center gap-1 rounded-md bg-text-primary px-2 py-1 text-xs font-medium text-white hover:bg-slate-800">
                  <Stamp size={12} /> Reconcile batch
                </button>
              </header>

              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-border-subtle bg-surface-canvas text-[11px] font-bold uppercase tracking-wider text-text-muted">
                    <th className="px-4 py-2">Shipment</th>
                    <th className="px-4 py-2">Carrier</th>
                    <th className="px-4 py-2 text-right">Expected</th>
                    <th className="px-4 py-2 text-right">Actual</th>
                    <th className="px-4 py-2 text-right">Variance</th>
                    <th className="px-4 py-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {d.invoices.map((inv) => {
                    const variancePct =
                      inv.expected_minor > 0
                        ? Math.round((inv.variance_minor / inv.expected_minor) * 1000) / 10
                        : 0;
                    return (
                      <tr key={inv.id} className="border-b border-border-subtle last:border-b-0 hover:bg-surface-canvas/60">
                        <td className="px-4 py-3">
                          {inv.shipment_ref ? (
                            <Link
                              to={`/shipments/${inv.shipment_ref}`}
                              className="font-medium text-text-primary hover:underline"
                            >
                              {inv.shipment_ref}
                            </Link>
                          ) : '—'}
                          <div className="text-[11px] text-text-muted">{inv.number}</div>
                        </td>
                        <td className="px-4 py-3 text-text-primary">{inv.carrier ?? '—'}</td>
                        <td className="px-4 py-3 text-right tabular-nums">
                          {formatMoney(inv.expected_minor, inv.currency, { cents: false })}
                        </td>
                        <td className="px-4 py-3 text-right tabular-nums">
                          {formatMoney(inv.actual_minor, inv.currency, { cents: false })}
                        </td>
                        <td className="px-4 py-3 text-right tabular-nums">
                          {inv.variance_minor === 0 ? (
                            <span className="text-text-muted">—</span>
                          ) : (
                            <span className={inv.variance_minor < 0 ? 'text-emerald-700' : 'text-red-600'}>
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
    <div className="flex items-start justify-between rounded-lg border border-border-subtle bg-surface-card p-4">
      <div>
        <div className="text-[11px] font-bold uppercase tracking-wider text-text-secondary">{label}</div>
        <div className="mt-1 text-2xl font-semibold text-text-primary">{value}</div>
      </div>
      <div
        className={clsx(
          'rounded-md p-2',
          tone === 'warn'
            ? 'bg-amber-50 text-amber-700'
            : tone === 'danger'
              ? 'bg-red-50 text-red-600'
              : 'bg-orange-50 text-orange-600',
        )}
      >
        {icon}
      </div>
    </div>
  );
}
