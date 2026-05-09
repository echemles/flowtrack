import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';
import { CheckCircle2, Sparkles, AlertCircle, X } from 'lucide-react';

type ToastKind = 'success' | 'agi' | 'error';
type Toast = { id: number; kind: ToastKind; title: string; body?: string };

type ToastContextValue = {
  push: (t: Omit<Toast, 'id'>) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>');
  return ctx;
}

let nextId = 1;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const push = useCallback((t: Omit<Toast, 'id'>) => {
    const id = nextId++;
    setToasts((cur) => [...cur, { id, ...t }]);
    setTimeout(() => {
      setToasts((cur) => cur.filter((x) => x.id !== id));
    }, 3500);
  }, []);

  const dismiss = (id: number) => setToasts((cur) => cur.filter((x) => x.id !== id));

  return (
    <ToastContext.Provider value={{ push }}>
      {children}
      <div className="pointer-events-none fixed bottom-6 right-6 z-[80] flex w-[320px] flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            className="pointer-events-auto flex items-start gap-3 border border-brand-rule bg-brand-paper p-3"
          >
            <div className="mt-0.5 shrink-0">
              {t.kind === 'success' ? (
                <CheckCircle2 size={16} className="text-brand-navy" />
              ) : t.kind === 'agi' ? (
                <Sparkles size={16} className="text-brand-red" />
              ) : (
                <AlertCircle size={16} className="text-brand-red" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="ft-eyebrow text-brand-navy">{t.title}</div>
              {t.body ? <div className="mt-1 text-[13px] text-brand-navy/70">{t.body}</div> : null}
            </div>
            <button
              type="button"
              onClick={() => dismiss(t.id)}
              className="p-0.5 text-brand-navy/40 transition-colors hover:bg-brand-bone hover:text-brand-navy"
              aria-label="Dismiss"
            >
              <X size={12} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
