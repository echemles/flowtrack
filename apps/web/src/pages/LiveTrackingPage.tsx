import { useState, useEffect } from 'react';
import { Plane, Ship, Truck, Package, ChevronDown } from 'lucide-react';
import {
  ShipmentListSchema,
  LiveTrackingSchema,
  type Shipment,
} from '@flowtrack/shared';
import { useApi } from '../lib/useApi';
import { DataState } from '../components/ui/DataState';
import { LiveTrackingPanel } from './live-tracking/LiveTrackingPanel';
import clsx from 'clsx';

function ModeIcon({ mode }: { mode: string }) {
  const cls = 'opacity-70';
  if (mode === 'sea') return <Ship size={11} className={cls} />;
  if (mode === 'air') return <Plane size={11} className={cls} />;
  if (mode === 'road') return <Truck size={11} className={cls} />;
  return <Package size={11} className={cls} />;
}

export function LiveTrackingPage() {
  const all = useApi('/shipments?tab=all', ShipmentListSchema);
  const [selectedRef, setSelectedRef] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedRef && all.data && all.data.length > 0) {
      const target = all.data.find((s) => s.ref === 'FT-26-S891') ?? all.data[0];
      setSelectedRef(target.ref);
    }
  }, [all.data, selectedRef]);

  const tracking = useApi(
    selectedRef ? `/live-tracking/${selectedRef}` : null,
    LiveTrackingSchema,
  );

  // Inert handler for buttons/links that today don't navigate anywhere real.
  const inert = (e: React.MouseEvent) => e.preventDefault();

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
            Live Tracking
          </h1>
          <p className="ft-micro mt-2 text-brand-navy/55">
            Real-time position · air, sea &amp; road — animated route view
          </p>
        </div>
        <div className="-mx-1 flex items-center gap-2 overflow-x-auto px-1 sm:mx-0 sm:overflow-visible sm:px-0">
          <button
            type="button"
            onClick={inert}
            className="inline-flex shrink-0 items-center gap-1.5 border border-brand-rule bg-brand-paper px-3 py-2 text-[12px] min-h-[44px] text-brand-navy/75 hover:bg-brand-bone/60 transition-colors"
          >
            All Entities <ChevronDown size={12} />
          </button>
          <button
            type="button"
            onClick={inert}
            className="inline-flex shrink-0 items-center border border-brand-rule bg-brand-paper px-3 py-2 text-[12px] min-h-[44px] text-brand-navy/75 hover:bg-brand-bone/60 transition-colors"
          >
            Public tracking
          </button>
        </div>
      </header>

      <DataState<Shipment[]> state={all}>
        {(shipments) => (
          <div className="-mx-1 flex flex-nowrap items-center gap-2 overflow-x-auto px-1 pb-1 sm:flex-wrap sm:overflow-visible">
            {shipments.map((s) => {
              const active = s.ref === selectedRef;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSelectedRef(s.ref)}
                  className={clsx(
                    'inline-flex shrink-0 items-center gap-1.5 border px-3 py-2 text-[12px] min-h-[44px] transition-colors',
                    active
                      ? 'border-brand-navy bg-brand-navy text-brand-paper font-medium'
                      : 'border-brand-rule bg-brand-paper text-brand-navy/75 hover:bg-brand-bone/60',
                  )}
                >
                  <ModeIcon mode={s.mode} />
                  {s.ref}
                </button>
              );
            })}
          </div>
        )}
      </DataState>

      {selectedRef ? (
        <DataState state={tracking}>
          {(d) => <LiveTrackingPanel data={d} />}
        </DataState>
      ) : null}
    </div>
  );
}
