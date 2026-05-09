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
  { key: 'connect', label: 'Connect', subtitle: '5-min OAuth setup', icon: <Plug size={16} />, to: '/connect' },
  { key: 'analytics', label: 'Analytics', subtitle: 'Cycle time & lane economics', icon: <BarChart3 size={16} />, to: '/' },
  { key: 'roi', label: 'ROI Calculator', subtitle: 'Prove the business case', icon: <Calculator size={16} />, to: '/' },
  { key: 'agi', label: 'AGI', subtitle: 'Models & contract', icon: <Sparkles size={16} />, to: '/' },
  { key: 'pricing', label: 'Pricing', subtitle: 'Plans & tiers', icon: <DollarSign size={16} />, to: '/' },
  { key: 'integrations', label: 'Integrations', subtitle: 'API & connectors', icon: <Layers size={16} />, to: '/connect' },
  { key: 'notifications', label: 'Notifications', subtitle: 'Activity history', icon: <Bell size={16} />, to: '/' },
];

export function SettingsPage() {
  const state = useApi('/settings', SettingsResponseSchema);
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
            Settings
          </h1>
          <p className="ft-micro mt-2 text-brand-navy/55">Team, preferences, entity management</p>
        </div>
        <div className="-mx-1 flex items-center gap-2 overflow-x-auto px-1 sm:mx-0 sm:overflow-visible sm:px-0">
          <button className="ft-pill ft-pill-ghost ft-pill-sm shrink-0">
            All Entities <ChevronDown size={12} />
          </button>
          <button className="ft-pill ft-pill-ghost ft-pill-sm shrink-0">Public tracking</button>
        </div>
      </header>

      <DataState state={state}>
        {(d) => (
          <>
            <section className="border border-brand-rule bg-brand-paper p-4">
              <h2 className="ft-eyebrow mb-3 text-brand-navy/55">More tools</h2>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {TOOL_TILES.map((t) => (
                  <Link
                    key={t.key}
                    to={t.to}
                    className="flex min-h-[64px] items-start gap-3 border border-brand-rule bg-brand-paper p-4 transition-colors hover:bg-brand-bone/60"
                  >
                    <span className="border border-brand-rule p-2 text-brand-red">{t.icon}</span>
                    <div className="min-w-0">
                      <div className="text-[14px] font-medium text-brand-navy">{t.label}</div>
                      <div className="mt-0.5 text-[12px] text-brand-navy/60">{t.subtitle}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>

            <section className="border border-brand-rule bg-brand-paper p-4">
              <header className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h2 className="ft-eyebrow text-brand-navy/55">Notification defaults</h2>
                  <p className="mt-1 text-[13px] text-brand-navy/70">
                    <span className="ft-micro mr-1 inline-block border border-brand-red/30 px-1.5 py-0.5 text-brand-red">
                      From onboarding
                    </span>{' '}
                    Applied to every new shipment automatically. Override per-shipment from the
                    Notifications panel.
                  </p>
                </div>
                <button className="ft-pill ft-pill-primary ft-pill-sm self-start sm:self-auto">
                  <Save size={12} /> Save defaults
                </button>
              </header>

              <div className="border border-brand-rule bg-brand-bone/40 p-4">
                <div className="ft-eyebrow mb-1 text-brand-navy/55">Shipping party</div>
                <p className="mb-3 text-[12px] text-brand-navy/60">Your team — origin / orchestrator</p>

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
                <div className="ft-eyebrow text-brand-navy/55">Default channels</div>
                {d.notificationDefaults.map((n) => (
                  <label
                    key={n.key}
                    className="flex min-h-[44px] items-center justify-between border border-brand-rule bg-brand-paper px-3 py-2"
                  >
                    <span className="text-[14px] text-brand-navy">{n.label}</span>
                    <input
                      type="checkbox"
                      defaultChecked={n.enabled}
                      className="h-4 w-4 accent-brand-red"
                    />
                  </label>
                ))}
              </div>
            </section>

            <section className="border border-brand-rule bg-brand-paper p-4">
              <h2 className="ft-eyebrow mb-3 text-brand-navy/55">Internal team</h2>
              <ul className="grid grid-cols-1 gap-2 md:grid-cols-2">
                {d.team.map((p) => (
                  <li
                    key={p.id}
                    className="flex flex-wrap items-center justify-between gap-2 border border-brand-rule bg-brand-bone/40 px-3 py-2"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center border border-brand-rule bg-brand-paper text-[11px] font-bold text-brand-navy">
                        {p.name.split(/\s+/).map((s) => s[0]).join('').slice(0, 2)}
                      </span>
                      <div className="min-w-0">
                        <div className="truncate text-[14px] text-brand-navy">{p.name}</div>
                        <div className="text-[11px] text-brand-navy/60">{p.role ?? '—'}</div>
                      </div>
                    </div>
                    <div className="truncate text-[11px] text-brand-navy/50">{p.email ?? ''}</div>
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
      <span className="ft-eyebrow text-brand-navy/55">{label}</span>
      <input
        defaultValue={defaultValue}
        className="border border-brand-rule bg-brand-paper px-3 py-2 text-[14px] text-brand-navy outline-none focus:border-brand-navy"
      />
    </label>
  );
}
