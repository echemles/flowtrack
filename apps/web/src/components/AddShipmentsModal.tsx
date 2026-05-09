import { useEffect, useMemo, useRef, useState } from 'react';
import {
  X,
  Plus,
  Sparkles,
  CheckCircle2,
  FileWarning,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { ShipmentsCheckResponseSchema } from '@flowtrack/shared';
import { api } from '../lib/apiClient';
import { useToast } from './ui/Toast';

type Phase = 'input' | 'processing' | 'results';

type Results = {
  matched: string[];
  missingDocs: string[];
  notFound: string[];
};

const MAX_REFS = 40;
const PROCESSING_MIN_MS = 1100;

function parseRefs(text: string): string[] {
  return Array.from(
    new Set(
      text
        .split(/[\r\n,]+/)
        .map((t) => t.trim())
        .filter(Boolean),
    ),
  ).slice(0, MAX_REFS);
}

export function AddShipmentsModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [phase, setPhase] = useState<Phase>('input');
  const [text, setText] = useState('');
  const [results, setResults] = useState<Results | null>(null);
  const [error, setError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const { push } = useToast();

  const refs = useMemo(() => parseRefs(text), [text]);
  const refCount = refs.length;
  const canSubmit = refCount > 0 && phase === 'input';

  // reset when reopened
  useEffect(() => {
    if (open) {
      setPhase('input');
      setText('');
      setResults(null);
      setError(null);
      setTimeout(() => textareaRef.current?.focus(), 30);
      // smoke-screenshot affordance: pre-fill refs from ?refs= and optionally auto-submit
      if (typeof window !== 'undefined') {
        const sp = new URLSearchParams(window.location.search);
        const refsParam = sp.get('refs');
        if (refsParam) {
          const seeded = refsParam.split(',').map((r) => r.trim()).filter(Boolean).join('\n');
          setText(seeded);
          if (sp.get('autosubmit') === '1') {
            setTimeout(() => {
              // trigger after state flushes — submit reads `refs` via parseRefs
              document
                .querySelector<HTMLButtonElement>('[data-action="check-shipments"]')
                ?.click();
            }, 50);
          }
        }
      }
    }
  }, [open]);

  // close on escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && phase !== 'processing') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, phase, onClose]);

  if (!open) return null;

  async function submit() {
    if (!canSubmit) return;
    setPhase('processing');
    setError(null);
    const startedAt = Date.now();
    try {
      const res = await api.post('/shipments/check', { refs }, ShipmentsCheckResponseSchema);
      const elapsed = Date.now() - startedAt;
      const wait = Math.max(0, PROCESSING_MIN_MS - elapsed);
      setTimeout(() => {
        setResults(res);
        setPhase('results');
      }, wait);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to check shipments');
      setPhase('input');
    }
  }

  const matched = results?.matched ?? [];
  const missingDocs = results?.missingDocs ?? [];
  const notFound = results?.notFound ?? [];

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-brand-ink/40 p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && phase !== 'processing') onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-shipments-title"
    >
      <div className="flex w-full max-w-[560px] flex-col overflow-hidden border border-brand-rule bg-brand-paper">
        <header className="flex items-start justify-between gap-3 border-b border-brand-rule px-5 py-4">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 items-center justify-center bg-brand-ink text-brand-paper">
              <Plus size={16} />
            </div>
            <div>
              <h2
                id="add-shipments-title"
                className="ft-eyebrow text-brand-navy"
              >
                Add shipments
              </h2>
              <p className="mt-1.5 text-[12px] text-brand-navy/65">
                {phase === 'input'
                  ? `Enter up to ${MAX_REFS} reference numbers, one per line`
                  : phase === 'processing'
                    ? 'AGI matching references and checking documents…'
                    : `${matched.length} matched · ${missingDocs.length} missing docs · ${notFound.length} not found`}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={phase === 'processing'}
            className="p-1 text-brand-navy/45 hover:bg-brand-bone hover:text-brand-navy disabled:opacity-40"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </header>

        {phase === 'input' && (
          <div className="flex flex-col gap-4 px-5 py-5">
            <div className="relative border border-brand-rule bg-brand-bone focus-within:border-brand-red">
              <textarea
                ref={textareaRef}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={'FT-26-S891\nFT-26-A103\nMAEU8472913\n…'}
                rows={9}
                className="block w-full resize-none bg-transparent px-3 py-2.5 font-mono text-xs leading-relaxed text-brand-navy outline-none placeholder:text-brand-navy/35"
                spellCheck={false}
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-brand-navy/65">
              <span>
                {refCount} / {MAX_REFS}
              </span>
              <span className="text-brand-navy/50">
                Accepts FlowTrack refs (FT-26-…), tracking numbers, or container IDs
              </span>
            </div>
            <div className="flex items-start gap-2 border border-brand-navy/20 bg-brand-bone px-3 py-2 text-xs text-brand-navy">
              <Sparkles size={14} className="mt-0.5 shrink-0 text-brand-red" />
              <p>
                <span className="font-semibold">On confirm, FlowTrack will</span> match each number
                to a shipment profile, check required documents, and surface anything that needs
                you.
              </p>
            </div>
            {error ? (
              <div className="border border-brand-red/30 bg-brand-red/5 px-3 py-2 text-xs text-brand-red">
                {error}
              </div>
            ) : null}
          </div>
        )}

        {phase === 'processing' && (
          <div className="flex flex-col items-center justify-center gap-3 px-5 py-10">
            <div className="flex h-14 w-14 items-center justify-center border border-brand-rule bg-brand-bone">
              <Sparkles size={26} className="text-brand-red" />
            </div>
            <div className="ft-eyebrow text-brand-navy">Checking documents…</div>
            <div className="text-xs text-brand-navy/65">
              Matching {refCount} references · verifying doc completeness · preparing notifications
            </div>
            <div className="mt-1 flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 animate-bounce bg-brand-red [animation-delay:-0.2s]" />
              <span className="h-1.5 w-1.5 animate-bounce bg-brand-red [animation-delay:-0.1s]" />
              <span className="h-1.5 w-1.5 animate-bounce bg-brand-red" />
            </div>
          </div>
        )}

        {phase === 'results' && results && (
          <div className="flex flex-col gap-3 px-5 py-5">
            <div className="grid grid-cols-3 gap-2 text-xs">
              <ResultStat
                icon={<CheckCircle2 size={14} className="text-brand-navy" />}
                label={`${matched.length} matched`}
              />
              <ResultStat
                icon={<FileWarning size={14} className="text-brand-red" />}
                label={`${missingDocs.length} missing docs`}
              />
              <ResultStat
                icon={<AlertCircle size={14} className="text-brand-red" />}
                label={`${notFound.length} not found`}
              />
            </div>

            <div className="max-h-[260px] overflow-y-auto border border-brand-rule">
              <ResultGroup
                title="Matched"
                kind="matched"
                refs={matched}
                emptyHint="No clean matches in this batch."
              />
              <ResultGroup
                title="Missing docs"
                kind="missingDocs"
                refs={missingDocs}
                emptyHint="No shipments need new documents."
              />
              <ResultGroup
                title="Not found"
                kind="notFound"
                refs={notFound}
                emptyHint="Every reference matched a known shipment."
                onCreate={(ref) => {
                  push({
                    kind: 'success',
                    title: 'New shipment draft started',
                    body: `${ref} queued for setup.`,
                  });
                }}
              />
            </div>
          </div>
        )}

        <footer className="flex items-center justify-end gap-2 border-t border-brand-rule bg-brand-bone px-5 py-3">
          {phase === 'input' && (
            <>
              <button
                type="button"
                onClick={onClose}
                className="ft-eyebrow border border-brand-navy bg-transparent px-3 py-1.5 text-brand-navy transition-colors hover:bg-brand-navy/5"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={submit}
                disabled={!canSubmit}
                data-action="check-shipments"
                className="ft-eyebrow inline-flex items-center gap-1.5 border border-brand-red bg-brand-red px-3 py-1.5 text-brand-paper transition-colors hover:bg-brand-redInk hover:border-brand-redInk disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <CheckCircle2 size={12} /> Check shipments
              </button>
            </>
          )}
          {phase === 'processing' && (
            <button
              type="button"
              disabled
              className="ft-eyebrow inline-flex items-center gap-1.5 border border-brand-red bg-brand-red px-3 py-1.5 text-brand-paper opacity-60"
            >
              <Loader2 size={12} className="animate-spin" /> Processing…
            </button>
          )}
          {phase === 'results' && (
            <>
              <button
                type="button"
                onClick={() => {
                  setPhase('input');
                  setResults(null);
                }}
                className="ft-eyebrow inline-flex items-center gap-1.5 border border-brand-navy bg-transparent px-3 py-1.5 text-brand-navy transition-colors hover:bg-brand-navy/5"
              >
                <Plus size={12} /> Add more
              </button>
              <button
                type="button"
                onClick={onClose}
                className="ft-eyebrow border border-brand-red bg-brand-red px-4 py-1.5 text-brand-paper transition-colors hover:bg-brand-redInk hover:border-brand-redInk"
              >
                Done
              </button>
            </>
          )}
        </footer>
      </div>
    </div>
  );
}

function ResultStat({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-1.5 border border-brand-rule bg-brand-bone px-2.5 py-1.5">
      {icon}
      <span className="text-xs font-medium text-brand-navy">{label}</span>
    </div>
  );
}

function ResultGroup({
  title,
  kind,
  refs,
  emptyHint,
  onCreate,
}: {
  title: string;
  kind: 'matched' | 'missingDocs' | 'notFound';
  refs: string[];
  emptyHint: string;
  onCreate?: (ref: string) => void;
}) {
  const dotClass =
    kind === 'matched'
      ? 'h-1.5 w-1.5 bg-brand-navy'
      : kind === 'missingDocs'
        ? 'h-1.5 w-1.5 bg-brand-red'
        : 'h-1.5 w-1.5 bg-brand-red';

  const tagClass =
    kind === 'matched'
      ? 'ft-micro border border-brand-navy/25 bg-brand-paper px-1.5 py-0.5 text-brand-navy'
      : 'ft-micro border border-brand-red/35 bg-brand-paper px-1.5 py-0.5 text-brand-red';

  if (refs.length === 0) {
    return (
      <div className="border-b border-brand-rule px-3 py-2.5 text-[11px] text-brand-navy/55 last:border-b-0">
        <span className="ft-micro text-brand-navy/65">{title}</span>{' '}
        <span>· {emptyHint}</span>
      </div>
    );
  }
  return (
    <div className="border-b border-brand-rule last:border-b-0">
      <div className="ft-micro bg-brand-bone px-3 py-1.5 text-brand-navy/65">
        {title} · {refs.length}
      </div>
      <ul className="divide-y divide-brand-rule">
        {refs.map((ref) => (
          <li key={ref} className="flex items-center justify-between gap-2 px-3 py-2">
            <div className="flex items-center gap-2">
              <span className={dotClass} />
              <span className="font-mono text-xs text-brand-navy">{ref}</span>
              <span className={tagClass}>
                {kind === 'matched'
                  ? 'MATCHED'
                  : kind === 'missingDocs'
                    ? 'MISSING DOCS'
                    : 'NOT FOUND'}
              </span>
            </div>
            {kind === 'notFound' && onCreate ? (
              <button
                type="button"
                onClick={() => onCreate(ref)}
                className="ft-micro inline-flex items-center gap-1 border border-brand-navy/25 bg-brand-paper px-2 py-1 text-brand-navy transition-colors hover:bg-brand-navy/5"
              >
                <Plus size={10} /> New shipment
              </button>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
}
