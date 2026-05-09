import type { Shipment } from '@flowtrack/shared';
import { Calendar, Plane, Ship, Truck, Package } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatDateLong } from '../../lib/format';
import { StatusPill } from '../../components/ui/StatusPill';

function ModeIcon({ mode }: { mode: string }) {
  const cls = 'text-brand-navy/55';
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
      className="flex min-h-[56px] items-center justify-between gap-3 border border-brand-rule bg-brand-paper px-3 py-2.5 transition-colors hover:bg-brand-bone/50"
    >
      <div className="flex flex-col min-w-0">
        <span className="text-[14px] font-medium text-brand-navy">{s.ref}</span>
        <span className="mt-0.5 flex items-center gap-1.5 text-[12px] text-brand-navy/70">
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
    <section className="border border-brand-rule bg-brand-paper">
      <header className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 border-b border-brand-rule px-4 py-3">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <Calendar size={14} className="text-brand-navy/55" />
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
            Today's flow
          </h3>
          <span className="ft-micro text-brand-navy/55">
            · 19 Apr 2026 · arrivals + dispatches in next 48h
          </span>
        </div>
        <Link
          to="/app/shipments"
          className="ft-eyebrow text-brand-red hover:text-brand-redInk"
        >
          All shipments →
        </Link>
      </header>
      <div className="grid grid-cols-1 gap-0 divide-y divide-brand-rule md:grid-cols-2 md:divide-y-0 md:divide-x md:divide-brand-rule">
        <Column title="ARRIVING" count={flow.arriving.length} tone="navy">
          {flow.arriving.length === 0 ? (
            <Empty>No arrivals in the window.</Empty>
          ) : (
            flow.arriving.map((s) => <FlowItem key={s.id} s={s} />)
          )}
        </Column>
        <Column title="DISPATCHED" count={flow.dispatched.length} tone="red">
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
  tone,
  children,
}: {
  title: string;
  count: number;
  tone: 'navy' | 'red';
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2 px-4 py-3">
      <div className="ft-eyebrow flex items-center justify-between">
        <span className={tone === 'red' ? 'text-brand-red' : 'text-brand-navy'}>{title}</span>
        <span className="text-brand-navy/40">{count}</span>
      </div>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function Empty({ children }: { children: React.ReactNode }) {
  return (
    <div className="border border-dashed border-brand-rule px-3 py-4 text-center text-[13px] text-brand-navy/55">
      {children}
    </div>
  );
}
