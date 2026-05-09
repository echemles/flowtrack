import type { Alert } from '@flowtrack/shared';
import { ChevronRight } from 'lucide-react';
import clsx from 'clsx';

const KIND_LABEL: Record<string, string> = {
  missing_document: 'MISSING DOCUMENT',
  agi_escalation: 'AGI ESCALATION',
  invoice_variance: 'INVOICE VARIANCE',
  overdue: 'OVERDUE',
  incidence: 'INCIDENCE',
  incident: 'INCIDENT',
  reroute_approval: 'REROUTE APPROVAL',
  hs_code_reclass: 'HS CODE RECLASSIFICATION',
  sms_driver: 'SMS · DRIVER ARRIVING',
};

const KIND_COLOR: Record<string, string> = {
  missing_document: 'text-red-600',
  agi_escalation: 'text-amber-600',
  invoice_variance: 'text-orange-600',
  overdue: 'text-amber-700',
  incidence: 'text-rose-600',
  incident: 'text-rose-600',
  reroute_approval: 'text-violet-600',
  hs_code_reclass: 'text-amber-600',
  sms_driver: 'text-blue-600',
};

const SEVERITY_PILL: Record<string, string> = {
  high: 'bg-red-100 text-red-700',
  med: 'bg-amber-100 text-amber-800',
  low: 'bg-slate-100 text-slate-700',
};

const ACTION: Record<string, string> = {
  missing_document: 'Upload doc',
  agi_escalation: 'Open thread',
  invoice_variance: 'Review',
  overdue: 'Check status',
  incidence: 'Open incident',
  incident: 'Open incident',
  reroute_approval: 'Approve',
  hs_code_reclass: 'Open thread',
  sms_driver: 'Open thread',
};

export function AlertsQueue({ alerts }: { alerts: Alert[] }) {
  return (
    <div className="rounded-lg border border-border-subtle bg-surface-card">
      <div className="flex items-center justify-between border-b border-border-subtle px-4 py-2.5">
        <div className="text-xs text-text-secondary">
          <span className="font-medium text-text-primary">{alerts.length} shipments</span> require attention before EOD ·{' '}
          <span className="font-medium text-red-600">1 high-priority</span> customer impact
        </div>
      </div>
      <ul className="divide-y divide-border-subtle">
        {alerts.map((a) => {
          const kindLabel = KIND_LABEL[a.kind] ?? a.kind.toUpperCase().replace(/_/g, ' ');
          const kindColor = KIND_COLOR[a.kind] ?? 'text-text-secondary';
          const sevPill = SEVERITY_PILL[a.severity] ?? SEVERITY_PILL.low;
          const action = ACTION[a.kind] ?? 'Open';
          return (
            <li key={a.id} className="flex items-start gap-3 px-4 py-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className={clsx('text-[10px] font-bold tracking-wider', kindColor)}>
                    {kindLabel}
                  </span>
                  <span
                    className={clsx(
                      'rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase',
                      sevPill,
                    )}
                  >
                    {a.severity === 'med' ? 'MEDIUM' : a.severity === 'high' ? 'HIGH' : a.severity === 'low' ? 'CRITICAL' : a.severity}
                  </span>
                </div>
                <div className="mt-1 text-sm font-medium text-text-primary">
                  {a.shipment_ref ? (
                    <span className="text-text-primary">
                      {a.shipment_ref}
                      <span className="text-text-muted"> · </span>
                    </span>
                  ) : null}
                  {a.title}
                </div>
                <div className="mt-0.5 text-xs text-text-secondary">{a.body}</div>
              </div>
              <button
                type="button"
                className="inline-flex shrink-0 items-center gap-1 rounded-md border border-border-subtle bg-surface-card px-3 py-1.5 text-xs font-medium text-text-primary hover:bg-surface-canvas"
                onClick={() => console.info('alert action', a.kind, a.id)}
              >
                {action}
                <ChevronRight size={12} />
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
