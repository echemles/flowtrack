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
            Purchase Orders
          </h1>
          <p className="ft-micro mt-2 text-brand-navy/55">
            Service POs to carriers, forwarders &amp; 3PLs
          </p>
        </div>
        <div className="-mx-1 flex items-center gap-2 overflow-x-auto px-1 sm:mx-0 sm:overflow-visible sm:px-0">
          <button className="ft-pill ft-pill-ghost ft-pill-sm shrink-0">
            All Entities <ChevronDown size={12} />
          </button>
          <button className="ft-pill ft-pill-ghost ft-pill-sm shrink-0">Public tracking</button>
        </div>
      </header>

      <DataState state={state}>
        {(d) => {
          const filtered = useMemoFilter(d.pos, status, search);
          const max = Math.max(...d.topProviders.map((p) => p.committed_minor), 1);
          return (
            <>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
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

              <section className="border border-brand-rule bg-brand-paper p-4">
                <div className="ft-eyebrow text-brand-navy/55">Top providers by committed spend</div>
                <p className="mt-1 mb-3 text-[13px] text-brand-navy/70">
                  Aggregated across line items of all in-scope POs
                </p>
                <ul className="space-y-3">
                  {d.topProviders.map((p) => {
                    const pct = (p.committed_minor / max) * 100;
                    return (
                      <li key={p.provider} className="flex items-center gap-3">
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center border border-brand-rule bg-brand-bone text-[11px] font-bold text-brand-navy">
                          {p.provider
                            .split(/\s+/)
                            .filter(Boolean)
                            .slice(0, 2)
                            .map((w) => w[0])
                            .join('')
                            .toUpperCase()}
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
                            <div className="min-w-0">
                              <div className="truncate text-[14px] font-medium text-brand-navy">
                                {p.provider}
                              </div>
                              <div className="ft-micro text-brand-navy/55">
                                ~3 lines · Freight forwarder
                              </div>
                            </div>
                            <div className="text-[14px] font-semibold tabular-nums text-brand-navy">
                              {formatMoneyWhole(p.committed_minor, p.currency)}
                            </div>
                          </div>
                          <div className="mt-1.5 h-1 overflow-hidden bg-brand-bone">
                            <div className="h-full bg-brand-navy" style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </section>

              <div className="border border-brand-rule bg-brand-paper">
                <div className="flex items-center gap-2 border-b border-brand-rule px-3 py-2 sm:px-4">
                  <div className="flex flex-1 items-center gap-2 border border-brand-rule bg-brand-bone/40 px-3 py-1.5 text-[14px] text-brand-navy">
                    <Search size={14} className="text-brand-navy/50" />
                    <input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="w-full bg-transparent outline-none placeholder:text-brand-navy/40"
                      placeholder="Search PO, shipment ref, provider…"
                    />
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2 border-b border-brand-rule px-3 py-2 sm:px-4">
                  <div className="-mx-1 flex flex-1 items-center gap-2 overflow-x-auto px-1 sm:overflow-visible">
                    {STATUS_FILTERS.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => setStatus(s.id)}
                        className={clsx(
                          'inline-flex shrink-0 items-center px-2.5 py-1.5 text-[12px] transition-colors min-h-[32px]',
                          status === s.id
                            ? 'bg-brand-navy text-brand-paper'
                            : 'border border-brand-rule bg-brand-paper text-brand-navy/70 hover:bg-brand-bone/60',
                        )}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                  <div className="ml-auto flex items-center gap-2">
                    <span className="ft-micro text-brand-navy/55">
                      {filtered.length} of {d.pos.length}
                    </span>
                    <button className="ft-pill ft-pill-primary ft-pill-sm">
                      <Plus size={12} /> Raise PO
                    </button>
                  </div>
                </div>

                {/* Desktop table */}
                <div className="hidden md:block">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-brand-rule bg-brand-bone/40">
                        <th className="ft-eyebrow px-3 py-3 text-brand-navy/55">PO Number</th>
                        <th className="ft-eyebrow px-3 py-3 text-brand-navy/55">Shipment</th>
                        <th className="ft-eyebrow px-3 py-3 text-right text-brand-navy/55">Lines</th>
                        <th className="ft-eyebrow px-3 py-3 text-right text-brand-navy/55">Committed</th>
                        <th className="ft-eyebrow px-3 py-3 text-right text-brand-navy/55">Billed</th>
                        <th className="ft-eyebrow px-3 py-3 text-right text-brand-navy/55">Variance</th>
                        <th className="ft-eyebrow px-3 py-3 text-brand-navy/55"></th>
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
                          <tr
                            key={po.id}
                            className="border-b border-brand-rule last:border-b-0 hover:bg-brand-bone/40"
                          >
                            <td className="px-3 py-3">
                              <div className="flex items-center gap-2">
                                {po.status === 'at_risk' ? (
                                  <AlertOctagon size={14} className="text-brand-red" />
                                ) : null}
                                <div>
                                  <div className="font-medium text-brand-navy">{po.number}</div>
                                  <div className="text-[11px] text-brand-navy/50">{po.provider ?? '—'}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-3 py-3 text-brand-navy">
                              {po.shipment_ref ? (
                                <Link to={`/shipments/${po.shipment_ref}`} className="hover:text-brand-red">
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
                              <span className={variancePositive ? 'text-brand-navy' : 'text-brand-red'}>
                                {variancePositive ? '+' : ''}
                                {formatMoneyWhole(po.variance_minor, po.currency)}
                                <span className="ml-1 text-[10px] opacity-70">{variancePct}%</span>
                              </span>
                            </td>
                            <td className="px-3 py-3 text-right">
                              <ChevronRight size={14} className="text-brand-navy/40" />
                            </td>
                          </tr>
                        );
                      })}
                      {filtered.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="px-3 py-6 text-center text-[13px] text-brand-navy/55">
                            No POs match this filter.
                          </td>
                        </tr>
                      ) : null}
                    </tbody>
                  </table>
                </div>

                {/* Mobile card list */}
                <ul className="block md:hidden">
                  {filtered.length === 0 ? (
                    <li className="px-4 py-6 text-center text-[13px] text-brand-navy/55">
                      No POs match this filter.
                    </li>
                  ) : (
                    filtered.map((po) => {
                      const variancePositive = po.variance_minor >= 0;
                      return (
                        <li
                          key={po.id}
                          className="border-b border-brand-rule last:border-b-0 px-4 py-3"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                {po.status === 'at_risk' ? (
                                  <AlertOctagon size={14} className="text-brand-red" />
                                ) : null}
                                <span className="font-medium text-brand-navy">{po.number}</span>
                              </div>
                              <div className="mt-0.5 truncate text-[12px] text-brand-navy/55">
                                {po.provider ?? '—'}
                                {po.shipment_ref ? (
                                  <>
                                    <span className="mx-1">·</span>
                                    <Link to={`/shipments/${po.shipment_ref}`} className="text-brand-red">
                                      {po.shipment_ref}
                                    </Link>
                                  </>
                                ) : null}
                              </div>
                            </div>
                            <ChevronRight size={14} className="mt-1 shrink-0 text-brand-navy/40" />
                          </div>
                          <dl className="mt-2 grid grid-cols-3 gap-x-2 text-[12px]">
                            <div>
                              <dt className="ft-micro text-brand-navy/55">Lines</dt>
                              <dd className="mt-0.5 tabular-nums text-brand-navy">{po.lines_count}</dd>
                            </div>
                            <div>
                              <dt className="ft-micro text-brand-navy/55">Committed</dt>
                              <dd className="mt-0.5 tabular-nums text-brand-navy">
                                {formatMoneyWhole(po.committed_minor, po.currency)}
                              </dd>
                            </div>
                            <div>
                              <dt className="ft-micro text-brand-navy/55">Variance</dt>
                              <dd className={clsx('mt-0.5 tabular-nums', variancePositive ? 'text-brand-navy' : 'text-brand-red')}>
                                {variancePositive ? '+' : ''}
                                {formatMoneyWhole(po.variance_minor, po.currency)}
                              </dd>
                            </div>
                          </dl>
                        </li>
                      );
                    })
                  )}
                </ul>
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
    <div className="flex items-start justify-between border border-brand-rule bg-brand-paper p-4">
      <div>
        <div className="ft-eyebrow text-brand-navy/55">{label}</div>
        <div
          className={clsx(
            'mt-2 text-brand-navy',
            tone === 'danger' ? 'text-brand-red' : 'text-brand-navy',
          )}
          style={{
            fontFamily: 'Switzer, sans-serif',
            fontWeight: 300,
            fontSize: '32px',
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
          tone === 'danger' ? 'border-brand-red/30 text-brand-red' : 'border-brand-rule text-brand-navy/70',
        )}
      >
        {icon}
      </div>
    </div>
  );
}
