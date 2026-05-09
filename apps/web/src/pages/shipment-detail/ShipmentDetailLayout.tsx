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
      <header className="border border-brand-rule bg-brand-paper p-4 sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2 text-[12px] text-brand-navy/70">
              <span className="border border-brand-rule p-1.5 text-brand-red">
                <Package size={14} />
              </span>
              <span className="text-[16px] font-medium text-brand-navy">{s.ref}</span>
              <StatusPill status={s.status} />
            </div>
            <div className="mt-2 flex flex-wrap items-baseline gap-x-2 gap-y-1 text-[18px] font-medium text-brand-navy sm:text-[20px]">
              <span>{s.origin_city}, {s.origin_country}</span>
              <span className="text-brand-navy/40">→</span>
              <span>{s.dest_city}, {s.dest_country}</span>
            </div>
            <div className="mt-1 flex flex-wrap items-center gap-2 text-[12px] text-brand-navy/70">
              <span>{s.client}</span>
              <span className="text-brand-navy/40">·</span>
              <span>FOB · via {s.carrier}</span>
              <span className="ft-micro inline-flex items-center border border-brand-rule px-2 py-0.5 text-brand-navy">
                Outbound
              </span>
              {data.purchaseOrder ? (
                <>
                  <span className="text-brand-navy/40">·</span>
                  <span>{data.purchaseOrder.row.number}</span>
                </>
              ) : null}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ModeChip mode={s.mode} />
            <Link to="/app/live" className="ft-pill ft-pill-ghost ft-pill-sm">
              <MapPin size={12} /> Track live
            </Link>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3 min-[480px]:grid-cols-2 min-[480px]:gap-4 lg:grid-cols-4">
          <KeyVal label="ATD" value={formatDateLong(s.atd)} />
          <KeyVal
            label="ETA"
            value={formatDateLong(s.eta_agi)}
            subtitle={
              s.eta_carrier ? `Predicted: ${formatDateLong(s.eta_carrier)} (carrier)` : undefined
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

      <div className="border border-brand-rule bg-brand-paper">
        <div className="overflow-x-auto px-3 sm:px-4">
          <TabStrip tabs={tabs} activeId={tab} onChange={(id) => setTab(id as TabId)} />
        </div>
        <div className="p-3 sm:p-4">
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
      <div className="ft-eyebrow text-brand-navy/55">{label}</div>
      <div className="mt-1 flex items-center gap-1.5 text-[14px] font-medium text-brand-navy">
        {icon}
        {value}
      </div>
      {subtitle ? <div className="text-[11px] text-brand-navy/50">{subtitle}</div> : null}
    </div>
  );
}

function ProgressBar({ pct }: { pct: number }) {
  return (
    <div className="space-y-1">
      <div className="h-1 overflow-hidden bg-brand-bone">
        <div className="h-full bg-brand-navy" style={{ width: `${pct}%` }} />
      </div>
      <div className="ft-micro text-brand-navy/55">{pct}%</div>
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
                ? 'mt-1 flex h-5 w-5 shrink-0 items-center justify-center bg-brand-navy text-[12px] text-brand-paper'
                : m.status === 'active'
                  ? 'mt-1 flex h-5 w-5 shrink-0 items-center justify-center bg-brand-red text-[12px] text-brand-paper'
                  : 'mt-1 h-5 w-5 shrink-0 border border-brand-rule bg-brand-paper'
            }
          >
            {m.status === 'done' ? '✓' : m.status === 'active' ? '●' : ''}
          </span>
          <div>
            <div className="text-[14px] font-medium text-brand-navy">{m.label}</div>
            <div className="text-[12px] text-brand-navy/55">
              {m.at ? `${formatDateLong(m.at)} · 02:00` : 'Pending'}
              {m.status === 'active' ? (
                <span className="ml-2 text-brand-red">● Current</span>
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
    <div className="overflow-x-auto">
      <table className="w-full min-w-[480px] text-left text-[14px]">
        <thead>
          <tr className="border-b border-brand-rule">
            <th className="ft-eyebrow px-2 py-2 text-brand-navy/55">SKU</th>
            <th className="ft-eyebrow px-2 py-2 text-brand-navy/55">Description</th>
            <th className="ft-eyebrow px-2 py-2 text-right text-brand-navy/55">Qty</th>
            <th className="ft-eyebrow px-2 py-2 text-right text-brand-navy/55">Weight (kg)</th>
          </tr>
        </thead>
        <tbody>
          {data.skus.map((sku) => (
            <tr key={sku.id} className="border-b border-brand-rule last:border-0">
              <td className="px-2 py-2 font-medium text-brand-navy">{sku.sku}</td>
              <td className="px-2 py-2 text-brand-navy/70">{sku.description}</td>
              <td className="px-2 py-2 text-right tabular-nums">{sku.qty.toLocaleString()}</td>
              <td className="px-2 py-2 text-right tabular-nums">{sku.weight_kg.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function DocumentsTab({ data }: { data: ShipmentDetail }) {
  if (data.documents.length === 0) return <Empty>No documents uploaded.</Empty>;
  return (
    <ul className="space-y-2">
      {data.documents.map((d) => (
        <li
          key={d.id}
          className="flex items-center justify-between gap-2 border border-brand-rule bg-brand-bone/40 px-3 py-2"
        >
          <div className="flex min-w-0 items-center gap-2 text-[14px] text-brand-navy">
            <Activity size={14} className="text-brand-navy/55" />
            <span className="truncate">{d.kind}</span>
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
    <div className="grid grid-cols-1 gap-3 min-[480px]:grid-cols-2 md:grid-cols-4">
      <Stat label="Cargo Value" value={formatMoney(f.value_minor, f.currency, { cents: false })} />
      <Stat
        label="Committed"
        value={
          f.committed_minor != null
            ? formatMoney(f.committed_minor, f.currency, { cents: false })
            : '—'
        }
      />
      <Stat
        label="Billed"
        value={
          f.billed_minor != null ? formatMoney(f.billed_minor, f.currency, { cents: false }) : '—'
        }
      />
      <Stat
        label="Variance"
        value={
          f.variance_minor != null
            ? formatMoney(f.variance_minor, f.currency, { cents: false })
            : '—'
        }
        valueClassName={
          f.variance_minor && f.variance_minor < 0 ? 'text-brand-red' : 'text-brand-navy'
        }
      />
    </div>
  );
}

function SupplyChainTab({ data }: { data: ShipmentDetail }) {
  if (data.supplyChain.length === 0) return <Empty>No supply chain data.</Empty>;
  const avg =
    data.supplyChain.reduce((a, b) => a + b.on_time_pct, 0) / data.supplyChain.length;
  const weakest = data.supplyChain.reduce(
    (min, leg) => (leg.on_time_pct < min.on_time_pct ? leg : min),
    data.supplyChain[0],
  );
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3 min-[480px]:grid-cols-2 md:grid-cols-4">
        <Stat label="Providers in chain" value={data.supplyChain.length.toString()} />
        <Stat label="Logistics cost" value="$1,500" />
        <Stat label="Chain on-time avg" value={formatPct(avg)} valueClassName="text-brand-navy" />
        <Stat
          label="Weakest link"
          value={weakest.provider}
          subtitle={`${formatPct(weakest.on_time_pct)} on-time`}
        />
      </div>

      <div>
        <div className="ft-eyebrow mb-2 text-brand-navy/55">
          Handoff chain · {data.supplyChain.length} providers
        </div>
        <ul className="space-y-2">
          {data.supplyChain.map((l) => (
            <li
              key={l.id}
              className="flex flex-wrap items-center justify-between gap-2 border border-brand-rule bg-brand-bone/40 px-3 py-3"
            >
              <div className="flex min-w-0 items-center gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center border border-brand-rule bg-brand-paper text-[12px] font-bold text-brand-navy/70">
                  {l.ord}
                </span>
                <div className="min-w-0">
                  <div className="ft-micro text-brand-navy/55">{l.role}</div>
                  <div className="truncate text-[14px] font-medium text-brand-navy">
                    {l.provider}
                  </div>
                </div>
              </div>
              <div className="text-[12px]">
                <span
                  className={
                    l.on_time_pct >= 90
                      ? 'text-brand-navy'
                      : l.on_time_pct >= 80
                        ? 'text-brand-navy/55'
                        : 'text-brand-red'
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
      <div className="grid grid-cols-1 gap-3 min-[480px]:grid-cols-2 md:grid-cols-4">
        <Stat label="PO number" value={po.row.number} />
        <Stat label="Provider" value={po.row.provider ?? '—'} />
        <Stat
          label="Committed"
          value={formatMoney(po.row.committed_minor, po.row.currency, { cents: false })}
        />
        <Stat
          label="Variance"
          value={formatMoney(po.row.variance_minor, po.row.currency, { cents: false })}
          valueClassName={po.row.variance_minor < 0 ? 'text-brand-red' : 'text-brand-navy'}
        />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[480px] text-left text-[14px]">
          <thead>
            <tr className="border-b border-brand-rule">
              <th className="ft-eyebrow px-2 py-2 text-brand-navy/55">#</th>
              <th className="ft-eyebrow px-2 py-2 text-brand-navy/55">Description</th>
              <th className="ft-eyebrow px-2 py-2 text-right text-brand-navy/55">Qty</th>
              <th className="ft-eyebrow px-2 py-2 text-right text-brand-navy/55">Unit price</th>
            </tr>
          </thead>
          <tbody>
            {po.lines.map((l) => (
              <tr key={l.id} className="border-b border-brand-rule last:border-0">
                <td className="px-2 py-2">{l.ord}</td>
                <td className="px-2 py-2 text-brand-navy/70">{l.description}</td>
                <td className="px-2 py-2 text-right tabular-nums">{l.qty.toLocaleString()}</td>
                <td className="px-2 py-2 text-right tabular-nums">
                  {formatMoney(l.unit_price_minor, po.row.currency, { cents: false })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function NotificationsTab({ data }: { data: ShipmentDetail }) {
  if (data.notifications.length === 0)
    return <Empty>No notifications yet on this shipment.</Empty>;
  return (
    <ul className="space-y-2">
      {data.notifications.map((n) => (
        <li
          key={n.id}
          className="border border-brand-rule bg-brand-bone/40 px-3 py-2 text-[14px] text-brand-navy"
        >
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
    <div className="border border-brand-rule bg-brand-bone/40 p-3">
      <div className="ft-eyebrow text-brand-navy/55">{label}</div>
      <div className={`mt-1 text-[16px] font-medium text-brand-navy ${valueClassName ?? ''}`}>
        {value}
      </div>
      {subtitle ? <div className="text-[11px] text-brand-navy/50">{subtitle}</div> : null}
    </div>
  );
}

function Empty({ children }: { children: React.ReactNode }) {
  return (
    <div className="border border-dashed border-brand-rule px-3 py-8 text-center text-[12px] text-brand-navy/55">
      {children}
    </div>
  );
}
