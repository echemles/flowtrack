import { useMemo, useState } from 'react';
import {
  AlertTriangle,
  Clock,
  Search,
  Plus,
  ChevronDown,
  ChevronRight,
  AlertOctagon,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { PurchaseOrdersResponseSchema } from '@flowtrack/shared';
import { useApi } from '../lib/useApi';
import { DataState } from '../components/ui/DataState';
import { formatMoneyWhole } from '../lib/format';
import clsx from 'clsx';

const STATUS_FILTERS: { id: string; label: string }[] = [
  { id: 'all', label: 'All status' },
  { id: 'draft', label: 'Draft' },
  { id: 'issued', label: 'Issued' },
  { id: 'partial', label: 'Partial' },
  { id: 'approved', label: 'Approved' },
  { id: 'in_service', label: 'In service' },
  { id: 'at_risk', label: 'At risk' },
  { id: 'done', label: 'Done' },
  { id: 'closed', label: 'Billed' },
];

export function PurchaseOrdersPage() {
  const [status, setStatus] = useState('all');
  const [search, setSearch] = useState('');
  const state = useApi('/purchase-orders', PurchaseOrdersResponseSchema);

  return (
    <div className="mx-auto max-w-[1180px] space-y-4">
      <header className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-text-primary">Purchase Orders</h1>
          <p className="mt-0.5 text-xs text-text-secondary">
            Service POs to carriers, forwarders & 3PLs
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
        {(d) => {
          const filtered = useMemoFilter(d.pos, status, search);
          const max = Math.max(...d.topProviders.map((p) => p.committed_minor), 1);
          return (
            <>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <StatusTile
                  label="At-risk POs"
                  value={d.stats.at_risk}
                  tone="danger"
                  icon={<AlertTriangle size={14} />}
                />
                <StatusTile
                  label="In service"
                  value={d.stats.in_service}
                  tone="warn"
                  icon={<Clock size={14} />}
                />
              </div>

              <section className="rounded-lg border border-border-subtle bg-surface-card p-4">
                <div className="mb-1 text-sm font-semibold text-text-primary">
                  Top providers by committed spend
                </div>
                <p className="mb-3 text-xs text-text-secondary">
                  Aggregated across line items of all in-scope POs
                </p>
                <ul className="space-y-3">
                  {d.topProviders.map((p) => {
                    const pct = (p.committed_minor / max) * 100;
                    return (
                      <li key={p.provider} className="flex items-center gap-3">
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-blue-100 text-xs font-bold text-blue-700">
                          {p.provider
                            .split(/\s+/)
                            .filter(Boolean)
                            .slice(0, 2)
                            .map((w) => w[0])
                            .join('')
                            .toUpperCase()}
                        </span>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-sm font-medium text-text-primary">
                                {p.provider}
                              </div>
                              <div className="text-[11px] text-text-secondary">
                                ~3 lines across POs · Freight Forwarder
                              </div>
                            </div>
                            <div className="text-sm font-semibold tabular-nums text-text-primary">
                              {formatMoneyWhole(p.committed_minor, p.currency)}
                            </div>
                          </div>
                          <div className="mt-1 h-1 overflow-hidden rounded-full bg-surface-canvas">
                            <div className="h-full bg-text-primary" style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </section>

              <div className="rounded-lg border border-border-subtle bg-surface-card">
                <div className="flex items-center gap-2 border-b border-border-subtle px-4 py-2">
                  <div className="flex flex-1 items-center gap-2 rounded-md border border-border-subtle bg-surface-canvas px-3 py-1 text-sm">
                    <Search size={14} className="text-text-muted" />
                    <input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="w-full bg-transparent outline-none placeholder:text-text-muted"
                      placeholder="Search PO, shipment ref, provider…"
                    />
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2 border-b border-border-subtle px-4 py-2">
                  {STATUS_FILTERS.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setStatus(s.id)}
                      className={clsx(
                        'rounded-md px-2 py-1 text-xs',
                        status === s.id
                          ? 'bg-text-primary text-white'
                          : 'border border-border-subtle bg-surface-card text-text-secondary hover:bg-surface-canvas',
                      )}
                    >
                      {s.label}
                    </button>
                  ))}
                  <div className="ml-auto flex items-center gap-2">
                    <span className="text-xs text-text-muted">{filtered.length} of {d.pos.length}</span>
                    <button className="inline-flex items-center gap-1 rounded-md bg-blue-600 px-2 py-1 text-xs font-medium text-white hover:bg-blue-700">
                      <Plus size={12} /> Raise PO
                    </button>
                  </div>
                </div>

                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-border-subtle bg-surface-canvas text-[11px] font-bold uppercase tracking-wider text-text-muted">
                      <th className="px-3 py-2">PO Number</th>
                      <th className="px-3 py-2">Shipment</th>
                      <th className="px-3 py-2 text-right">Lines</th>
                      <th className="px-3 py-2 text-right">Committed</th>
                      <th className="px-3 py-2 text-right">Billed</th>
                      <th className="px-3 py-2 text-right">Variance</th>
                      <th className="px-3 py-2"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((po) => {
                      const variancePositive = po.variance_minor >= 0;
                      const variancePct =
                        po.committed_minor > 0
                          ? Math.round((po.variance_minor / po.committed_minor) * 1000) / 10
                          : 0;
                      return (
                        <tr key={po.id} className="border-b border-border-subtle last:border-b-0 hover:bg-surface-canvas/60">
                          <td className="px-3 py-3">
                            <div className="flex items-center gap-2">
                              {po.status === 'at_risk' ? (
                                <AlertOctagon size={14} className="text-red-500" />
                              ) : null}
                              <div>
                                <div className="font-medium text-text-primary">{po.number}</div>
                                <div className="text-[11px] text-text-muted">
                                  {po.provider ?? '—'}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-3 py-3 text-text-primary">
                            {po.shipment_ref ? (
                              <Link to={`/shipments/${po.shipment_ref}`} className="hover:underline">
                                {po.shipment_ref}
                              </Link>
                            ) : '—'}
                          </td>
                          <td className="px-3 py-3 text-right tabular-nums">{po.lines_count}</td>
                          <td className="px-3 py-3 text-right tabular-nums">
                            {formatMoneyWhole(po.committed_minor, po.currency)}
                          </td>
                          <td className="px-3 py-3 text-right tabular-nums">
                            {formatMoneyWhole(po.billed_minor, po.currency)}
                          </td>
                          <td className="px-3 py-3 text-right tabular-nums">
                            <span className={variancePositive ? 'text-emerald-700' : 'text-red-600'}>
                              {variancePositive ? '+' : ''}
                              {formatMoneyWhole(po.variance_minor, po.currency)}
                              <span className="ml-1 text-[10px] opacity-70">{variancePct}%</span>
                            </span>
                          </td>
                          <td className="px-3 py-3 text-right">
                            <ChevronRight size={14} className="text-text-muted" />
                          </td>
                        </tr>
                      );
                    })}
                    {filtered.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-3 py-6 text-center text-xs text-text-muted">
                          No POs match this filter.
                        </td>
                      </tr>
                    ) : null}
                  </tbody>
                </table>
              </div>
            </>
          );
        }}
      </DataState>
    </div>
  );
}

function useMemoFilter(rows: any[], status: string, search: string) {
  return useMemo(() => {
    let r = rows;
    if (status !== 'all') {
      r = r.filter((p) => p.status === status);
    }
    const q = search.trim().toLowerCase();
    if (q) {
      r = r.filter((p) =>
        [p.number, p.shipment_ref, p.provider]
          .filter(Boolean)
          .some((v) => String(v).toLowerCase().includes(q)),
      );
    }
    return r;
  }, [rows, status, search]);
}

function StatusTile({
  label,
  value,
  tone,
  icon,
}: {
  label: string;
  value: number;
  tone: 'danger' | 'warn';
  icon: JSX.Element;
}) {
  return (
    <div className="flex items-start justify-between rounded-lg border border-border-subtle bg-surface-card p-4">
      <div>
        <div className="text-[11px] font-bold uppercase tracking-wider text-text-secondary">{label}</div>
        <div
          className={clsx(
            'mt-1 text-2xl font-semibold',
            tone === 'danger' ? 'text-red-600' : 'text-amber-700',
          )}
        >
          {value}
        </div>
      </div>
      <div className={clsx('rounded-md p-2', tone === 'danger' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-700')}>
        {icon}
      </div>
    </div>
  );
}
