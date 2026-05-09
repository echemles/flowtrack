import type { z } from 'zod';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import { geoEquirectangular } from 'd3-geo';
import { LiveTrackingSchema } from '@flowtrack/shared';
import { ModeChip } from '../../components/ui/ModeChip';
import { StatusPill } from '../../components/ui/StatusPill';
import { formatDateLong } from '../../lib/format';
import clsx from 'clsx';

type Live = z.infer<typeof LiveTrackingSchema>;

const W = 900;
const H = 360;

function projectionFor(a: [number, number], b: [number, number]) {
  // Center between the two points so the route always sits comfortably.
  const cx = (a[0] + b[0]) / 2;
  const cy = (a[1] + b[1]) / 2;
  // Choose scale so that the great-circle distance fits the map width.
  const dist = Math.max(
    Math.hypot(a[0] - b[0], a[1] - b[1]),
    20,
  );
  const scale = Math.min(380, 5500 / dist);
  return geoEquirectangular()
    .scale(scale)
    .center([cx, cy])
    .translate([W / 2, H / 2]);
}

function ModeBanner({ mode }: { mode: string }) {
  const label =
    mode === 'sea'
      ? 'SEA FREIGHT · LIVE'
      : mode === 'air'
        ? 'AIR FREIGHT · LIVE'
        : mode === 'road'
          ? 'ROAD FREIGHT · LIVE'
          : 'IN TRANSIT · LIVE';
  return (
    <span className="inline-flex items-center rounded-md bg-blue-500/30 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-blue-100 ring-1 ring-blue-400/40">
      {label}
    </span>
  );
}

export function LiveTrackingPanel({ data }: { data: Live }) {
  const { shipment: s, milestones, route, percent, daysRemaining } = data;
  const proj = projectionFor(route.origin, route.dest);
  const ax = proj(route.origin) ?? [0, 0];
  const bx = proj(route.dest) ?? [0, 0];
  // current position interpolated along the line.
  const t = percent / 100;
  const cur: [number, number] = [
    ax[0] + (bx[0] - ax[0]) * t,
    ay(ax, bx, t),
  ];
  function ay(a: number[], b: number[], tv: number) {
    const my = a[1] + (b[1] - a[1]) * tv - Math.hypot(b[0] - a[0], b[1] - a[1]) * 0.18 * Math.sin(Math.PI * tv);
    return my;
  }
  // curved control point for arc
  const mx = (ax[0] + bx[0]) / 2;
  const my = (ax[1] + bx[1]) / 2 - Math.hypot(bx[0] - ax[0], bx[1] - ax[1]) * 0.25;
  const arcD = `M ${ax[0]},${ax[1]} Q ${mx},${my} ${bx[0]},${bx[1]}`;

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-border-subtle bg-surface-card p-3">
        <div className="flex items-center justify-between gap-2 px-1 py-1">
          <div className="flex items-center gap-2 text-sm font-medium text-text-primary">
            <span>{s.ref}</span>
            <span className="text-text-muted">{s.origin_city}, {s.origin_country}</span>
            <span className="text-text-muted">→</span>
            <span className="text-text-muted">{s.dest_city}, {s.dest_country}</span>
            <ModeChip mode={s.mode} />
            <StatusPill status={s.status} />
          </div>
          {daysRemaining != null ? (
            <span className="text-xs text-blue-700 font-medium">
              ● {daysRemaining}d remaining
            </span>
          ) : null}
        </div>

        {/* Map */}
        <div className="relative mt-3 overflow-hidden rounded-md bg-[#0B1220]">
          <div className="absolute left-3 top-3 z-10">
            <ModeBanner mode={s.mode} />
          </div>
          <ComposableMap width={W} height={H} projection={proj as any} style={{ width: '100%', height: 'auto' }}>
            <Geographies geography="/world-110m.json">
              {({ geographies }) =>
                geographies.map((geo) => (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill="#0F1A2E"
                    stroke="#1E2A44"
                    strokeWidth={0.4}
                    style={{
                      default: { outline: 'none' },
                      hover: { outline: 'none' },
                      pressed: { outline: 'none' },
                    }}
                  />
                ))
              }
            </Geographies>
            {/* Lane (full) */}
            <path d={arcD} fill="none" stroke="#1e3a8a" strokeWidth={2} strokeOpacity={0.45} />
            {/* Lane (progress) */}
            <path
              d={arcD}
              fill="none"
              stroke="#60a5fa"
              strokeWidth={2.5}
              strokeOpacity={0.9}
              pathLength={1}
              style={{ strokeDasharray: '1', strokeDashoffset: 1 - t }}
            />
            <circle cx={ax[0]} cy={ax[1]} r={4} fill="#7dd3fc" />
            <text x={ax[0]} y={ax[1] - 8} fontSize="10" fill="#bfdbfe" textAnchor="middle">
              {s.origin_city}
            </text>
            <circle cx={bx[0]} cy={bx[1]} r={4} fill="#7dd3fc" />
            <text x={bx[0]} y={bx[1] - 8} fontSize="10" fill="#bfdbfe" textAnchor="middle">
              {s.dest_city}
            </text>
            <circle cx={cur[0]} cy={cur[1]} r={6} fill="#3b82f6" stroke="#bfdbfe" strokeWidth={1.5} />
          </ComposableMap>
          <div className="pointer-events-none absolute bottom-3 right-3 text-right text-[11px] text-blue-100/80">
            <div className="font-semibold">{s.carrier} · {s.ref}</div>
            <div className="opacity-70">
              {s.mode === 'sea'
                ? 'Container vessel · FOB'
                : s.mode === 'air'
                  ? 'Air freight · CIP'
                  : s.mode}
            </div>
          </div>
        </div>

        {/* Progress strip */}
        <div className="mt-3 flex items-center gap-3 px-1">
          <span className="text-xs text-text-secondary">{s.origin_city}</span>
          <div className="relative flex-1 h-1.5 rounded-full bg-surface-canvas">
            <div className="absolute inset-y-0 left-0 rounded-full bg-blue-500" style={{ width: `${percent}%` }} />
          </div>
          <span className="text-xs text-text-secondary">{s.dest_city}</span>
        </div>
        <div className="mt-1 flex items-center justify-between text-[11px] text-text-muted px-1">
          <span>ATD {formatDateLong(s.atd)}</span>
          <span className={clsx('font-medium', percent >= 90 ? 'text-emerald-700' : 'text-blue-600')}>
            {percent >= 100 ? 'Delivered' : `${percent}% complete`}
          </span>
          <span>ETA {formatDateLong(s.eta_agi)}</span>
        </div>
      </div>

      {/* Shipment Info */}
      <div className="rounded-lg border border-border-subtle bg-surface-card p-4">
        <div className="text-[11px] font-bold uppercase tracking-wider text-text-secondary mb-2">
          Shipment Info
        </div>
        <dl className="grid grid-cols-1 gap-x-6 text-sm md:grid-cols-2">
          <KV k="Carrier" v={s.carrier ?? '—'} />
          <KV k="Client" v={s.client ?? '—'} />
          <KV k="Incoterm" v={s.mode === 'air' ? 'CIP' : 'FOB'} />
          <KV
            k="Mode"
            v={
              s.mode === 'sea'
                ? 'Sea Freight'
                : s.mode === 'air'
                  ? 'Air Freight'
                  : s.mode === 'road'
                    ? 'Road Freight'
                    : s.mode
            }
          />
          <KV k="Cargo Value" v={s.value_minor ? `$${(s.value_minor / 100).toLocaleString()}` : '—'} />
          <KV k="Origin / Destination" v={`${s.origin_city}, ${s.origin_country} → ${s.dest_city}, ${s.dest_country}`} />
        </dl>
        <a
          href={`/shipments/${s.ref}`}
          className="mt-3 flex items-center justify-center gap-2 rounded-md bg-text-primary px-3 py-2 text-xs font-medium text-white hover:bg-slate-800"
        >
          Open full detail →
        </a>
      </div>

      {/* Milestones */}
      <div className="rounded-lg border border-border-subtle bg-surface-card p-4">
        <div className="text-[11px] font-bold uppercase tracking-wider text-text-secondary mb-3">
          Milestones
        </div>
        <ul className="space-y-2.5">
          {milestones.map((m) => (
            <li key={m.id} className="flex items-start gap-3">
              <span
                className={
                  m.status === 'done'
                    ? 'mt-0.5 h-4 w-4 shrink-0 rounded-full bg-text-primary text-white text-[10px] flex items-center justify-center'
                    : m.status === 'active'
                      ? 'mt-0.5 h-4 w-4 shrink-0 rounded-full bg-blue-600 text-white text-[10px] flex items-center justify-center'
                      : 'mt-0.5 h-4 w-4 shrink-0 rounded-full border border-border-subtle bg-surface-canvas'
                }
              >
                {m.status === 'done' ? '✓' : m.status === 'active' ? '●' : ''}
              </span>
              <div>
                <div
                  className={clsx(
                    'text-sm',
                    m.status === 'pending' ? 'text-text-muted' : 'font-medium text-text-primary',
                  )}
                >
                  {m.label}
                </div>
                <div className="text-[11px] text-text-muted">
                  {m.at ? `${s.origin_city}, ${s.origin_country} · ${formatDateLong(m.at)}` : ''}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function KV({ k, v }: { k: string; v: string }) {
  return (
    <div className="col-span-1 flex items-center justify-between gap-3 border-b border-border-subtle py-2 last:border-0 sm:[&:nth-last-child(2)]:border-0">
      <dt className="text-text-secondary text-xs">{k}</dt>
      <dd className="font-medium text-text-primary text-right text-sm truncate max-w-[60%]">{v}</dd>
    </div>
  );
}
