import { Sparkles, Calendar, ChevronRight } from 'lucide-react';
import type { BriefingItem } from '@flowtrack/shared';

export function SetupAndBriefing({ briefing }: { briefing: BriefingItem[] }) {
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
      <div className="border border-brand-rule bg-brand-paper p-4">
        <div className="ft-micro mb-3 flex items-center gap-2 text-brand-red">
          <Sparkles size={12} /> 5-minute setup
        </div>
        <div
          className="text-brand-navy"
          style={{
            fontFamily: 'Switzer, sans-serif',
            fontWeight: 400,
            fontSize: '18px',
            lineHeight: 1.25,
            letterSpacing: '-0.005em',
          }}
        >
          Finish your 5-minute setup
        </div>
        <p className="mt-2 text-[13px] text-brand-navy/70">
          Connect Maersk and your ERP to unlock automatic milestone tracking and PO sync.
        </p>
        <div className="mt-4 flex items-center gap-3">
          <button className="ft-pill ft-pill-primary ft-pill-sm">
            Continue setup <ChevronRight size={12} />
          </button>
          <span className="ft-micro text-brand-navy/55">4 / 28 connected</span>
        </div>
      </div>

      <div className="border border-brand-rule bg-brand-paper p-4">
        <div className="mb-3 flex items-center justify-between">
          <div className="ft-micro flex items-center gap-2 text-brand-navy">
            <Calendar size={12} /> Daily Briefing
          </div>
          <span className="ft-micro text-brand-navy/55">19 Apr 2026 · 9 a.m.</span>
        </div>
        <ul className="space-y-3">
          {briefing.map((b) => (
            <li key={b.id} className="border-l-2 border-brand-red pl-3">
              <div className="text-[14px] font-medium text-brand-navy">{b.title}</div>
              <div className="mt-0.5 text-[13px] text-brand-navy/70">{b.body}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
