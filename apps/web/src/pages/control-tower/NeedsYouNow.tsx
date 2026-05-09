import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Alert } from '@flowtrack/shared';
import { Sparkles, AlertTriangle, FileWarning, Loader2 } from 'lucide-react';
import { AgiBadge } from '../../components/ui/AgiBadge';
import { useToast } from '../../components/ui/Toast';

const ICON: Record<string, JSX.Element> = {
  agi_escalation: <Sparkles size={14} className="text-brand-red" />,
  missing_document: <FileWarning size={14} className="text-brand-red" />,
  invoice_variance: <AlertTriangle size={14} className="text-brand-red" />,
};

const KIND_LABEL: Record<string, string> = {
  agi_escalation: 'AGI ESCALATION',
  missing_document: 'MISSING DOCUMENT',
  invoice_variance: 'INVOICE VARIANCE',
};

const TRIAGE_SUGGESTION: Record<string, string> = {
  agi_escalation: 'Escalate to ops lead with summary thread + carrier exception log.',
  missing_document: 'Request commercial invoice from supplier; auto-attach on reply.',
  invoice_variance: 'Open dispute with carrier finance and freeze approval.',
};

export function NeedsYouNow({ items }: { items: Alert[] }) {
  const navigate = useNavigate();
  const { push } = useToast();
  const [triageId, setTriageId] = useState<string | null>(null);
  const [resolved, setResolved] = useState<Record<string, string>>({});

  function openThread(a: Alert) {
    const params = new URLSearchParams({ folder: 'agi_escalations' });
    if (a.shipment_ref) params.set('ref', a.shipment_ref);
    navigate(`/app/inbox?${params.toString()}`);
  }

  function askAgiToTriage(a: Alert) {
    setTriageId(a.id);
    push({
      kind: 'agi',
      title: `AGI triaging ${a.shipment_ref ?? 'item'}…`,
      body: 'Reading thread, checking docs, drafting next step.',
    });
    setTimeout(() => {
      const suggestion = TRIAGE_SUGGESTION[a.kind] ?? 'Reviewing context and preparing summary.';
      setResolved((cur) => ({ ...cur, [a.id]: suggestion }));
      setTriageId((cur) => (cur === a.id ? null : cur));
      push({
        kind: 'agi',
        title: 'AGI suggested action',
        body: suggestion,
      });
    }, 1500);
  }

  return (
    <section className="border border-brand-rule bg-brand-paper">
      <header className="flex items-center justify-between border-b border-brand-rule px-4 py-3">
        <div>
          <h3
            className="text-brand-navy"
            style={{
              fontFamily: 'Switzer, sans-serif',
              fontWeight: 400,
              fontSize: '18px',
              lineHeight: 1.2,
              letterSpacing: '-0.005em',
            }}
          >
            Needs you right now
          </h3>
          <p className="mt-1 ft-micro text-brand-navy/55">
            Items ranked by urgency, AGI cannot resolve.
          </p>
        </div>
        <AgiBadge label="3 escalated" />
      </header>
      <ul>
        {items.slice(0, 3).map((a) => (
          <li
            key={a.id}
            className="flex items-start gap-3 border-t border-brand-rule px-4 py-3 first:border-t-0"
          >
            <div className="mt-1 border border-brand-rule bg-brand-bone/50 p-1.5">
              {ICON[a.kind] ?? <Sparkles size={14} className="text-brand-navy" />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="ft-micro text-brand-navy/55">
                {KIND_LABEL[a.kind] ?? a.kind.toUpperCase()}
              </div>
              <div className="mt-1.5 text-[14px] font-medium text-brand-navy">
                {a.shipment_ref ? `${a.shipment_ref} · ` : ''}
                {a.title}
              </div>
              <div className="text-[13px] text-brand-navy/70">{a.body}</div>
              {resolved[a.id] ? (
                <div className="mt-2 flex items-start gap-1.5 border border-brand-rule bg-brand-bone/50 px-2 py-1.5 text-[13px] text-brand-navy">
                  <Sparkles size={12} className="mt-0.5 shrink-0 text-brand-red" />
                  <span>
                    <span className="font-semibold">AGI suggested:</span> {resolved[a.id]}
                  </span>
                </div>
              ) : null}
              <div className="mt-3 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => openThread(a)}
                  className="ft-pill ft-pill-ghost ft-pill-sm"
                >
                  Open thread
                </button>
                <button
                  type="button"
                  onClick={() => askAgiToTriage(a)}
                  disabled={triageId === a.id}
                  className="ft-pill ft-pill-primary ft-pill-sm"
                >
                  {triageId === a.id ? (
                    <>
                      <Loader2 size={10} className="animate-spin" /> Triaging…
                    </>
                  ) : (
                    <>Ask AGI to triage</>
                  )}
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
