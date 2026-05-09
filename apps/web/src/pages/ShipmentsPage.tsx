import { useMemo, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
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

type TabId = 'all' | 'arriving' | 'dispatched' | 'needs_action' | 'overdue';

function ModeIcon({ mode }: { mode: string }) {
  const cls = 'text-text-muted';
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
    <div className="mx-auto max-w-[1180px] space-y-4">
      <header className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-text-primary">Shipments</h1>
          <p className="mt-0.5 text-xs text-text-secondary">
            {counts.all} total · all routes
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="inline-flex items-center gap-1.5 rounded-md border border-border-subtle bg-surface-card px-3 py-1.5 text-xs text-text-secondary hover:bg-surface-canvas">
            All Entities <ChevronDown size={12} />
          </button>
          <button
            type="button"
            onClick={openAddShipments}
            className="inline-flex items-center gap-1.5 rounded-md bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700"
          >
            <Plus size={12} /> Add shipments
          </button>
          <button className="inline-flex items-center gap-1.5 rounded-md border border-border-subtle bg-surface-card px-3 py-1.5 text-xs text-text-secondary hover:bg-surface-canvas">
            Public tracking
          </button>
        </div>
      </header>

      <div className="rounded-lg border border-border-subtle bg-surface-card">
        <div className="px-3">
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

        <div className="flex items-center justify-between gap-3 border-b border-border-subtle px-4 py-2.5">
          <div className="flex flex-1 items-center gap-2 rounded-md border border-border-subtle bg-surface-canvas px-3 py-1.5 text-sm text-text-secondary">
            <Search size={14} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent outline-none"
              placeholder="Search ref, client, origin…"
            />
          </div>
          <button className="inline-flex items-center gap-1.5 rounded-md border border-border-subtle bg-surface-card px-3 py-1.5 text-xs text-text-secondary hover:bg-surface-canvas">
            <SlidersHorizontal size={12} /> More filters
          </button>
          <div className="text-xs text-text-muted">
            {filtered.length} of {counts.all}
          </div>
        </div>

        <DataState<Shipment[]> state={state}>
          {() => (
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border-subtle bg-surface-canvas text-[11px] font-bold uppercase tracking-wider text-text-muted">
                  <th className="px-4 py-2 w-8">
                    <input type="checkbox" className="accent-blue-600" disabled />
                  </th>
                  <th className="px-2 py-2">Ref</th>
                  <th className="px-2 py-2">Route</th>
                  <th className="px-2 py-2">Mode</th>
                  <th className="px-2 py-2">Carrier</th>
                  <th className="px-2 py-2">Client</th>
                  <th className="px-2 py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((s) => (
                  <tr
                    key={s.id}
                    className="border-b border-border-subtle last:border-b-0 hover:bg-surface-canvas/60"
                  >
                    <td className="px-4 py-3">
                      <input type="checkbox" className="accent-blue-600" />
                    </td>
                    <td className="px-2 py-3 font-medium text-text-primary">
                      <Link to={`/shipments/${s.ref}`} className="hover:underline">
                        {s.ref}
                      </Link>
                    </td>
                    <td className="px-2 py-3 text-text-primary">
                      <span className="text-text-primary">{s.origin_city}</span>
                      <span className="mx-1 text-text-muted">→</span>
                      <span className="text-text-primary">{s.dest_city}</span>
                    </td>
                    <td className="px-2 py-3">
                      <span className="inline-flex items-center gap-1">
                        <ModeIcon mode={s.mode} />
                        <ModeChip mode={s.mode} />
                      </span>
                    </td>
                    <td className="px-2 py-3 text-text-primary">{s.carrier ?? '—'}</td>
                    <td className="px-2 py-3 text-text-primary">{s.client ?? '—'}</td>
                    <td className="px-2 py-3">
                      <StatusPill status={s.status} />
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-sm text-text-muted">
                      No shipments match this filter.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          )}
        </DataState>
      </div>
    </div>
  );
}
