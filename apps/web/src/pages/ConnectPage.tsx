import { useState } from 'react';
import { ChevronDown, Plus, Check } from 'lucide-react';
import { IntegrationsResponseSchema, type Integration } from '@flowtrack/shared';
import { useApi } from '../lib/useApi';
import { DataState } from '../components/ui/DataState';
import clsx from 'clsx';

const TIER_TITLES: Record<string, { title: string; subtitle: string }> = {
  aggregators: {
    title: 'Aggregators',
    subtitle: 'One connection covers hundreds of carriers — fastest path to value.',
  },
  carriers_direct: {
    title: 'Carriers — direct',
    subtitle: 'Bypass aggregators with native APIs for the carriers you use most.',
  },
  erp: {
    title: 'ERP & Operations',
    subtitle: 'Bidirectional sync — POs, suppliers, invoices flow both ways. Enterprise tier.',
  },
  communications: {
    title: 'Communications',
    subtitle: 'AGI parses these channels and threads conversations to the right shipment.',
  },
};

const TAB_FILTERS = [
  { id: 'all', label: 'All', total: true },
  { id: 'recommended', label: 'Recommended', total: false },
  { id: 'connected', label: 'Connected', total: false },
  { id: 'available', label: 'Available', total: false },
];

export function ConnectPage() {
  const [tab, setTab] = useState('all');
  const state = useApi('/integrations', IntegrationsResponseSchema);

  return (
    <div className="mx-auto max-w-[1180px] space-y-4">
      <header className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-text-primary">Connect</h1>
          <p className="mt-0.5 text-xs text-text-secondary">
            5-minute setup · OAuth into your stack, no IT required
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

      <DataState state={state}>
        {(d) => {
          const totalAll = Object.values(d.groups).flat().length;
          const recommended = 4;
          const progress = Math.round((d.totals.connected / Math.max(recommended, 1)) * 100);
          const minutesSpent = 40;

          return (
            <>
              {/* Hero */}
              <section className="rounded-lg bg-gradient-to-br from-violet-600 via-blue-600 to-blue-700 p-6 text-white shadow-md">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-xs font-bold uppercase tracking-widest text-white/70">
                      ★ 5-minute setup
                    </div>
                    <h2 className="mt-2 text-2xl font-semibold">Connect your stack</h2>
                    <p className="mt-1 max-w-md text-sm text-white/80">
                      FlowTrack pulls shipment data from carriers, aggregators, ERPs, and email — automatically.
                      No CSVs, no IT tickets. Click connect, walk away.
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-3">
                    <div className="text-right">
                      <div className="text-[10px] font-bold uppercase tracking-widest text-white/60">Connected</div>
                      <div className="text-2xl font-semibold">{d.totals.connected} / {totalAll}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] font-bold uppercase tracking-widest text-white/60">Time spent</div>
                      <div className="text-2xl font-semibold">{minutesSpent} min</div>
                    </div>
                  </div>
                </div>
                <div className="mt-5">
                  <div className="mb-1 flex items-center justify-between text-[11px] text-white/70">
                    <span>Recommended setup progress</span>
                    <span className="font-semibold text-white">{progress}%</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-white/20">
                    <div className="h-full bg-white" style={{ width: `${progress}%` }} />
                  </div>
                  <div className="mt-1 text-[11px] text-white/70">
                    Connect 2 more to reach the recommended baseline.
                  </div>
                </div>
              </section>

              {/* Tabs */}
              <div className="flex flex-wrap items-center gap-2">
                {TAB_FILTERS.map((t) => {
                  const count =
                    t.id === 'all'
                      ? totalAll
                      : t.id === 'recommended'
                        ? recommended
                        : t.id === 'connected'
                          ? d.totals.connected
                          : totalAll - d.totals.connected;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setTab(t.id)}
                      className={clsx(
                        'inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs',
                        tab === t.id
                          ? 'bg-text-primary text-white'
                          : 'border border-border-subtle bg-surface-card text-text-secondary hover:bg-surface-canvas',
                      )}
                    >
                      {t.label}
                      <span className="text-[10px] opacity-70">{count}</span>
                    </button>
                  );
                })}
                <a className="ml-auto text-xs font-medium text-blue-600 hover:underline" href="#">
                  Looking for something specific? Request integration →
                </a>
              </div>

              {(['aggregators', 'carriers_direct', 'erp', 'communications'] as const).map((tier) => (
                <section key={tier} className="rounded-lg border border-border-subtle bg-surface-card p-4">
                  <header className="mb-3 flex items-start justify-between">
                    <div>
                      <h2 className="text-sm font-semibold text-text-primary">
                        {TIER_TITLES[tier].title}
                      </h2>
                      <p className="text-xs text-text-secondary">{TIER_TITLES[tier].subtitle}</p>
                    </div>
                    <span className="text-[11px] text-text-muted">
                      {d.groups[tier].length} options
                    </span>
                  </header>
                  <div className="grid gap-3 md:grid-cols-2">
                    {filtered(d.groups[tier], tab).map((i) => (
                      <IntegrationCard key={i.id} i={i} />
                    ))}
                  </div>
                </section>
              ))}
            </>
          );
        }}
      </DataState>
    </div>
  );
}

function filtered(rows: Integration[], tab: string) {
  if (tab === 'connected') return rows.filter((r) => r.status === 'connected');
  if (tab === 'recommended') return rows.slice(0, 2);
  if (tab === 'available') return rows.filter((r) => r.status !== 'connected');
  return rows;
}

function IntegrationCard({ i }: { i: Integration }) {
  const initials = i.name.slice(0, 2).toUpperCase();
  const auth = i.setup_minutes ? (i.setup_minutes < 15 ? 'OAuth' : 'API key') : 'OAuth';
  return (
    <div className="flex items-start gap-3 rounded-md border border-border-subtle bg-surface-canvas p-3">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-surface-card text-xs font-bold text-text-secondary ring-1 ring-border-subtle">
        {initials}
      </span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-text-primary">{i.name}</span>
          {i.plan && i.plan !== 'Standard' && i.plan !== 'Pay-as-you-go' ? (
            <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-amber-800">
              {i.plan}
            </span>
          ) : null}
        </div>
        <div className="mt-0.5 truncate text-xs text-text-secondary">{i.plan ?? 'Integration'}</div>
        <div className="mt-2 flex items-center gap-2 text-[11px] text-text-muted">
          <span>{auth}</span>
          {i.setup_minutes != null ? (
            <>
              <span>·</span>
              <span>~{i.setup_minutes} min</span>
            </>
          ) : null}
        </div>
      </div>
      {i.status === 'connected' ? (
        <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700 ring-1 ring-emerald-200">
          <Check size={12} /> Connected
        </span>
      ) : i.status === 'connecting' ? (
        <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-2 py-1 text-xs font-medium text-amber-700 ring-1 ring-amber-200">
          ● Connecting…
        </span>
      ) : (
        <button className="inline-flex items-center gap-1 rounded-md bg-text-primary px-2 py-1 text-xs font-medium text-white hover:bg-slate-800">
          <Plus size={12} /> Connect
        </button>
      )}
    </div>
  );
}
