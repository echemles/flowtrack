import { z } from 'zod';

const BASE = 'http://localhost:8788/api';

async function request<T>(
  method: 'GET' | 'POST',
  path: string,
  schema: z.ZodType<T>,
  body?: unknown,
): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: body ? { 'content-type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} ${res.statusText} for ${path}`);
  }
  const json = await res.json();
  return schema.parse(json);
}

export const api = {
  get: <T>(path: string, schema: z.ZodType<T>) => request('GET', path, schema),
  post: <T>(path: string, body: unknown, schema: z.ZodType<T>) =>
    request('POST', path, schema, body),
};
