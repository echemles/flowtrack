import { ReactNode } from 'react';

type Props<T> = {
  state: { loading: boolean; error: string | null; data: T | null };
  children: (data: T) => ReactNode;
  empty?: ReactNode;
};

export function DataState<T>({ state, children, empty }: Props<T>) {
  if (state.loading) {
    return (
      <div className="border border-brand-rule bg-brand-paper p-6 ft-micro text-brand-navy/55">
        Loading…
      </div>
    );
  }
  if (state.error) {
    return (
      <div className="border border-brand-red/30 bg-brand-red/5 p-6 text-[13px] text-brand-red">
        {state.error}
      </div>
    );
  }
  if (!state.data) {
    return <>{empty ?? null}</>;
  }
  return <>{children(state.data)}</>;
}
