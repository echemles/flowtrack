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
            Connect
          </h1>
          <p className="ft-micro mt-2 text-brand-navy/55">
            5-minute setup · OAuth into your stack, no IT required
          </p>
        </div>
        <div className="-mx-1 flex items-center gap-2 overflow-x-auto px-1 sm:mx-0 sm:overflow-visible sm:px-0">
          <button className="ft-pill ft-pill-ghost ft-pill-sm shrink-0">
            All Entities <ChevronDown size={12} />
          </button>
          <button className="ft-pill ft-pill-ghost ft-pill-sm shrink-0">Public tracking</button>
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
              <section className="border border-brand-rule bg-brand-ink p-5 text-brand-paper sm:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="ft-eyebrow text-brand-red">★ 5-minute setup</div>
                    <h2
                      className="mt-2"
                      style={{
                        fontFamily: 'Switzer, sans-serif',
                        fontWeight: 300,
                        fontSize: '26px',
                        lineHeight: 1.1,
                        letterSpacing: '-0.01em',
                      }}
                    >
                      Connect your stack
                    </h2>
                    <p className="mt-2 max-w-md text-[14px] text-brand-paper/75">
                      FlowTrack pulls shipment data from carriers, aggregators, ERPs, and email —
                      automatically. No CSVs, no IT tickets. Click connect, walk away.
                    </p>
                  </div>
                  <div className="flex flex-row gap-6 sm:flex-col sm:items-end sm:gap-3">
                    <div className="sm:text-right">
                      <div className="ft-micro text-brand-paper/60">Connected</div>
                      <div className="mt-1 text-[22px] font-light tabular-nums">
                        {d.totals.connected} / {totalAll}
                      </div>
                    </div>
                    <div className="sm:text-right">
                      <div className="ft-micro text-brand-paper/60">Time spent</div>
                      <div className="mt-1 text-[22px] font-light tabular-nums">{minutesSpent} min</div>
                    </div>
                  </div>
                </div>
                <div className="mt-5">
                  <div className="ft-micro mb-2 flex items-center justify-between text-brand-paper/70">
                    <span>Recommended setup progress</span>
                    <span className="text-brand-paper">{progress}%</span>
                  </div>
                  <div className="h-1 overflow-hidden bg-brand-paper/15">
                    <div className="h-full bg-brand-red" style={{ width: `${progress}%` }} />
                  </div>
                  <div className="mt-2 text-[12px] text-brand-paper/65">
                    Connect 2 more to reach the recommended baseline.
                  </div>
                </div>
              </section>

              {/* Tabs */}
              <div className="-mx-1 flex flex-wrap items-center gap-2 overflow-x-auto px-1 sm:overflow-visible">
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
                        'inline-flex shrink-0 items-center gap-1.5 px-3 py-1.5 text-[12px] min-h-[32px]',
                        tab === t.id
                          ? 'bg-brand-navy text-brand-paper'
                          : 'border border-brand-rule bg-brand-paper text-brand-navy/70 hover:bg-brand-bone/60',
                      )}
                    >
                      {t.label}
                      <span className="text-[10px] opacity-70">{count}</span>
                    </button>
                  );
                })}
                <a
                  className="ft-eyebrow ml-auto whitespace-nowrap text-brand-red hover:text-brand-redInk"
                  href="#"
                >
                  Request integration →
                </a>
              </div>

              {(['aggregators', 'carriers_direct', 'erp', 'communications'] as const).map((tier) => (
                <section key={tier} className="border border-brand-rule bg-brand-paper p-4">
                  <header className="mb-3 flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h2 className="ft-eyebrow text-brand-navy">{TIER_TITLES[tier].title}</h2>
                      <p className="mt-1 text-[13px] text-brand-navy/70">
                        {TIER_TITLES[tier].subtitle}
                      </p>
                    </div>
                    <span className="ft-micro text-brand-navy/50">
                      {d.groups[tier].length} options
                    </span>
                  </header>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-2">
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
    <div className="flex flex-col gap-3 border border-brand-rule bg-brand-bone/40 p-3 sm:flex-row sm:items-start">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center border border-brand-rule bg-brand-paper text-[12px] font-bold text-brand-navy">
        {initials}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[14px] font-medium text-brand-navy">{i.name}</span>
          {i.plan && i.plan !== 'Standard' && i.plan !== 'Pay-as-you-go' ? (
            <span className="ft-micro border border-brand-red/30 px-1.5 py-0.5 text-brand-red">
              {i.plan}
            </span>
          ) : null}
        </div>
        <div className="mt-0.5 truncate text-[12px] text-brand-navy/65">
          {i.plan ?? 'Integration'}
        </div>
        <div className="mt-2 flex items-center gap-2 text-[11px] text-brand-navy/55">
          <span>{auth}</span>
          {i.setup_minutes != null ? (
            <>
              <span>·</span>
              <span>~{i.setup_minutes} min</span>
            </>
          ) : null}
        </div>
      </div>
      <div className="self-start sm:self-auto">
        {i.status === 'connected' ? (
          <span className="ft-micro inline-flex items-center gap-1 border border-brand-navy/20 px-2 py-1 text-brand-navy">
            <Check size={12} /> Connected
          </span>
        ) : i.status === 'connecting' ? (
          <span className="ft-micro inline-flex items-center gap-1 border border-brand-red/30 px-2 py-1 text-brand-red">
            ● Connecting…
          </span>
        ) : (
          <button className="ft-pill ft-pill-primary ft-pill-sm">
            <Plus size={12} /> Connect
          </button>
        )}
      </div>
    </div>
  );
}
