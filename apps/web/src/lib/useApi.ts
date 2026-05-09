import { useEffect, useRef, useState } from 'react';
import { z } from 'zod';
import { api } from './apiClient';

type State<T> = { loading: boolean; error: string | null; data: T | null };

export function useApi<T>(path: string | null, schema: z.ZodType<T>): State<T> & { refetch: () => void } {
  const [state, setState] = useState<State<T>>({ loading: !!path, error: null, data: null });
  const [tick, setTick] = useState(0);
  const schemaRef = useRef(schema);
  schemaRef.current = schema;

  useEffect(() => {
    if (!path) {
      setState({ loading: false, error: null, data: null });
      return;
    }
    let alive = true;
    setState((s) => ({ ...s, loading: true, error: null }));
    api
      .get(path, schemaRef.current)
      .then((data) => {
        if (alive) setState({ loading: false, error: null, data });
      })
      .catch((err: unknown) => {
        if (alive)
          setState({
            loading: false,
            error: err instanceof Error ? err.message : 'Failed to load',
            data: null,
          });
      });
    return () => {
      alive = false;
    };
  }, [path, tick]);

  return { ...state, refetch: () => setTick((n) => n + 1) };
}
