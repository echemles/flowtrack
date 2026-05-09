import type { MouseEvent } from 'react';
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
    <div className="mx-auto max-w-[1180px] space-y-4 sm:space-y-5">
      <Header />
      <DataState<ControlTower> state={state}>
        {(data) => (
          <div className="space-y-4 sm:space-y-5">
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

const noop = (e: MouseEvent) => e.preventDefault();

function Header() {
  const { open: openAddShipments } = useAddShipments();
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
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
          Control Tower
        </h1>
        <p className="ft-micro mt-2 text-brand-navy/55">
          Global shipment visibility · all modes
        </p>
      </div>
      <div className="-mx-1 flex items-center gap-2 overflow-x-auto px-1 sm:mx-0 sm:overflow-visible sm:px-0">
        <button
          type="button"
          onClick={noop}
          className="ft-pill ft-pill-ghost ft-pill-sm shrink-0 min-h-[44px] sm:min-h-0"
        >
          All Entities
          <ChevronDown size={12} />
        </button>
        <button
          type="button"
          onClick={openAddShipments}
          className="ft-pill ft-pill-primary ft-pill-sm shrink-0 min-h-[44px] sm:min-h-0"
        >
          <Plus size={12} />
          Add shipments
        </button>
        <button
          type="button"
          onClick={noop}
          className="ft-pill ft-pill-ghost ft-pill-sm shrink-0 min-h-[44px] sm:min-h-0"
        >
          <Activity size={12} />
          Public tracking
        </button>
        <button
          type="button"
          onClick={noop}
          aria-label="Notifications"
          className="relative inline-flex h-11 w-11 shrink-0 items-center justify-center border border-brand-rule bg-brand-paper text-brand-navy/70 transition-colors hover:bg-brand-bone sm:h-9 sm:w-9"
        >
          <Bell size={14} />
          <span className="absolute -right-1 -top-1 inline-flex h-4 min-w-4 items-center justify-center bg-brand-red px-1 text-[10px] font-bold text-brand-paper">
            4
          </span>
        </button>
      </div>
    </div>
  );
}

export { Calendar, Sparkles };
