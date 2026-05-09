import type { Shipment } from '@flowtrack/shared';
import { Calendar, Plane, Ship, Truck, Package } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatDateLong } from '../../lib/format';
import { StatusPill } from '../../components/ui/StatusPill';

function ModeIcon({ mode }: { mode: string }) {
  const cls = 'text-text-muted';
  if (mode === 'sea') return <Ship size={12} className={cls} />;
  if (mode === 'air') return <Plane size={12} className={cls} />;
  if (mode === 'road') return <Truck size={12} className={cls} />;
  return <Package size={12} className={cls} />;
}

function FlowItem({ s }: { s: Shipment }) {
  const route = `${s.origin_city} → ${s.dest_city}`;
  const dateIso = s.eta_agi ?? s.atd ?? null;
  return (
    <Link
      to={`/shipments/${s.ref}`}
      className="flex items-center justify-between gap-3 rounded-md border border-border-subtle bg-surface-card px-3 py-2 hover:bg-surface-canvas"
    >
      <div className="flex flex-col min-w-0">
        <span className="text-sm font-medium text-text-primary">{s.ref}</span>
        <span className="flex items-center gap-1 text-xs text-text-secondary">
          <ModeIcon mode={s.mode} />
          {route} · {formatDateLong(dateIso)}
        </span>
      </div>
      <StatusPill status={s.status} />
    </Link>
  );
}

export function TodaysFlow({
  flow,
}: {
  flow: { arriving: Shipment[]; dispatched: Shipment[] };
}) {
  return (
    <section className="rounded-lg border border-border-subtle bg-surface-card">
      <header className="flex items-center justify-between border-b border-border-subtle px-4 py-3">
        <div className="flex items-center gap-2">
          <Calendar size={14} className="text-text-secondary" />
          <h3 className="text-sm font-semibold text-text-primary">Today's flow</h3>
          <span className="text-xs text-text-secondary">
            · 19 Apr 2026 · arrivals + dispatches in next 48h
          </span>
        </div>
        <Link to="/app/shipments" className="text-xs font-medium text-blue-600 hover:underline">
          All shipments →
        </Link>
      </header>
      <div className="grid grid-cols-1 gap-0 md:grid-cols-2 md:divide-x md:divide-border-subtle">
        <Column title="ARRIVING" count={flow.arriving.length} accent="text-blue-600">
          {flow.arriving.length === 0 ? (
            <Empty>No arrivals in the window.</Empty>
          ) : (
            flow.arriving.map((s) => <FlowItem key={s.id} s={s} />)
          )}
        </Column>
        <Column title="DISPATCHED" count={flow.dispatched.length} accent="text-emerald-600">
          {flow.dispatched.length === 0 ? (
            <Empty>No dispatches in the window.</Empty>
          ) : (
            flow.dispatched.map((s) => <FlowItem key={s.id} s={s} />)
          )}
        </Column>
      </div>
    </section>
  );
}

function Column({
  title,
  count,
  accent,
  children,
}: {
  title: string;
  count: number;
  accent: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2 px-4 py-3">
      <div className="flex items-center justify-between text-[11px] font-bold tracking-wider">
        <span className={accent}>{title}</span>
        <span className="text-text-muted">{count}</span>
      </div>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function Empty({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-md border border-dashed border-border-subtle px-3 py-4 text-center text-xs text-text-muted">
      {children}
    </div>
  );
}
