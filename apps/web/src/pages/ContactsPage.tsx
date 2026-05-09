import { useState } from 'react';
import {
  Search,
  Building2,
  Users,
  Briefcase,
  ChevronDown,
  Plus,
  Anchor,
  Truck,
  Ship,
  Plane,
  Box,
} from 'lucide-react';
import { ContactsResponseSchema } from '@flowtrack/shared';
import { useApi } from '../lib/useApi';
import { DataState } from '../components/ui/DataState';
import clsx from 'clsx';

const FILTERS = [
  'All', 'Team', 'Clients', 'Factories', 'Freight forwarders',
  'Customs brokers', 'Origin ports', 'Destination ports',
  '3PL & warehousing', 'Fulfillment', 'Last-mile / courier',
];

const ICON_FOR_FILTER: Record<string, JSX.Element> = {
  Team: <Users size={12} />,
  Clients: <Briefcase size={12} />,
  Factories: <Building2 size={12} />,
  'Freight forwarders': <Truck size={12} />,
  'Customs brokers': <Briefcase size={12} />,
  'Origin ports': <Anchor size={12} />,
  'Destination ports': <Anchor size={12} />,
  '3PL & warehousing': <Box size={12} />,
  Fulfillment: <Box size={12} />,
  'Last-mile / courier': <Plane size={12} />,
};

export function ContactsPage() {
  const [filter, setFilter] = useState('All');
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const state = useApi('/contacts', ContactsResponseSchema);

  return (
    <div className="mx-auto w-full min-w-0 max-w-[1180px] space-y-4">
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
            Contacts
          </h1>
          <p className="ft-micro mt-2 text-brand-navy/55">
            65 companies · team, clients, providers
          </p>
        </div>
        <div className="-mx-1 flex items-center gap-2 overflow-x-auto px-1 sm:mx-0 sm:overflow-visible sm:px-0">
          <button
            type="button"
            aria-disabled="true"
            tabIndex={-1}
            className="inline-flex shrink-0 items-center gap-1.5 border border-brand-rule bg-brand-paper px-3 py-2 text-[12px] text-brand-navy/70 min-h-[44px] cursor-not-allowed opacity-70"
          >
            All Entities <ChevronDown size={12} />
          </button>
          <button
            type="button"
            aria-disabled="true"
            tabIndex={-1}
            className="inline-flex shrink-0 items-center border border-brand-rule bg-brand-paper px-3 py-2 text-[12px] text-brand-navy/70 min-h-[44px] cursor-not-allowed opacity-70"
          >
            Public tracking
          </button>
        </div>
      </header>

      <DataState state={state}>
        {(d) => (
          <>
            {/* Stat tiles: 1-col <480, 2-col 480-767, 4-col ≥768 */}
            <div className="grid grid-cols-1 gap-3 min-[480px]:grid-cols-2 md:grid-cols-4">
              <StatTile label="Companies" value={d.stats.companies} icon={<Building2 size={16} />} />
              <StatTile label="People" value={d.stats.people} icon={<Users size={16} />} />
              <StatTile label="Client accounts" value={d.stats.clients} icon={<Briefcase size={16} />} />
              <StatTile label="Active providers" value={d.stats.active_providers} icon={<Ship size={16} />} />
            </div>

            {/* Filters card */}
            <div className="border border-brand-rule bg-brand-paper p-3">
              <div className="mb-3 flex items-center gap-2 border border-brand-rule bg-brand-bone/40 px-3 py-2 min-h-[44px]">
                <Search size={14} className="text-brand-navy/55" />
                <input
                  className="w-full bg-transparent text-[14px] text-brand-navy outline-none placeholder:text-brand-navy/40"
                  placeholder="Search name, role, email, city…"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') e.preventDefault();
                  }}
                />
              </div>
              <div className="-mx-1 flex flex-nowrap items-center gap-2 overflow-x-auto px-1 pb-1 md:flex-wrap md:overflow-visible md:pb-0">
                {FILTERS.map((f) => {
                  const active = filter === f;
                  const count =
                    f === 'All'
                      ? d.stats.companies
                      : f === 'Team'
                        ? d.team.length
                        : f === 'Clients'
                          ? d.clientsPreview.length
                          : Math.round(Math.random() * 12);
                  return (
                    <button
                      key={f}
                      type="button"
                      onClick={() => setFilter(f)}
                      className={clsx(
                        'inline-flex shrink-0 items-center gap-1.5 px-3 py-2 text-[12px] min-h-[44px] transition-colors',
                        active
                          ? 'bg-brand-navy text-brand-paper'
                          : 'border border-brand-rule bg-brand-paper text-brand-navy/70 hover:bg-brand-bone/60',
                      )}
                    >
                      {ICON_FOR_FILTER[f]}
                      {f}
                      <span className="ml-1 text-[10px] opacity-70">{count}</span>
                    </button>
                  );
                })}
                <div className="ml-auto hidden items-center gap-2 md:flex">
                  <div className="flex items-center border border-brand-rule bg-brand-paper text-[12px]">
                    <button
                      type="button"
                      onClick={() => setView('grid')}
                      className={clsx(
                        'px-3 py-2 min-h-[44px]',
                        view === 'grid'
                          ? 'bg-brand-bone font-medium text-brand-navy'
                          : 'text-brand-navy/65',
                      )}
                    >
                      Grid
                    </button>
                    <button
                      type="button"
                      onClick={() => setView('list')}
                      className={clsx(
                        'px-3 py-2 min-h-[44px]',
                        view === 'list'
                          ? 'bg-brand-bone font-medium text-brand-navy'
                          : 'text-brand-navy/65',
                      )}
                    >
                      List
                    </button>
                  </div>
                  <button
                    type="button"
                    aria-disabled="true"
                    tabIndex={-1}
                    className="inline-flex shrink-0 items-center gap-1.5 bg-brand-red px-3 py-2 text-[12px] font-medium uppercase tracking-wider text-brand-paper min-h-[44px] cursor-not-allowed opacity-80"
                  >
                    <Plus size={12} /> Add contact
                  </button>
                </div>
              </div>
              <div className="mt-3 flex justify-end md:hidden">
                <button
                  type="button"
                  aria-disabled="true"
                  tabIndex={-1}
                  className="inline-flex w-full items-center justify-center gap-1.5 bg-brand-red px-3 py-2 text-[12px] font-medium uppercase tracking-wider text-brand-paper min-h-[44px] cursor-not-allowed opacity-80 sm:w-auto"
                >
                  <Plus size={12} /> Add contact
                </button>
              </div>
            </div>

            {/* Team — full-width card */}
            <Section title="Team" count={d.team.length}>
              <div className="border border-brand-rule bg-brand-paper p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center border border-brand-rule bg-brand-bone text-[13px] font-bold text-brand-navy">
                      I
                    </span>
                    <div>
                      <div className="text-[14px] font-medium text-brand-navy">
                        Innovtex (internal team)
                      </div>
                      <div className="ft-micro text-brand-navy/55">Team</div>
                    </div>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] text-brand-navy/65">
                  <span>Innovtex HQ</span>
                  <span>· {d.team.length} people</span>
                  <span>· 12 ship.</span>
                </div>
              </div>
            </Section>

            {/* Clients: 1<480, 2 at 480-767, 3 at 768-1023, 4 at ≥1024 */}
            <Section title="Clients" count={d.clientsPreview.length}>
              <div className="grid auto-rows-fr grid-cols-1 gap-3 min-[480px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {d.clientsPreview.map((c) => {
                  const initials = c.name
                    .split(/\s+/)
                    .filter(Boolean)
                    .slice(0, 2)
                    .map((s) => s[0])
                    .join('')
                    .toUpperCase();
                  return (
                    <div key={c.id} className="flex h-full flex-col border border-brand-rule bg-brand-paper p-4">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex min-w-0 items-center gap-3">
                          <span className="flex h-10 w-10 shrink-0 items-center justify-center border border-brand-rule bg-brand-bone text-[13px] font-bold text-brand-navy">
                            {initials}
                          </span>
                          <div className="min-w-0">
                            <div className="truncate text-[14px] font-medium text-brand-navy">
                              {c.name}
                            </div>
                            <div className="ft-micro text-brand-navy/55">Clients</div>
                          </div>
                        </div>
                        <span className="ft-micro shrink-0 text-brand-navy/50">{c.country}</span>
                      </div>
                      <div className="mt-3 flex items-center gap-3 text-[12px] text-brand-navy/65">
                        <span className="flex items-center gap-1">
                          <Users size={12} /> 3
                        </span>
                        <span>· {Math.round(Math.random() * 4) + 1} ship.</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Section>

            {/* Providers preview: 1<640, 2 at 640-767, 3 at 768-1023, 4 at ≥1024 */}
            <Section title="Providers (top)" count={d.providersPreview.length}>
              <div className="grid auto-rows-fr grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {d.providersPreview.slice(0, 9).map((p) => (
                  <div key={p.id} className="flex h-full items-center border border-brand-rule bg-brand-paper p-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center border border-brand-rule bg-brand-bone text-[12px] font-bold text-brand-navy">
                        {p.name.slice(0, 2).toUpperCase()}
                      </span>
                      <div className="min-w-0">
                        <div className="truncate text-[14px] font-medium text-brand-navy">
                          {p.name}
                        </div>
                        <div className="ft-micro text-brand-navy/55">
                          {p.industry ?? 'Provider'} · {p.country ?? '—'}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Section>
          </>
        )}
      </DataState>
    </div>
  );
}

function StatTile({ label, value, icon }: { label: string; value: number; icon: JSX.Element }) {
  return (
    <div className="flex items-start justify-between border border-brand-rule bg-brand-paper p-4">
      <div>
        <div className="ft-eyebrow text-brand-navy/55">{label}</div>
        <div
          className="mt-2 text-brand-navy"
          style={{
            fontFamily: 'Switzer, sans-serif',
            fontWeight: 300,
            fontSize: '28px',
            lineHeight: 1.04,
            letterSpacing: '-0.01em',
          }}
        >
          {value}
        </div>
      </div>
      <div className="border border-brand-rule p-2 text-brand-navy/70">{icon}</div>
    </div>
  );
}

function Section({
  title,
  count,
  children,
}: {
  title: string;
  count: number;
  children: React.ReactNode;
}) {
  return (
    <section>
      <header className="mb-2 flex items-baseline gap-2">
        <h2 className="ft-eyebrow text-brand-navy">{title}</h2>
        <span className="ft-micro text-brand-navy/50">{count}</span>
      </header>
      {children}
    </section>
  );
}
