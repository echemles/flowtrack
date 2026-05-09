import {
  Plug,
  BarChart3,
  Calculator,
  Sparkles,
  DollarSign,
  Layers,
  Bell,
  ChevronDown,
  Save,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { SettingsResponseSchema } from '@flowtrack/shared';
import { useApi } from '../lib/useApi';
import { DataState } from '../components/ui/DataState';

const TOOL_TILES = [
  { key: 'connect', label: 'Connect', subtitle: '5-min OAuth setup', icon: <Plug size={16} className="text-blue-600" />, accent: 'bg-blue-50', to: '/connect' },
  { key: 'analytics', label: 'Analytics', subtitle: 'Cycle time & lane economics', icon: <BarChart3 size={16} className="text-violet-600" />, accent: 'bg-violet-50', to: '/' },
  { key: 'roi', label: 'ROI Calculator', subtitle: 'Prove the business case', icon: <Calculator size={16} className="text-emerald-600" />, accent: 'bg-emerald-50', to: '/' },
  { key: 'agi', label: 'AGI', subtitle: 'Models & contract', icon: <Sparkles size={16} className="text-pink-600" />, accent: 'bg-pink-50', to: '/' },
  { key: 'pricing', label: 'Pricing', subtitle: 'Plans & tiers', icon: <DollarSign size={16} className="text-amber-600" />, accent: 'bg-amber-50', to: '/' },
  { key: 'integrations', label: 'Integrations', subtitle: 'API & connectors', icon: <Layers size={16} className="text-indigo-600" />, accent: 'bg-indigo-50', to: '/connect' },
  { key: 'notifications', label: 'Notifications', subtitle: 'Activity history', icon: <Bell size={16} className="text-orange-600" />, accent: 'bg-orange-50', to: '/' },
];

export function SettingsPage() {
  const state = useApi('/settings', SettingsResponseSchema);
  return (
    <div className="mx-auto max-w-[1180px] space-y-4">
      <header className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-text-primary">Settings</h1>
          <p className="mt-0.5 text-xs text-text-secondary">
            Team, preferences, entity management
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
            <section className="rounded-lg border border-border-subtle bg-surface-card p-4">
              <h2 className="mb-3 text-[11px] font-bold uppercase tracking-wider text-text-secondary">
                More tools
              </h2>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
                {TOOL_TILES.map((t) => (
                  <Link
                    key={t.key}
                    to={t.to}
                    className="flex items-start gap-3 rounded-md border border-border-subtle bg-surface-card p-4 hover:bg-surface-canvas"
                  >
                    <span className={`rounded-md p-2 ${t.accent}`}>{t.icon}</span>
                    <div>
                      <div className="text-sm font-semibold text-text-primary">{t.label}</div>
                      <div className="text-xs text-text-secondary">{t.subtitle}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>

            <section className="rounded-lg border border-border-subtle bg-surface-card p-4">
              <header className="mb-3 flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-semibold text-text-primary">Notification defaults</h2>
                  <p className="text-xs text-text-secondary">
                    <span className="rounded bg-violet-100 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-violet-700">
                      From onboarding
                    </span>{' '}
                    Applied to every new shipment automatically. Override per-shipment from the Notifications panel.
                  </p>
                </div>
                <button className="inline-flex items-center gap-1 rounded-md bg-text-primary px-2 py-1 text-xs font-medium text-white hover:bg-slate-800">
                  <Save size={12} /> Save defaults
                </button>
              </header>

              <div className="rounded-md border border-border-subtle bg-surface-canvas p-4">
                <div className="mb-3 text-[11px] font-bold uppercase tracking-wider text-text-secondary">
                  Shipping party
                </div>
                <p className="mb-3 text-xs text-text-secondary">Your team — origin / orchestrator</p>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Field label="Name" defaultValue="Jordan Ellis" />
                  <Field label="Email" defaultValue="jordan@innovtex.co" />
                  <Field label="Phone (SMS)" defaultValue="+1 415 555 0010" />
                  <Field label="WhatsApp" defaultValue="+1 415 555 0010" />
                  <Field label="Slack handle" defaultValue="@jordan" />
                  <Field label="Teams handle" defaultValue="jordan@innovtex.co" />
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <div className="text-[11px] font-bold uppercase tracking-wider text-text-secondary">
                  Default channels
                </div>
                {d.notificationDefaults.map((n) => (
                  <label
                    key={n.key}
                    className="flex items-center justify-between rounded-md border border-border-subtle bg-surface-card px-3 py-2"
                  >
                    <span className="text-sm text-text-primary">{n.label}</span>
                    <input type="checkbox" defaultChecked={n.enabled} className="accent-blue-600" />
                  </label>
                ))}
              </div>
            </section>

            <section className="rounded-lg border border-border-subtle bg-surface-card p-4">
              <h2 className="mb-3 text-sm font-semibold text-text-primary">Internal team</h2>
              <ul className="grid grid-cols-1 gap-2 md:grid-cols-2">
                {d.team.map((p) => (
                  <li
                    key={p.id}
                    className="flex items-center justify-between rounded-md border border-border-subtle bg-surface-canvas px-3 py-2"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-100 text-xs font-bold text-blue-700">
                        {p.name.split(/\s+/).map((s) => s[0]).join('').slice(0, 2)}
                      </span>
                      <div>
                        <div className="text-sm font-medium text-text-primary">{p.name}</div>
                        <div className="text-[11px] text-text-secondary">{p.role ?? '—'}</div>
                      </div>
                    </div>
                    <div className="text-[11px] text-text-muted">{p.email ?? ''}</div>
                  </li>
                ))}
              </ul>
            </section>
          </>
        )}
      </DataState>
    </div>
  );
}

function Field({ label, defaultValue }: { label: string; defaultValue: string }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-[11px] font-bold uppercase tracking-wider text-text-secondary">{label}</span>
      <input
        defaultValue={defaultValue}
        className="rounded-md border border-border-subtle bg-surface-card px-3 py-1.5 text-sm text-text-primary outline-none focus:border-blue-400"
      />
    </label>
  );
}
