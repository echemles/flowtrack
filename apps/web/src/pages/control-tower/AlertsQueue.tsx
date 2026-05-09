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

// Alert kinds map to a tone: red = urgent/incident, navy = informational/approval.
const KIND_TONE: Record<string, 'red' | 'navy'> = {
  missing_document: 'red',
  agi_escalation: 'red',
  invoice_variance: 'red',
  overdue: 'red',
  incidence: 'red',
  incident: 'red',
  reroute_approval: 'navy',
  hs_code_reclass: 'navy',
  sms_driver: 'navy',
};

const SEVERITY_LABEL: Record<string, string> = {
  high: 'HIGH',
  med: 'MEDIUM',
  low: 'CRITICAL',
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
    <div className="border border-brand-rule bg-brand-paper">
      <div className="flex items-center justify-between border-b border-brand-rule px-4 py-3">
        <div className="text-[13px] text-brand-navy/70">
          <span className="font-medium text-brand-navy">{alerts.length} shipments</span> require attention before EOD ·{' '}
          <span className="font-medium text-brand-red">1 high-priority</span> customer impact
        </div>
      </div>
      <ul>
        {alerts.map((a) => {
          const kindLabel = KIND_LABEL[a.kind] ?? a.kind.toUpperCase().replace(/_/g, ' ');
          const tone = KIND_TONE[a.kind] ?? 'navy';
          const sevLabel = SEVERITY_LABEL[a.severity] ?? a.severity.toUpperCase();
          const action = ACTION[a.kind] ?? 'Open';
          return (
            <li
              key={a.id}
              className="flex flex-col gap-3 border-t border-brand-rule px-4 py-3 first:border-t-0 sm:flex-row sm:items-start"
            >
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={clsx(
                      'ft-micro',
                      tone === 'red' ? 'text-brand-red' : 'text-brand-navy',
                    )}
                  >
                    {kindLabel}
                  </span>
                  <span
                    className={clsx(
                      'ft-micro inline-flex items-center border px-2 py-0.5',
                      a.severity === 'high'
                        ? 'border-brand-red/30 text-brand-red'
                        : a.severity === 'med'
                          ? 'border-brand-navy/20 text-brand-navy'
                          : 'border-brand-rule text-brand-navy/55',
                    )}
                  >
                    {sevLabel}
                  </span>
                </div>
                <div className="mt-1.5 text-[14px] text-brand-navy">
                  {a.shipment_ref ? (
                    <span>
                      <span className="font-medium">{a.shipment_ref}</span>
                      <span className="text-brand-navy/40"> · </span>
                    </span>
                  ) : null}
                  {a.title}
                </div>
                <div className="mt-0.5 text-[13px] text-brand-navy/70">{a.body}</div>
              </div>
              <button
                type="button"
                className="ft-pill ft-pill-ghost ft-pill-sm w-full min-h-[44px] sm:w-auto sm:min-h-0 sm:shrink-0"
                onClick={(e) => e.preventDefault()}
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
