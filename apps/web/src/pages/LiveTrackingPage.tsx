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

  return (
    <div className="mx-auto max-w-[1180px] space-y-4">
      <header className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-text-primary">Live Tracking</h1>
          <p className="mt-0.5 text-xs text-text-secondary">
            Real-time position · air, sea & road — animated route view
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

      <DataState<Shipment[]> state={all}>
        {(shipments) => (
          <div className="flex flex-wrap gap-2">
            {shipments.map((s) => {
              const active = s.ref === selectedRef;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSelectedRef(s.ref)}
                  className={clsx(
                    'inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs transition-colors',
                    active
                      ? 'border-blue-600 bg-blue-50 text-blue-700 font-semibold'
                      : 'border-border-subtle bg-surface-card text-text-secondary hover:bg-surface-canvas',
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
