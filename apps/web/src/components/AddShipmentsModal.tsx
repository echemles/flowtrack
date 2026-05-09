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
      className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/40 p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && phase !== 'processing') onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-shipments-title"
    >
      <div className="flex w-full max-w-[560px] flex-col overflow-hidden rounded-xl border border-border-subtle bg-surface-card shadow-2xl">
        <header className="flex items-start justify-between gap-3 border-b border-border-subtle px-5 py-4">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 text-white">
              <Plus size={16} />
            </div>
            <div>
              <h2 id="add-shipments-title" className="text-sm font-semibold text-text-primary">
                Add shipments
              </h2>
              <p className="text-xs text-text-secondary">
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
            className="rounded-md p-1 text-text-muted hover:bg-surface-canvas hover:text-text-primary disabled:opacity-40"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </header>

        {phase === 'input' && (
          <div className="flex flex-col gap-4 px-5 py-5">
            <div className="relative rounded-lg border border-border-subtle bg-surface-canvas">
              <textarea
                ref={textareaRef}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={'FT-26-S891\nFT-26-A103\nMAEU8472913\n…'}
                rows={9}
                className="block w-full resize-none rounded-lg bg-transparent px-3 py-2.5 font-mono text-xs leading-relaxed text-text-primary outline-none placeholder:text-text-muted"
                spellCheck={false}
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-text-secondary">
              <span>
                {refCount} / {MAX_REFS}
              </span>
              <span className="text-text-muted">
                Accepts FlowTrack refs (FT-26-…), tracking numbers, or container IDs
              </span>
            </div>
            <div className="flex items-start gap-2 rounded-md border border-violet-200 bg-violet-50 px-3 py-2 text-xs text-violet-900">
              <Sparkles size={14} className="mt-0.5 shrink-0 text-violet-600" />
              <p>
                <span className="font-semibold">On confirm, FlowTrack will</span> match each number
                to a shipment profile, check required documents, and surface anything that needs
                you.
              </p>
            </div>
            {error ? (
              <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
                {error}
              </div>
            ) : null}
          </div>
        )}

        {phase === 'processing' && (
          <div className="flex flex-col items-center justify-center gap-3 px-5 py-10">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-violet-100">
              <Sparkles size={26} className="text-violet-600" />
            </div>
            <div className="text-base font-semibold text-text-primary">Checking documents…</div>
            <div className="text-xs text-text-secondary">
              Matching {refCount} references · verifying doc completeness · preparing notifications
            </div>
            <div className="mt-1 flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-violet-500 [animation-delay:-0.2s]" />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-violet-500 [animation-delay:-0.1s]" />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-violet-500" />
            </div>
          </div>
        )}

        {phase === 'results' && results && (
          <div className="flex flex-col gap-3 px-5 py-5">
            <div className="grid grid-cols-3 gap-2 text-xs">
              <ResultStat
                icon={<CheckCircle2 size={14} className="text-emerald-600" />}
                label={`${matched.length} matched`}
              />
              <ResultStat
                icon={<FileWarning size={14} className="text-amber-600" />}
                label={`${missingDocs.length} missing docs`}
              />
              <ResultStat
                icon={<AlertCircle size={14} className="text-red-600" />}
                label={`${notFound.length} not found`}
              />
            </div>

            <div className="max-h-[260px] overflow-y-auto rounded-md border border-border-subtle">
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

        <footer className="flex items-center justify-end gap-2 border-t border-border-subtle bg-surface-canvas px-5 py-3">
          {phase === 'input' && (
            <>
              <button
                type="button"
                onClick={onClose}
                className="rounded-md border border-border-subtle bg-surface-card px-3 py-1.5 text-xs font-medium text-text-primary hover:bg-surface-canvas"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={submit}
                disabled={!canSubmit}
                data-action="check-shipments"
                className="inline-flex items-center gap-1.5 rounded-md bg-slate-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-800 disabled:opacity-40"
              >
                <CheckCircle2 size={12} /> Check shipments
              </button>
            </>
          )}
          {phase === 'processing' && (
            <button
              type="button"
              disabled
              className="inline-flex items-center gap-1.5 rounded-md bg-slate-900 px-3 py-1.5 text-xs font-medium text-white opacity-60"
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
                className="inline-flex items-center gap-1.5 rounded-md border border-border-subtle bg-surface-card px-3 py-1.5 text-xs font-medium text-text-primary hover:bg-surface-canvas"
              >
                <Plus size={12} /> Add more
              </button>
              <button
                type="button"
                onClick={onClose}
                className="rounded-md bg-slate-900 px-4 py-1.5 text-xs font-medium text-white hover:bg-slate-800"
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
    <div className="flex items-center gap-1.5 rounded-md border border-border-subtle bg-surface-canvas px-2.5 py-1.5">
      {icon}
      <span className="text-xs font-medium text-text-primary">{label}</span>
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
  if (refs.length === 0) {
    return (
      <div className="border-b border-border-subtle px-3 py-2.5 text-[11px] text-text-muted last:border-b-0">
        <span className="font-semibold uppercase tracking-wider">{title}</span>{' '}
        <span>· {emptyHint}</span>
      </div>
    );
  }
  return (
    <div className="border-b border-border-subtle last:border-b-0">
      <div className="bg-surface-canvas px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-text-secondary">
        {title} · {refs.length}
      </div>
      <ul className="divide-y divide-border-subtle">
        {refs.map((ref) => (
          <li key={ref} className="flex items-center justify-between gap-2 px-3 py-2">
            <div className="flex items-center gap-2">
              <span
                className={
                  kind === 'matched'
                    ? 'h-1.5 w-1.5 rounded-full bg-emerald-500'
                    : kind === 'missingDocs'
                      ? 'h-1.5 w-1.5 rounded-full bg-amber-500'
                      : 'h-1.5 w-1.5 rounded-full bg-red-500'
                }
              />
              <span className="font-mono text-xs text-text-primary">{ref}</span>
              <span
                className={
                  kind === 'matched'
                    ? 'rounded-full bg-emerald-50 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-700'
                    : kind === 'missingDocs'
                      ? 'rounded-full bg-amber-50 px-1.5 py-0.5 text-[10px] font-semibold text-amber-700'
                      : 'rounded-full bg-red-50 px-1.5 py-0.5 text-[10px] font-semibold text-red-700'
                }
              >
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
                className="inline-flex items-center gap-1 rounded-md border border-border-subtle bg-surface-card px-2 py-0.5 text-[11px] text-text-primary hover:bg-surface-canvas"
              >
                <Plus size={10} /> Create a new shipment
              </button>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
}
