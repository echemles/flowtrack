import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';
import {
  ShipmentDetailSchema,
  LiveTrackingSchema,
  type ShipmentDetail,
} from '@flowtrack/shared';
import type { z } from 'zod';
import clsx from 'clsx';
import { api } from '../../lib/apiClient';
import { ModeChip } from '../../components/ui/ModeChip';
import { StatusPill } from '../../components/ui/StatusPill';
import { formatDateLong } from '../../lib/format';
import { RouteMap, ModeBanner } from '../live-tracking/RouteMap';

type Live = z.infer<typeof LiveTrackingSchema>;

type Props = {
  /** Ref of the shipment to show. `null` means closed. */
  refId: string | null;
  onClose: () => void;
};

type LoadState =
  | { kind: 'idle' }
  | { kind: 'loading' }
  | { kind: 'error'; message: string }
  | { kind: 'ready'; detail: ShipmentDetail; live: Live };

function usePrefersReducedMotion(): boolean {
  const [pref, setPref] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
  });
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = () => setPref(mq.matches);
    mq.addEventListener?.('change', onChange);
    return () => mq.removeEventListener?.('change', onChange);
  }, []);
  return pref;
}

export function ShipmentQuickViewModal({ refId, onClose }: Props) {
  const [state, setState] = useState<LoadState>({ kind: 'idle' });
  const reducedMotion = usePrefersReducedMotion();
  const [entered, setEntered] = useState(false);

  const isOpen = refId != null;

  // Fetch on open
  useEffect(() => {
    if (!isOpen) {
      setState({ kind: 'idle' });
      return;
    }
    let alive = true;
    setState({ kind: 'loading' });
    Promise.all([
      api.get(`/shipments/${refId}`, ShipmentDetailSchema),
      api.get(`/live-tracking/${refId}`, LiveTrackingSchema),
    ])
      .then(([detail, live]) => {
        if (alive) setState({ kind: 'ready', detail, live });
      })
      .catch((err: unknown) => {
        if (alive)
          setState({
            kind: 'error',
            message: err instanceof Error ? err.message : 'Failed to load shipment',
          });
      });
    return () => {
      alive = false;
    };
  }, [refId, isOpen]);

  // Lock body scroll while open
  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  // ESC closes
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  // Trigger enter transition
  useEffect(() => {
    if (!isOpen) {
      setEntered(false);
      return;
    }
    if (reducedMotion) {
      setEntered(true);
      return;
    }
    const id = requestAnimationFrame(() => setEntered(true));
    return () => cancelAnimationFrame(id);
  }, [isOpen, reducedMotion]);

  if (!isOpen) return null;

  const transitionStyle = reducedMotion
    ? undefined
    : {
        transition: 'opacity 180ms ease-out, transform 180ms ease-out',
        opacity: entered ? 1 : 0,
        transform: entered ? 'scale(1)' : 'scale(0.98)',
      };
  // Backdrop is always fully visible — no fade — so the dialog is unambiguously
  // modal even before the inner card transition completes.
  const backdropStyle = undefined;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-brand-ink/80 p-3 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="ship-quickview-title"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      style={backdropStyle}
    >
      <div
        className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden border border-brand-rule bg-brand-paper"
        style={transitionStyle}
        onMouseDown={(e) => e.stopPropagation()}
      >
        {state.kind === 'loading' || state.kind === 'idle' ? (
          <Header
            onClose={onClose}
            title={refId ?? ''}
            chips={null}
            sub={<span className="text-brand-navy/55">Loading…</span>}
          />
        ) : state.kind === 'error' ? (
          <>
            <Header
              onClose={onClose}
              title={refId ?? ''}
              chips={null}
              sub={<span className="text-brand-red">Error</span>}
            />
            <div className="px-5 py-6 text-[13px] text-brand-red">{state.message}</div>
          </>
        ) : (
          <ReadyBody data={state} onClose={onClose} />
        )}

        {state.kind === 'loading' || state.kind === 'idle' ? (
          <div className="flex-1 px-5 py-12 text-center ft-micro text-brand-navy/55">
            Loading shipment details…
          </div>
        ) : null}
      </div>
    </div>
  );
}

function Header({
  onClose,
  title,
  chips,
  sub,
}: {
  onClose: () => void;
  title: string;
  chips: React.ReactNode;
  sub: React.ReactNode;
}) {
  return (
    <header className="flex items-start justify-between gap-3 border-b border-brand-rule px-4 py-3 sm:px-5 sm:py-4">
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          {chips}
          <span
            id="ship-quickview-title"
            className="text-brand-navy"
            style={{
              fontFamily: 'Switzer, sans-serif',
              fontWeight: 400,
              fontSize: '24px',
              lineHeight: 1.1,
              letterSpacing: '-0.01em',
            }}
          >
            {title}
          </span>
        </div>
        <div className="mt-2 ft-micro text-brand-navy/65">{sub}</div>
      </div>
      <button
        type="button"
        onClick={onClose}
        className="p-1 text-brand-navy/45 hover:bg-brand-bone hover:text-brand-navy"
        aria-label="Close"
      >
        <X size={18} />
      </button>
    </header>
  );
}

function ReadyBody({
  data,
  onClose,
}: {
  data: { kind: 'ready'; detail: ShipmentDetail; live: Live };
  onClose: () => void;
}) {
  const s = data.detail.shipment;
  const live = data.live;

  return (
    <>
      <Header
        onClose={onClose}
        title={s.ref}
        chips={
          <span className="flex items-center gap-2">
            <ModeChip mode={s.mode} />
            <StatusPill status={s.status} />
          </span>
        }
        sub={
          <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className="ft-micro text-brand-navy/65">
              {s.origin_city.toUpperCase()}, {s.origin_country.toUpperCase()}
            </span>
            <span className="text-brand-navy/40">→</span>
            <span className="ft-micro text-brand-navy/65">
              {s.dest_city.toUpperCase()}, {s.dest_country.toUpperCase()}
            </span>
            <span className="text-brand-navy/30">·</span>
            <span className="ft-micro text-brand-navy/65">
              {(s.carrier ?? 'Unknown carrier').toUpperCase()}
            </span>
          </span>
        }
      />

      {/* Body */}
      <div className="flex-1 overflow-auto">
        <div className="grid grid-cols-1 gap-0 md:grid-cols-2">
          {/* Map column */}
          <div className="border-b border-brand-rule p-4 md:border-b-0 md:border-r">
            <div className="aspect-[16/10] w-full sm:aspect-square md:aspect-auto md:h-[320px]">
              <RouteMap
                origin={live.route.origin}
                dest={live.route.dest}
                originLabel={s.origin_city}
                destLabel={s.dest_city}
                percent={live.percent}
                topLeft={<ModeBanner mode={s.mode} />}
                aspectClass="h-full w-full"
              />
            </div>
            <div className="mt-3 flex items-center gap-3 px-1">
              <span className="hidden text-[12px] text-brand-navy/65 sm:inline">
                {s.origin_city}
              </span>
              <div className="relative h-1 flex-1 bg-brand-bone">
                <div
                  className="absolute inset-y-0 left-0 bg-brand-red"
                  style={{ width: `${live.percent}%` }}
                />
              </div>
              <span className="hidden text-[12px] text-brand-navy/65 sm:inline">
                {s.dest_city}
              </span>
            </div>
            <div className="ft-micro mt-2 flex items-center justify-between px-1 text-brand-navy/55">
              <span>ATD {formatDateLong(s.atd)}</span>
              <span
                className={clsx(
                  live.percent >= 90 ? 'text-brand-navy' : 'text-brand-red',
                )}
              >
                {live.percent >= 100 ? 'Delivered' : `${live.percent}% complete`}
              </span>
              <span>ETA {formatDateLong(s.eta_agi)}</span>
            </div>
          </div>

          {/* Info column */}
          <div className="p-4">
            <div className="ft-eyebrow mb-3 text-brand-navy/55">Key facts</div>
            <dl className="grid grid-cols-2 gap-x-4 gap-y-3">
              <Fact k="ATD" v={formatDateLong(s.atd)} />
              <Fact k="ETA · AGI" v={formatDateLong(s.eta_agi)} />
              <Fact k="ETA · carrier" v={formatDateLong(s.eta_carrier)} />
              <Fact k="% complete" v={`${live.percent}%`} />
              <Fact
                k="Days remaining"
                v={live.daysRemaining != null ? `${live.daysRemaining}d` : '—'}
              />
              <Fact
                k="Value"
                v={
                  s.value_minor
                    ? `${s.currency} ${(s.value_minor / 100).toLocaleString()}`
                    : '—'
                }
              />
              <Fact k="Client" v={s.client ?? '—'} className="col-span-2" />
              {s.has_incident ? (
                <div className="col-span-2 mt-1 inline-flex items-center gap-2 border border-brand-red/35 bg-brand-red/5 px-2 py-1.5 text-[12px] text-brand-red">
                  <span className="h-1.5 w-1.5 bg-brand-red" />
                  <span className="ft-micro">Incident flagged</span>
                </div>
              ) : null}
            </dl>

            <div className="mt-5">
              <div className="ft-eyebrow mb-2 text-brand-navy/55">Milestones</div>
              <ul className="space-y-1.5">
                {live.milestones.map((m) => (
                  <li
                    key={m.id}
                    className="flex items-center gap-2 border-b border-brand-rule/60 py-1.5 last:border-b-0"
                  >
                    <span
                      className={clsx(
                        'inline-block h-2 w-2 shrink-0',
                        m.status === 'active'
                          ? 'bg-brand-red'
                          : m.status === 'done'
                            ? 'bg-brand-navy'
                            : 'bg-brand-navy/20',
                      )}
                    />
                    <span className="ft-micro w-6 shrink-0 text-brand-navy/45">
                      {String(m.ord).padStart(2, '0')}
                    </span>
                    <span
                      className={clsx(
                        'flex-1 truncate text-[13px]',
                        m.status === 'pending'
                          ? 'text-brand-navy/45'
                          : m.status === 'active'
                            ? 'font-medium text-brand-navy'
                            : 'text-brand-navy',
                      )}
                    >
                      {m.label}
                    </span>
                    {m.at ? (
                      <span className="ft-micro shrink-0 text-brand-navy/45">
                        {formatDateLong(m.at)}
                      </span>
                    ) : null}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="sticky bottom-0 flex items-center justify-end gap-2 border-t border-brand-rule bg-brand-paper px-4 py-3 sm:px-5">
        <Link
          to={`/app/shipments/${s.ref}`}
          onClick={onClose}
          className="ft-eyebrow inline-flex items-center gap-1.5 border border-brand-navy bg-transparent px-3 py-1.5 text-brand-navy transition-colors hover:bg-brand-navy/5"
        >
          Open full detail →
        </Link>
      </footer>
    </>
  );
}

function Fact({
  k,
  v,
  className,
}: {
  k: string;
  v: string;
  className?: string;
}) {
  return (
    <div className={clsx('flex flex-col gap-0.5', className)}>
      <dt className="ft-micro text-brand-navy/55">{k}</dt>
      <dd className="text-[14px] text-brand-navy">{v}</dd>
    </div>
  );
}

