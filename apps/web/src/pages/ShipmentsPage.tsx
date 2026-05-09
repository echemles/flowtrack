import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  ChevronDown,
  Plus,
  Search,
  SlidersHorizontal,
  Plane,
  Ship,
  Truck,
  Package,
} from 'lucide-react';
import { ShipmentListSchema, type Shipment } from '@flowtrack/shared';
import { useApi } from '../lib/useApi';
import { DataState } from '../components/ui/DataState';
import { ModeChip } from '../components/ui/ModeChip';
import { StatusPill } from '../components/ui/StatusPill';
import { TabStrip, type Tab } from '../components/ui/TabStrip';
import { useAddShipments } from '../components/AddShipmentsContext';
import { ShipmentQuickViewModal } from './shipments/ShipmentQuickViewModal';

type TabId = 'all' | 'arriving' | 'dispatched' | 'needs_action' | 'overdue';

function ModeIcon({ mode }: { mode: string }) {
  const cls = 'text-brand-navy/50';
  if (mode === 'sea') return <Ship size={12} className={cls} />;
  if (mode === 'air') return <Plane size={12} className={cls} />;
  if (mode === 'road') return <Truck size={12} className={cls} />;
  return <Package size={12} className={cls} />;
}

export function ShipmentsPage() {
  const [params, setParams] = useSearchParams();
  const tabId = (params.get('tab') as TabId) || 'all';
  const [search, setSearch] = useState('');
  const { open: openAddShipments } = useAddShipments();

  // Modal state mirrors `?ref=` so direct links share + browser back closes.
  const selectedRef = params.get('ref');

  const setSelectedRef = (ref: string | null) => {
    const next = new URLSearchParams(params);
    if (ref) next.set('ref', ref);
    else next.delete('ref');
    setParams(next, { replace: false });
  };

  // Re-sync when ?ref= is mutated externally (browser back, paste-link).
  useEffect(() => {
    // no-op: selectedRef already derives from URL
  }, [selectedRef]);

  const path = `/shipments?tab=${tabId === 'all' ? 'all' : tabId}`;
  const state = useApi(path, ShipmentListSchema);
  const all = useApi('/shipments?tab=all', ShipmentListSchema);

  const counts = useMemo(() => {
    const a = all.data ?? [];
    return {
      all: a.length,
      arriving: a.filter((s) => s.status === 'arriving').length,
      dispatched: a.filter((s) => s.status === 'dispatched').length,
      needs_action: a.filter((s) => s.has_incident || s.status === 'overdue').length,
      overdue: a.filter((s) => s.status === 'overdue').length,
    };
  }, [all.data]);

  const tabs: Tab[] = [
    { id: 'all', label: 'All shipments', count: counts.all },
    { id: 'arriving', label: 'Arriving soon', count: counts.arriving },
    { id: 'dispatched', label: 'Just dispatched', count: counts.dispatched },
    { id: 'needs_action', label: 'Needs action', count: counts.needs_action },
    { id: 'overdue', label: 'Overdue', count: counts.overdue },
  ];

  const filtered = useMemo(() => {
    const rows = state.data ?? [];
    const q = search.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((s) =>
      [s.ref, s.origin_city, s.dest_city, s.carrier, s.client]
        .filter(Boolean)
        .some((v) => v!.toLowerCase().includes(q)),
    );
  }, [state.data, search]);

  return (
    <div className="mx-auto w-full min-w-0 max-w-[1180px] space-y-4">
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
            Shipments
          </h1>
          <p className="ft-micro mt-2 text-brand-navy/55">{counts.all} total · all routes</p>
        </div>
        <div className="-mx-1 flex items-center gap-2 overflow-x-auto px-1 sm:mx-0 sm:overflow-visible sm:px-0">
          <button
            type="button"
            onClick={(e) => e.preventDefault()}
            className="ft-pill ft-pill-ghost ft-pill-sm shrink-0 min-h-[44px] sm:min-h-0"
          >
            All Entities <ChevronDown size={12} />
          </button>
          <button
            type="button"
            onClick={openAddShipments}
            className="ft-pill ft-pill-primary ft-pill-sm shrink-0 min-h-[44px] sm:min-h-0"
          >
            <Plus size={12} /> Add shipments
          </button>
          <button
            type="button"
            onClick={(e) => e.preventDefault()}
            className="ft-pill ft-pill-ghost ft-pill-sm shrink-0 min-h-[44px] sm:min-h-0"
          >
            Public tracking
          </button>
        </div>
      </header>

      <div className="border border-brand-rule bg-brand-paper">
        <div className="overflow-x-auto px-3">
          <TabStrip
            tabs={tabs}
            activeId={tabId}
            onChange={(id) => {
              const next = new URLSearchParams(params);
              if (id === 'all') next.delete('tab');
              else next.set('tab', id);
              setParams(next, { replace: true });
            }}
          />
        </div>

        <div className="flex flex-col gap-3 border-b border-brand-rule px-3 py-3 sm:flex-row sm:items-center sm:px-4">
          <div className="flex flex-1 items-center gap-2 border border-brand-rule bg-brand-bone/40 px-3 py-2 text-[14px] text-brand-navy">
            <Search size={14} className="text-brand-navy/50" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent outline-none placeholder:text-brand-navy/35"
              placeholder="Search ref, client, origin…"
            />
          </div>
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={(e) => e.preventDefault()}
              className="ft-pill ft-pill-ghost ft-pill-sm shrink-0 min-h-[44px] sm:min-h-0"
            >
              <SlidersHorizontal size={12} /> More filters
            </button>
            <div className="ft-micro text-brand-navy/55">
              {filtered.length} of {counts.all}
            </div>
          </div>
        </div>

        <DataState<Shipment[]> state={state}>
          {() => (
            <>
              {/* Desktop table */}
              <div className="hidden lg:block">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-brand-rule">
                      <th className="ft-eyebrow w-8 px-4 py-3 text-brand-navy/55">
                        <input type="checkbox" className="accent-brand-red" disabled />
                      </th>
                      <th className="ft-eyebrow px-2 py-3 text-brand-navy/55">Ref</th>
                      <th className="ft-eyebrow px-2 py-3 text-brand-navy/55">Route</th>
                      <th className="ft-eyebrow px-2 py-3 text-brand-navy/55">Mode</th>
                      <th className="ft-eyebrow px-2 py-3 text-brand-navy/55">Carrier</th>
                      <th className="ft-eyebrow px-2 py-3 text-brand-navy/55">Client</th>
                      <th className="ft-eyebrow px-2 py-3 text-brand-navy/55">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((s) => (
                      <tr
                        key={s.id}
                        role="button"
                        tabIndex={0}
                        aria-haspopup="dialog"
                        onClick={(e) => {
                          // ignore clicks on the checkbox cell
                          const target = e.target as HTMLElement;
                          if (target.closest('input,button,a')) return;
                          setSelectedRef(s.ref);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            setSelectedRef(s.ref);
                          }
                        }}
                        className="cursor-pointer border-b border-brand-rule last:border-b-0 hover:bg-brand-bone/40 focus:bg-brand-bone/60 focus:outline-none"
                      >
                        <td className="px-4 py-3">
                          <input
                            type="checkbox"
                            className="accent-brand-red"
                            onClick={(e) => e.stopPropagation()}
                          />
                        </td>
                        <td className="px-2 py-3 text-[14px] font-medium text-brand-navy">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedRef(s.ref);
                            }}
                            className="text-left hover:text-brand-red"
                            aria-haspopup="dialog"
                          >
                            {s.ref}
                          </button>
                        </td>
                        <td className="px-2 py-3 text-[14px] text-brand-navy">
                          <span>{s.origin_city}</span>
                          <span className="mx-1 text-brand-navy/40">→</span>
                          <span>{s.dest_city}</span>
                        </td>
                        <td className="px-2 py-3">
                          <span className="inline-flex items-center gap-1.5">
                            <ModeIcon mode={s.mode} />
                            <ModeChip mode={s.mode} />
                          </span>
                        </td>
                        <td className="px-2 py-3 text-[14px] text-brand-navy">
                          {s.carrier ?? '—'}
                        </td>
                        <td className="px-2 py-3 text-[14px] text-brand-navy">
                          {s.client ?? '—'}
                        </td>
                        <td className="px-2 py-3">
                          <StatusPill status={s.status} />
                        </td>
                      </tr>
                    ))}
                    {filtered.length === 0 ? (
                      <tr>
                        <td
                          colSpan={7}
                          className="px-4 py-8 text-center text-[13px] text-brand-navy/55"
                        >
                          No shipments match this filter.
                        </td>
                      </tr>
                    ) : null}
                  </tbody>
                </table>
              </div>

              {/* Mobile/tablet card list */}
              <ul className="block lg:hidden">
                {filtered.length === 0 ? (
                  <li className="px-4 py-8 text-center text-[13px] text-brand-navy/55">
                    No shipments match this filter.
                  </li>
                ) : (
                  filtered.map((s) => (
                    <li key={s.id} className="border-b border-brand-rule last:border-b-0">
                      <button
                        type="button"
                        onClick={() => setSelectedRef(s.ref)}
                        aria-haspopup="dialog"
                        className="flex min-h-[80px] w-full min-w-0 items-start justify-between gap-3 px-4 py-3 text-left active:bg-brand-bone/60"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="ft-eyebrow flex items-center gap-1.5 text-brand-navy/55">
                            <ModeIcon mode={s.mode} />
                            <span className="truncate">
                              {s.origin_city} <span className="text-brand-navy/40">→</span>{' '}
                              {s.dest_city}
                            </span>
                          </div>
                          <div className="mt-1 flex flex-wrap items-center gap-2">
                            <span
                              className="text-brand-navy"
                              style={{
                                fontFamily: 'Switzer, sans-serif',
                                fontWeight: 500,
                                fontSize: '18px',
                                lineHeight: 1.15,
                                letterSpacing: '-0.01em',
                              }}
                            >
                              {s.ref}
                            </span>
                            <ModeChip mode={s.mode} />
                          </div>
                          <div className="ft-eyebrow mt-1 truncate text-brand-navy/55">
                            {s.carrier ?? '—'}
                            {s.client ? ` · ${s.client}` : ''}
                          </div>
                        </div>
                        <div className="shrink-0">
                          <StatusPill status={s.status} />
                        </div>
                      </button>
                    </li>
                  ))
                )}
              </ul>
            </>
          )}
        </DataState>
      </div>

      <ShipmentQuickViewModal refId={selectedRef} onClose={() => setSelectedRef(null)} />
    </div>
  );
}
