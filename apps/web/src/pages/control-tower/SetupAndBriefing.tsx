import { Sparkles, Calendar, ChevronRight } from 'lucide-react';
import type { BriefingItem } from '@flowtrack/shared';

export function SetupAndBriefing({ briefing }: { briefing: BriefingItem[] }) {
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
      <div className="rounded-lg border border-border-subtle bg-gradient-to-br from-blue-50 via-white to-violet-50 p-4">
        <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-blue-700">
          <Sparkles size={12} /> 5-minute setup
        </div>
        <div className="text-sm font-semibold text-text-primary">
          Finish your 5-minute setup
        </div>
        <p className="mt-1 text-xs text-text-secondary">
          Connect Maersk and your ERP to unlock automatic milestone tracking and PO sync.
        </p>
        <div className="mt-3 flex items-center gap-2">
          <button className="inline-flex items-center gap-1 rounded-md bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700">
            Continue setup <ChevronRight size={12} />
          </button>
          <span className="text-[11px] text-text-muted">4 / 28 connected</span>
        </div>
      </div>

      <div className="rounded-lg border border-border-subtle bg-surface-card p-4">
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-text-secondary">
            <Calendar size={12} /> Daily Briefing
          </div>
          <span className="text-[11px] text-text-muted">19 Apr 2026 · 9 a.m.</span>
        </div>
        <ul className="space-y-2">
          {briefing.map((b) => (
            <li key={b.id} className="border-l-2 border-blue-500 pl-3">
              <div className="text-sm font-medium text-text-primary">{b.title}</div>
              <div className="text-xs text-text-secondary">{b.body}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
