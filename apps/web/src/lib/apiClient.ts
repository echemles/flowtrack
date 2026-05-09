import { z } from 'zod';

const DEV_BASE = 'http://localhost:8788/api';

// Vite injects BASE_URL from `base:` config (e.g. '/flowtrack/' on GH Pages).
const PUBLIC_BASE = import.meta.env.BASE_URL ?? '/';
const IS_PROD = import.meta.env.PROD;

/** Map a logical API path (e.g. `/shipments?tab=arriving`) to a static JSON URL under public/api-mock/. */
function mapToStaticUrl(path: string): string {
  // strip leading slash
  const p = path.startsWith('/') ? path.slice(1) : path;
  const [route, query = ''] = p.split('?');
  const params = new URLSearchParams(query);
  const segments = route.split('/').filter(Boolean);

  const base = `${PUBLIC_BASE}api-mock/`;

  // /shipments  or  /shipments?tab=X
  if (segments[0] === 'shipments' && segments.length === 1) {
    const tab = params.get('tab');
    if (!tab || tab === 'all') return `${base}shipments.json`;
    return `${base}shipments-${tab}.json`;
  }

  // /shipments/:ref
  if (segments[0] === 'shipments' && segments.length === 2) {
    return `${base}shipments/${segments[1]}.json`;
  }

  // /live-tracking/:ref
  if (segments[0] === 'live-tracking' && segments.length === 2) {
    return `${base}live-tracking/${segments[1]}.json`;
  }

  // /inbox  or  /inbox?folder=X
  if (segments[0] === 'inbox' && segments.length === 1) {
    const folder = params.get('folder') ?? 'inbox';
    return `${base}inbox-${folder}.json`;
  }

  // /inbox/threads/:id
  if (segments[0] === 'inbox' && segments[1] === 'threads' && segments.length === 3) {
    return `${base}inbox/threads/${segments[2]}.json`;
  }

  // single-file endpoints: /control-tower, /contacts, /purchase-orders,
  // /integrations, /billing, /settings
  return `${base}${segments.join('-')}.json`;
}

/** In production, ShipmentsCheck has no backend — emulate the prototype's "0 matched · 0 missing · N not_found" feel. */
async function emulateShipmentsCheck(refs: string[]): Promise<unknown> {
  // Accept 4-digit suffix only for "exists" check, but cross-reference shipments.json.
  const url = `${PUBLIC_BASE}api-mock/shipments.json`;
  let known = new Set<string>();
  try {
    const res = await fetch(url);
    if (res.ok) {
      const list = (await res.json()) as Array<{ ref: string }>;
      known = new Set(list.map((s) => s.ref));
    }
  } catch {
    /* fall through */
  }

  const matched: string[] = [];
  const missingDocs: string[] = [];
  const notFound: string[] = [];
  for (const r of refs) {
    if (known.has(r)) matched.push(r);
    else notFound.push(r);
  }
  return { matched, missingDocs, notFound };
}

async function request<T>(
  method: 'GET' | 'POST',
  path: string,
  schema: z.ZodType<T>,
  body?: unknown,
): Promise<T> {
  if (IS_PROD) {
    if (method === 'GET') {
      const url = mapToStaticUrl(path);
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`HTTP ${res.status} ${res.statusText} for ${url}`);
      }
      const json = await res.json();
      return schema.parse(json);
    }
    // POST in prod: limited static emulation.
    if (method === 'POST' && path === '/shipments/check') {
      const refs = (body as { refs?: string[] })?.refs ?? [];
      const json = await emulateShipmentsCheck(refs);
      return schema.parse(json);
    }
    throw new Error(`POST ${path} is not available in static export build`);
  }

  // dev: hit the live API
  const res = await fetch(`${DEV_BASE}${path}`, {
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
