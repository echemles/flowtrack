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
    <div className="mx-auto max-w-[1180px] space-y-4">
      <header className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-text-primary">Contacts</h1>
          <p className="mt-0.5 text-xs text-text-secondary">
            65 companies · team, clients, providers
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
        {(d) => (
          <>
            {/* Stat tiles */}
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              <StatTile label="Companies" value={d.stats.companies} icon={<Building2 size={16} />} />
              <StatTile label="People" value={d.stats.people} icon={<Users size={16} />} />
              <StatTile label="Client accounts" value={d.stats.clients} icon={<Briefcase size={16} />} />
              <StatTile label="Active providers" value={d.stats.active_providers} icon={<Ship size={16} />} />
            </div>

            {/* Filters card */}
            <div className="rounded-lg border border-border-subtle bg-surface-card p-3">
              <div className="mb-3 flex items-center gap-2 rounded-md border border-border-subtle bg-surface-canvas px-3 py-1.5">
                <Search size={14} className="text-text-muted" />
                <input
                  className="w-full bg-transparent text-sm outline-none placeholder:text-text-muted"
                  placeholder="Search name, role, email, city…"
                />
              </div>
              <div className="flex flex-wrap items-center gap-2">
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
                        'inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs',
                        active
                          ? 'bg-text-primary text-white'
                          : 'border border-border-subtle bg-surface-card text-text-secondary hover:bg-surface-canvas',
                      )}
                    >
                      {ICON_FOR_FILTER[f]}
                      {f}
                      <span className="ml-1 text-[10px] opacity-70">{count}</span>
                    </button>
                  );
                })}
                <div className="ml-auto flex items-center gap-2">
                  <div className="flex items-center rounded-md border border-border-subtle bg-surface-card text-xs">
                    <button
                      onClick={() => setView('grid')}
                      className={clsx(
                        'px-2 py-1',
                        view === 'grid' ? 'bg-surface-canvas font-semibold text-text-primary' : 'text-text-secondary',
                      )}
                    >
                      Grid
                    </button>
                    <button
                      onClick={() => setView('list')}
                      className={clsx(
                        'px-2 py-1',
                        view === 'list' ? 'bg-surface-canvas font-semibold text-text-primary' : 'text-text-secondary',
                      )}
                    >
                      List
                    </button>
                  </div>
                  <button className="inline-flex items-center gap-1 rounded-md bg-blue-600 px-2 py-1 text-xs font-medium text-white hover:bg-blue-700">
                    <Plus size={12} /> Add contact
                  </button>
                </div>
              </div>
            </div>

            {/* Team */}
            <Section title="Team" count={d.team.length}>
              <div className="grid gap-3 md:grid-cols-2">
                <div className="rounded-md border border-border-subtle bg-surface-card p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-md bg-violet-100 text-sm font-bold text-violet-700">
                        I
                      </span>
                      <div>
                        <div className="text-sm font-semibold text-text-primary">
                          Innovtex (internal team)
                        </div>
                        <div className="text-[11px] text-text-secondary">Team</div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-3 text-xs text-text-secondary">
                    <span className="flex items-center gap-1">📍 Innovtex HQ</span>
                    <span className="flex items-center gap-1">👥 {d.team.length}</span>
                    <span>· 12 ship.</span>
                  </div>
                </div>
              </div>
            </Section>

            {/* Clients */}
            <Section title="Clients" count={d.clientsPreview.length}>
              <div className="grid gap-3 md:grid-cols-2">
                {d.clientsPreview.map((c) => {
                  const initials = c.name
                    .split(/\s+/)
                    .filter(Boolean)
                    .slice(0, 2)
                    .map((s) => s[0])
                    .join('')
                    .toUpperCase();
                  return (
                    <div key={c.id} className="rounded-md border border-border-subtle bg-surface-card p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <span className="flex h-10 w-10 items-center justify-center rounded-md bg-blue-100 text-sm font-bold text-blue-700">
                            {initials}
                          </span>
                          <div>
                            <div className="text-sm font-semibold text-text-primary">{c.name}</div>
                            <div className="text-[11px] text-text-secondary">Clients</div>
                          </div>
                        </div>
                        <span className="text-[11px] text-text-muted">{c.country}</span>
                      </div>
                      <div className="mt-3 flex items-center gap-3 text-xs text-text-secondary">
                        <span>—</span>
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

            {/* Providers */}
            <Section title="Providers (top)" count={d.providersPreview.length}>
              <div className="grid gap-3 md:grid-cols-3">
                {d.providersPreview.slice(0, 9).map((p) => (
                  <div key={p.id} className="rounded-md border border-border-subtle bg-surface-card p-3">
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-md bg-emerald-100 text-xs font-bold text-emerald-700">
                        {p.name.slice(0, 2).toUpperCase()}
                      </span>
                      <div>
                        <div className="text-sm font-semibold text-text-primary">{p.name}</div>
                        <div className="text-[11px] text-text-secondary">
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
    <div className="flex items-start justify-between rounded-lg border border-border-subtle bg-surface-card p-4">
      <div>
        <div className="text-[11px] font-bold uppercase tracking-wider text-text-secondary">{label}</div>
        <div className="mt-1 text-2xl font-semibold text-text-primary">{value}</div>
      </div>
      <div className="rounded-md bg-surface-canvas p-2 text-text-secondary">{icon}</div>
    </div>
  );
}

function Section({ title, count, children }: { title: string; count: number; children: React.ReactNode }) {
  return (
    <section>
      <header className="mb-2 flex items-center gap-2">
        <h2 className="text-sm font-semibold text-text-primary">{title}</h2>
        <span className="text-xs text-text-muted">{count}</span>
      </header>
      {children}
    </section>
  );
}
