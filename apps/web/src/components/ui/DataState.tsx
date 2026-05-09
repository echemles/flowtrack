import { ReactNode } from 'react';

type Props<T> = {
  state: { loading: boolean; error: string | null; data: T | null };
  children: (data: T) => ReactNode;
  empty?: ReactNode;
};

export function DataState<T>({ state, children, empty }: Props<T>) {
  if (state.loading) {
    return (
      <div className="rounded-lg border border-border-subtle bg-surface-card p-6 text-sm text-text-muted">
        Loading…
      </div>
    );
  }
  if (state.error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-sm text-red-700">
        {state.error}
      </div>
    );
  }
  if (!state.data) {
    return <>{empty ?? null}</>;
  }
  return <>{children(state.data)}</>;
}
