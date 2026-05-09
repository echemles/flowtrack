import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Activity, MapPin, Package } from 'lucide-react';
import type { ShipmentDetail } from '@flowtrack/shared';
import { ModeChip } from '../../components/ui/ModeChip';
import { StatusPill } from '../../components/ui/StatusPill';
import { AgiBadge } from '../../components/ui/AgiBadge';
import { TabStrip, type Tab } from '../../components/ui/TabStrip';
import { formatDateLong, formatMoneyCompactK, formatMoney, formatPct } from '../../lib/format';

type TabId = 'timeline' | 'skus' | 'documents' | 'financials' | 'supply' | 'po' | 'notifications';

export function ShipmentDetailLayout({ data }: { data: ShipmentDetail }) {
  const [tab, setTab] = useState<TabId>('timeline');
  const s = data.shipment;

  const tabs: Tab[] = [
    { id: 'timeline', label: 'Timeline' },
    { id: 'skus', label: 'SKUs', count: data.skus.length },
    { id: 'documents', label: 'Documents', count: data.documents.length },
    { id: 'financials', label: 'Financials' },
    { id: 'supply', label: 'Supply Chain', count: data.supplyChain.length },
    {
      id: 'po',
      label: 'Purchase Order',
      count: data.purchaseOrder?.row.lines_count ?? 0,
    },
    { id: 'notifications', label: 'Notifications', count: data.notifications.length },
  ];

  return (
    <div className="space-y-4">
      <header className="rounded-lg border border-border-subtle bg-surface-card p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-xs font-medium text-text-secondary">
              <span className="rounded-md bg-blue-50 p-1.5 text-blue-600">
                <Package size={14} />
              </span>
              <span className="text-base font-semibold text-text-primary">{s.ref}</span>
              <StatusPill status={s.status} />
            </div>
            <div className="mt-2 text-lg font-semibold text-text-primary">
              {s.origin_city}, {s.origin_country}{' '}
              <span className="mx-1 text-text-muted">→</span>
              {s.dest_city}, {s.dest_country}
            </div>
            <div className="mt-1 flex items-center gap-2 text-xs text-text-secondary">
              <span>{s.client}</span>
              <span className="text-text-muted">·</span>
              <span>FOB · via {s.carrier}</span>
              <span className="rounded-md bg-blue-50 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-blue-700">
                Outbound
              </span>
              {data.purchaseOrder ? (
                <>
                  <span className="text-text-muted">·</span>
                  <span>{data.purchaseOrder.row.number}</span>
                </>
              ) : null}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ModeChip mode={s.mode} />
            <Link
              to="/live"
              className="inline-flex items-center gap-1.5 rounded-md border border-border-subtle bg-surface-card px-3 py-1.5 text-xs font-medium text-text-primary hover:bg-surface-canvas"
            >
              <MapPin size={12} /> Track live
            </Link>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <KeyVal label="ATD" value={formatDateLong(s.atd)} />
          <KeyVal
            label="ETA"
            value={formatDateLong(s.eta_agi)}
            subtitle={
              s.eta_carrier
                ? `Predicted: ${formatDateLong(s.eta_carrier)} (carrier)`
                : undefined
            }
            icon={<AgiBadge label="AGI" />}
          />
          <KeyVal label="ATA" value="—" />
          <KeyVal label="Cargo Value" value={formatMoneyCompactK(s.value_minor, s.currency)} />
        </div>

        <div className="mt-4">
          <ProgressBar pct={s.percent_complete} />
        </div>
      </header>

      <div className="rounded-lg border border-border-subtle bg-surface-card">
        <div className="px-4">
          <TabStrip
            tabs={tabs}
            activeId={tab}
            onChange={(id) => setTab(id as TabId)}
          />
        </div>
        <div className="p-4">
          {tab === 'timeline' && <TimelineTab data={data} />}
          {tab === 'skus' && <SkusTab data={data} />}
          {tab === 'documents' && <DocumentsTab data={data} />}
          {tab === 'financials' && <FinancialsTab data={data} />}
          {tab === 'supply' && <SupplyChainTab data={data} />}
          {tab === 'po' && <PoTab data={data} />}
          {tab === 'notifications' && <NotificationsTab data={data} />}
        </div>
      </div>
    </div>
  );
}

function KeyVal({
  label,
  value,
  subtitle,
  icon,
}: {
  label: string;
  value: string;
  subtitle?: string;
  icon?: React.ReactNode;
}) {
  return (
    <div>
      <div className="text-[11px] font-bold uppercase tracking-wider text-text-secondary">
        {label}
      </div>
      <div className="mt-0.5 flex items-center gap-1.5 text-sm font-semibold text-text-primary">
        {icon}
        {value}
      </div>
      {subtitle ? (
        <div className="text-[11px] text-text-muted">{subtitle}</div>
      ) : null}
    </div>
  );
}

function ProgressBar({ pct }: { pct: number }) {
  return (
    <div className="space-y-1">
      <div className="h-1.5 overflow-hidden rounded-full bg-surface-canvas">
        <div className="h-full bg-blue-500" style={{ width: `${pct}%` }} />
      </div>
      <div className="text-[11px] text-text-muted">{pct}%</div>
    </div>
  );
}

function TimelineTab({ data }: { data: ShipmentDetail }) {
  return (
    <ul className="space-y-3">
      {data.timeline.map((m) => (
        <li key={m.id} className="flex items-start gap-3">
          <span
            className={
              m.status === 'done'
                ? 'mt-1 h-5 w-5 shrink-0 rounded-full bg-text-primary text-white flex items-center justify-center text-[12px]'
                : m.status === 'active'
                  ? 'mt-1 h-5 w-5 shrink-0 rounded-full bg-blue-600 text-white flex items-center justify-center text-[12px]'
                  : 'mt-1 h-5 w-5 shrink-0 rounded-full border border-border-subtle bg-surface-canvas'
            }
          >
            {m.status === 'done' ? '✓' : m.status === 'active' ? '●' : ''}
          </span>
          <div>
            <div className="text-sm font-medium text-text-primary">{m.label}</div>
            <div className="text-xs text-text-muted">
              {m.at ? `${formatDateLong(m.at)} · 02:00` : 'Pending'}
              {m.status === 'active' ? (
                <span className="ml-2 text-blue-600">● Current</span>
              ) : null}
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}

function SkusTab({ data }: { data: ShipmentDetail }) {
  if (data.skus.length === 0) return <Empty>No SKUs declared.</Empty>;
  return (
    <table className="w-full text-left text-sm">
      <thead className="text-[11px] font-bold uppercase tracking-wider text-text-muted">
        <tr>
          <th className="px-2 py-2">SKU</th>
          <th className="px-2 py-2">Description</th>
          <th className="px-2 py-2 text-right">Qty</th>
          <th className="px-2 py-2 text-right">Weight (kg)</th>
        </tr>
      </thead>
      <tbody>
        {data.skus.map((sku) => (
          <tr key={sku.id} className="border-t border-border-subtle">
            <td className="px-2 py-2 font-medium">{sku.sku}</td>
            <td className="px-2 py-2 text-text-secondary">{sku.description}</td>
            <td className="px-2 py-2 text-right">{sku.qty.toLocaleString()}</td>
            <td className="px-2 py-2 text-right">{sku.weight_kg.toLocaleString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function DocumentsTab({ data }: { data: ShipmentDetail }) {
  if (data.documents.length === 0) return <Empty>No documents uploaded.</Empty>;
  return (
    <ul className="space-y-2">
      {data.documents.map((d) => (
        <li
          key={d.id}
          className="flex items-center justify-between rounded-md border border-border-subtle bg-surface-canvas px-3 py-2"
        >
          <div className="flex items-center gap-2 text-sm">
            <Activity size={14} className="text-text-muted" />
            {d.kind}
          </div>
          <StatusPill status={d.status} />
        </li>
      ))}
    </ul>
  );
}

function FinancialsTab({ data }: { data: ShipmentDetail }) {
  const f = data.financials;
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      <Stat label="Cargo Value" value={formatMoney(f.value_minor, f.currency, { cents: false })} />
      <Stat
        label="Committed"
        value={f.committed_minor != null ? formatMoney(f.committed_minor, f.currency, { cents: false }) : '—'}
      />
      <Stat
        label="Billed"
        value={f.billed_minor != null ? formatMoney(f.billed_minor, f.currency, { cents: false }) : '—'}
      />
      <Stat
        label="Variance"
        value={f.variance_minor != null ? formatMoney(f.variance_minor, f.currency, { cents: false }) : '—'}
        valueClassName={f.variance_minor && f.variance_minor < 0 ? 'text-red-600' : 'text-emerald-700'}
      />
    </div>
  );
}

function SupplyChainTab({ data }: { data: ShipmentDetail }) {
  if (data.supplyChain.length === 0) return <Empty>No supply chain data.</Empty>;
  const avg =
    data.supplyChain.reduce((a, b) => a + b.on_time_pct, 0) / data.supplyChain.length;
  const weakest = data.supplyChain.reduce((min, leg) =>
    leg.on_time_pct < min.on_time_pct ? leg : min,
    data.supplyChain[0],
  );
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Stat label="Providers in chain" value={data.supplyChain.length.toString()} />
        <Stat label="Logistics cost" value="$1,500" />
        <Stat label="Chain on-time avg" value={formatPct(avg)} valueClassName="text-emerald-700" />
        <Stat
          label="Weakest link"
          value={weakest.provider}
          subtitle={`${formatPct(weakest.on_time_pct)} on-time`}
        />
      </div>

      <div>
        <div className="mb-2 text-[11px] font-bold uppercase tracking-wider text-text-secondary">
          Handoff chain · {data.supplyChain.length} providers
        </div>
        <ul className="space-y-2">
          {data.supplyChain.map((l) => (
            <li
              key={l.id}
              className="flex items-center justify-between rounded-md border border-border-subtle bg-surface-canvas px-3 py-3"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-surface-card text-xs font-bold text-text-secondary ring-1 ring-border-subtle">
                  {l.ord}
                </span>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-text-secondary">
                    {l.role}
                  </div>
                  <div className="text-sm font-medium text-text-primary">{l.provider}</div>
                </div>
              </div>
              <div className="text-xs">
                <span
                  className={
                    l.on_time_pct >= 90
                      ? 'text-emerald-700'
                      : l.on_time_pct >= 80
                        ? 'text-amber-700'
                        : 'text-red-600'
                  }
                >
                  {formatPct(l.on_time_pct)} on-time
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function PoTab({ data }: { data: ShipmentDetail }) {
  if (!data.purchaseOrder) return <Empty>No PO linked to this shipment.</Empty>;
  const po = data.purchaseOrder;
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Stat label="PO number" value={po.row.number} />
        <Stat label="Provider" value={po.row.provider ?? '—'} />
        <Stat label="Committed" value={formatMoney(po.row.committed_minor, po.row.currency, { cents: false })} />
        <Stat
          label="Variance"
          value={formatMoney(po.row.variance_minor, po.row.currency, { cents: false })}
          valueClassName={po.row.variance_minor < 0 ? 'text-red-600' : 'text-emerald-700'}
        />
      </div>
      <table className="w-full text-left text-sm">
        <thead className="text-[11px] font-bold uppercase tracking-wider text-text-muted">
          <tr>
            <th className="px-2 py-2">#</th>
            <th className="px-2 py-2">Description</th>
            <th className="px-2 py-2 text-right">Qty</th>
            <th className="px-2 py-2 text-right">Unit price</th>
          </tr>
        </thead>
        <tbody>
          {po.lines.map((l) => (
            <tr key={l.id} className="border-t border-border-subtle">
              <td className="px-2 py-2">{l.ord}</td>
              <td className="px-2 py-2 text-text-secondary">{l.description}</td>
              <td className="px-2 py-2 text-right">{l.qty.toLocaleString()}</td>
              <td className="px-2 py-2 text-right">{formatMoney(l.unit_price_minor, po.row.currency, { cents: false })}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function NotificationsTab({ data }: { data: ShipmentDetail }) {
  if (data.notifications.length === 0)
    return <Empty>No notifications yet on this shipment.</Empty>;
  return (
    <ul className="space-y-2">
      {data.notifications.map((n) => (
        <li key={n.id} className="rounded-md border border-border-subtle bg-surface-canvas px-3 py-2 text-sm">
          {n.title}
        </li>
      ))}
    </ul>
  );
}

function Stat({
  label,
  value,
  subtitle,
  valueClassName,
}: {
  label: string;
  value: string;
  subtitle?: string;
  valueClassName?: string;
}) {
  return (
    <div className="rounded-md border border-border-subtle bg-surface-canvas p-3">
      <div className="text-[11px] font-bold uppercase tracking-wider text-text-secondary">
        {label}
      </div>
      <div className={`mt-1 text-base font-semibold text-text-primary ${valueClassName ?? ''}`}>
        {value}
      </div>
      {subtitle ? (
        <div className="text-[11px] text-text-muted">{subtitle}</div>
      ) : null}
    </div>
  );
}

function Empty({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-md border border-dashed border-border-subtle px-3 py-8 text-center text-xs text-text-muted">
      {children}
    </div>
  );
}
