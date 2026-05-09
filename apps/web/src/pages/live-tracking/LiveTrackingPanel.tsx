import type { z } from 'zod';
import { LiveTrackingSchema } from '@flowtrack/shared';
import { ModeChip } from '../../components/ui/ModeChip';
import { StatusPill } from '../../components/ui/StatusPill';
import { formatDateLong } from '../../lib/format';
import clsx from 'clsx';
import { RouteMap, ModeBanner } from './RouteMap';

type Live = z.infer<typeof LiveTrackingSchema>;

export function LiveTrackingPanel({ data }: { data: Live }) {
  const { shipment: s, milestones, route, percent, daysRemaining } = data;

  return (
    <div className="space-y-4">
      <div className="border border-brand-rule bg-brand-paper p-3">
        <div className="flex flex-wrap items-center justify-between gap-2 px-1 py-1">
          <div className="flex flex-wrap items-center gap-2 text-[14px] font-medium text-brand-navy">
            <span>{s.ref}</span>
            <span className="text-brand-navy/55">
              {s.origin_city}, {s.origin_country}
            </span>
            <span className="text-brand-navy/40">→</span>
            <span className="text-brand-navy/55">
              {s.dest_city}, {s.dest_country}
            </span>
            <ModeChip mode={s.mode} />
            <StatusPill status={s.status} />
          </div>
          {daysRemaining != null ? (
            <span className="ft-micro text-brand-red">● {daysRemaining}d remaining</span>
          ) : null}
        </div>

        {/* Map */}
        <div className="mt-3">
          <RouteMap
            origin={route.origin}
            dest={route.dest}
            originLabel={s.origin_city}
            destLabel={s.dest_city}
            percent={percent}
            topLeft={<ModeBanner mode={s.mode} />}
            bottomRight={
              <>
                <div className="font-semibold">
                  {s.carrier} · {s.ref}
                </div>
                <div className="opacity-70">
                  {s.mode === 'sea'
                    ? 'Container vessel · FOB'
                    : s.mode === 'air'
                      ? 'Air freight · CIP'
                      : s.mode}
                </div>
              </>
            }
          />
        </div>

        {/* Progress strip */}
        <div className="mt-3 flex items-center gap-3 px-1">
          <span className="hidden text-[12px] text-brand-navy/65 sm:inline">{s.origin_city}</span>
          <div className="relative h-1 flex-1 bg-brand-bone">
            <div
              className="absolute inset-y-0 left-0 bg-brand-red"
              style={{ width: `${percent}%` }}
            />
          </div>
          <span className="hidden text-[12px] text-brand-navy/65 sm:inline">{s.dest_city}</span>
        </div>
        <div className="ft-micro mt-2 flex items-center justify-between px-1 text-brand-navy/55">
          <span>ATD {formatDateLong(s.atd)}</span>
          <span className={clsx(percent >= 90 ? 'text-brand-navy' : 'text-brand-red')}>
            {percent >= 100 ? 'Delivered' : `${percent}% complete`}
          </span>
          <span>ETA {formatDateLong(s.eta_agi)}</span>
        </div>
      </div>

      {/* Shipment Info */}
      <div className="border border-brand-rule bg-brand-paper p-4">
        <div className="ft-eyebrow mb-3 text-brand-navy/55">Shipment Info</div>
        <dl className="grid grid-cols-1 gap-x-6 text-[14px] sm:grid-cols-2">
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
          <KV
            k="Cargo Value"
            v={s.value_minor ? `$${(s.value_minor / 100).toLocaleString()}` : '—'}
          />
          <KV
            k="Origin / Destination"
            v={`${s.origin_city}, ${s.origin_country} → ${s.dest_city}, ${s.dest_country}`}
          />
        </dl>
        <a
          href={`/shipments/${s.ref}`}
          className="ft-pill ft-pill-primary ft-pill-sm mt-4 w-full"
        >
          Open full detail →
        </a>
      </div>

      {/* Milestones */}
      <div className="border border-brand-rule bg-brand-paper p-4">
        <div className="ft-eyebrow mb-3 text-brand-navy/55">Milestones</div>
        <ul className="space-y-3">
          {milestones.map((m) => (
            <li key={m.id} className="flex items-start gap-3">
              <span
                className={
                  m.status === 'done'
                    ? 'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center bg-brand-navy text-[10px] text-brand-paper'
                    : m.status === 'active'
                      ? 'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center bg-brand-red text-[10px] text-brand-paper'
                      : 'mt-0.5 h-5 w-5 shrink-0 border border-brand-rule bg-brand-bone/50'
                }
              >
                {m.status === 'done' ? '✓' : m.status === 'active' ? '●' : ''}
              </span>
              <div>
                <div
                  className={clsx(
                    'text-[14px]',
                    m.status === 'pending' ? 'text-brand-navy/45' : 'font-medium text-brand-navy',
                  )}
                >
                  {m.label}
                </div>
                <div className="text-[11px] text-brand-navy/55">
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
    <div className="col-span-1 flex items-center justify-between gap-3 border-b border-brand-rule py-2 last:border-0 sm:[&:nth-last-child(2)]:border-0">
      <dt className="ft-micro text-brand-navy/55">{k}</dt>
      <dd className="max-w-[60%] truncate text-right text-[13px] font-medium text-brand-navy">{v}</dd>
    </div>
  );
}
