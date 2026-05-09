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
import { SettingsResponseSchema } from '@flowtrack/shared';
import { useApi } from '../lib/useApi';
import { DataState } from '../components/ui/DataState';

const TOOL_TILES = [
  { key: 'connect', label: 'Connect', subtitle: '5-min OAuth setup', icon: <Plug size={16} /> },
  { key: 'analytics', label: 'Analytics', subtitle: 'Cycle time & lane economics', icon: <BarChart3 size={16} /> },
  { key: 'roi', label: 'ROI Calculator', subtitle: 'Prove the business case', icon: <Calculator size={16} /> },
  { key: 'agi', label: 'AGI', subtitle: 'Models & contract', icon: <Sparkles size={16} /> },
  { key: 'pricing', label: 'Pricing', subtitle: 'Plans & tiers', icon: <DollarSign size={16} /> },
  { key: 'integrations', label: 'Integrations', subtitle: 'API & connectors', icon: <Layers size={16} /> },
  { key: 'notifications', label: 'Notifications', subtitle: 'Activity history', icon: <Bell size={16} /> },
];

const inertHandler = (e: React.MouseEvent | React.FormEvent) => {
  e.preventDefault();
};

const headerBtnClass =
  'inline-flex h-9 shrink-0 items-center gap-1.5 border border-brand-navy bg-transparent px-3 text-[11px] font-bold uppercase tracking-[0.16em] text-brand-navy transition-colors hover:bg-brand-navy/[0.06] disabled:cursor-not-allowed disabled:opacity-50';

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
          <button type="button" onClick={inertHandler} className={headerBtnClass} aria-disabled="true">
            All Entities <ChevronDown size={12} />
          </button>
          <button type="button" onClick={inertHandler} className={headerBtnClass} aria-disabled="true">
            Public tracking
          </button>
        </div>
      </header>

      <DataState state={state}>
        {(d) => (
          <>
            <section className="border border-brand-rule bg-brand-paper p-4">
              <h2 className="ft-eyebrow mb-3 text-brand-navy/55">More tools</h2>
              <div className="grid grid-cols-1 gap-3 min-[480px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {TOOL_TILES.map((t) => (
                  <button
                    key={t.key}
                    type="button"
                    onClick={inertHandler}
                    aria-disabled="true"
                    className="flex min-h-[64px] w-full items-start gap-3 border border-brand-rule bg-brand-paper p-4 text-left transition-colors hover:bg-brand-bone/60"
                  >
                    <span className="border border-brand-rule p-2 text-brand-red">{t.icon}</span>
                    <div className="min-w-0">
                      <div className="text-[14px] font-medium text-brand-navy">{t.label}</div>
                      <div className="mt-0.5 text-[12px] text-brand-navy/60">{t.subtitle}</div>
                    </div>
                  </button>
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
                <button
                  type="button"
                  onClick={inertHandler}
                  aria-disabled="true"
                  className="inline-flex h-11 w-full shrink-0 items-center justify-center gap-2 border border-brand-red bg-brand-red px-4 text-[11px] font-bold uppercase tracking-[0.16em] text-white transition-colors hover:bg-[#c61f2c] hover:border-[#c61f2c] disabled:cursor-not-allowed disabled:opacity-50 sm:h-9 sm:w-auto"
                >
                  <Save size={14} /> Save defaults
                </button>
              </header>

              <form onSubmit={inertHandler} noValidate>
                <div className="border border-brand-rule bg-brand-bone/40 p-4">
                  <div className="ft-eyebrow mb-1 text-brand-navy/55">Shipping party</div>
                  <p className="mb-3 text-[12px] text-brand-navy/60">Your team — origin / orchestrator</p>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Field label="Name" defaultValue="Jordan Ellis" autoComplete="name" />
                    <Field label="Email" defaultValue="jordan@innovtex.co" type="email" autoComplete="email" />
                    <Field label="Phone (SMS)" defaultValue="+1 415 555 0010" type="tel" autoComplete="tel" />
                    <Field label="WhatsApp" defaultValue="+1 415 555 0010" type="tel" />
                    <Field label="Slack handle" defaultValue="@jordan" />
                    <Field label="Teams handle" defaultValue="jordan@innovtex.co" />
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  <div className="ft-eyebrow text-brand-navy/55">Default channels</div>
                  {d.notificationDefaults.map((n) => (
                    <label
                      key={n.key}
                      className="flex min-h-[44px] flex-col gap-2 border border-brand-rule bg-brand-paper px-3 py-2 min-[480px]:flex-row min-[480px]:items-center min-[480px]:justify-between"
                    >
                      <span className="text-[14px] text-brand-navy">{n.label}</span>
                      <input
                        type="checkbox"
                        defaultChecked={n.enabled}
                        className="h-5 w-5 accent-brand-red"
                      />
                    </label>
                  ))}
                </div>

                <div className="mt-4 sm:hidden">
                  <button
                    type="submit"
                    onClick={inertHandler}
                    aria-disabled="true"
                    className="inline-flex h-11 w-full items-center justify-center gap-2 border border-brand-red bg-brand-red px-4 text-[11px] font-bold uppercase tracking-[0.16em] text-white transition-colors hover:bg-[#c61f2c] hover:border-[#c61f2c]"
                  >
                    <Save size={14} /> Save changes
                  </button>
                </div>
              </form>
            </section>

            <section className="border border-brand-rule bg-brand-paper p-4">
              <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="ft-eyebrow text-brand-navy/55">Internal team</h2>
                <button
                  type="button"
                  onClick={inertHandler}
                  aria-disabled="true"
                  className="inline-flex h-11 w-full items-center justify-center gap-2 border border-brand-navy bg-transparent px-4 text-[11px] font-bold uppercase tracking-[0.16em] text-brand-navy transition-colors hover:bg-brand-navy/[0.06] sm:h-9 sm:w-auto"
                >
                  Invite teammate
                </button>
              </div>
              <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
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

function Field({
  label,
  defaultValue,
  type = 'text',
  autoComplete,
}: {
  label: string;
  defaultValue: string;
  type?: string;
  autoComplete?: string;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="ft-eyebrow text-brand-navy/55">{label}</span>
      <input
        type={type}
        defaultValue={defaultValue}
        autoComplete={autoComplete}
        className="h-11 w-full border border-brand-rule bg-brand-paper px-3 text-[14px] text-brand-navy outline-none transition-colors focus:border-brand-navy"
      />
    </label>
  );
}
