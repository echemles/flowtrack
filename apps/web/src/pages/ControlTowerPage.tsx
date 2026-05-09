import { ControlTowerResponseSchema, type ControlTower } from '@flowtrack/shared';
import { ChevronDown, Plus, Bell, Sparkles, Calendar, Activity } from 'lucide-react';
import { useApi } from '../lib/useApi';
import { DataState } from '../components/ui/DataState';
import { useAddShipments } from '../components/AddShipmentsContext';
import { AlertsQueue } from './control-tower/AlertsQueue';
import { SetupAndBriefing } from './control-tower/SetupAndBriefing';
import { NeedsYouNow } from './control-tower/NeedsYouNow';
import { TodaysFlow } from './control-tower/TodaysFlow';
import { PulseKpis } from './control-tower/PulseKpis';
import { GlobalNetworkMap } from './control-tower/GlobalNetworkMap';

export function ControlTowerPage() {
  const state = useApi('/control-tower', ControlTowerResponseSchema);

  return (
    <div className="mx-auto max-w-[1180px] space-y-5">
      <Header />
      <DataState<ControlTower> state={state}>
        {(data) => (
          <div className="space-y-5">
            <SetupAndBriefing briefing={data.briefing} />
            <AlertsQueue alerts={data.alerts} />
            <NeedsYouNow items={data.needsYouNow} />
            <TodaysFlow flow={data.todaysFlow} />
            <PulseKpis pulse={data.pulse} />
            <GlobalNetworkMap lanes={data.networkLanes} />
          </div>
        )}
      </DataState>
    </div>
  );
}

function Header() {
  const { open: openAddShipments } = useAddShipments();
  return (
    <div className="flex items-start justify-between gap-3">
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-text-primary">Control Tower</h1>
        <p className="mt-0.5 text-xs text-text-secondary">
          Global shipment visibility · all modes
        </p>
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          className="inline-flex items-center gap-1.5 rounded-md border border-border-subtle bg-surface-card px-3 py-1.5 text-xs text-text-secondary hover:bg-surface-canvas"
        >
          All Entities
          <ChevronDown size={12} />
        </button>
        <button
          type="button"
          onClick={openAddShipments}
          className="inline-flex items-center gap-1.5 rounded-md bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700"
        >
          <Plus size={12} />
          Add shipments
        </button>
        <button
          type="button"
          className="inline-flex items-center gap-1.5 rounded-md border border-border-subtle bg-surface-card px-3 py-1.5 text-xs text-text-secondary hover:bg-surface-canvas"
        >
          <Activity size={12} />
          Public tracking
        </button>
        <button
          type="button"
          className="relative rounded-md border border-border-subtle bg-surface-card p-1.5 text-text-secondary hover:bg-surface-canvas"
        >
          <Bell size={14} />
          <span className="absolute -right-1 -top-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white">
            4
          </span>
        </button>
      </div>
    </div>
  );
}

export { Calendar, Sparkles };
