/**
 * Snapshot every read endpoint of the FlowTrack API into apps/web/public/api-mock/.
 * Used to bake static JSON for the GitHub Pages deployment.
 *
 * Run: pnpm --filter @flowtrack/web exec tsx ../../scripts/snapshot-api.ts
 *   or: node --experimental-strip-types scripts/snapshot-api.ts (Node >= 22.6)
 */
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const OUT = resolve(ROOT, 'apps/web/public/api-mock');
const BASE = process.env.API_BASE ?? 'http://localhost:8788';

async function fetchJson<T = unknown>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`);
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} for ${path}: ${await res.text()}`);
  }
  return (await res.json()) as T;
}

async function writeJson(relPath: string, data: unknown): Promise<number> {
  const file = resolve(OUT, relPath);
  await mkdir(dirname(file), { recursive: true });
  const body = JSON.stringify(data, null, 2);
  await writeFile(file, body, 'utf8');
  return Buffer.byteLength(body, 'utf8');
}

const SHIPMENT_TABS = ['all', 'arriving', 'dispatched', 'needs_action', 'overdue'] as const;
const INBOX_FOLDERS = ['inbox', 'starred', 'agi_escalations', 'archived'] as const;

type ShipmentRow = { ref: string };
type InboxThreadRow = { id: string };
type InboxList = { threads: InboxThreadRow[] };
type ShipmentList = ShipmentRow[];

let totalBytes = 0;
let totalFiles = 0;

async function snap(label: string, relPath: string, path: string): Promise<unknown> {
  const data = await fetchJson(path);
  const bytes = await writeJson(relPath, data);
  totalBytes += bytes;
  totalFiles += 1;
  // eslint-disable-next-line no-console
  console.log(`  ${label.padEnd(34)} -> ${relPath}  (${bytes}B)`);
  return data;
}

async function main() {
  await mkdir(OUT, { recursive: true });
  console.log(`[snapshot] BASE=${BASE}`);
  console.log(`[snapshot] OUT=${OUT}`);

  // top-level endpoints
  await snap('GET /api/control-tower', 'control-tower.json', '/api/control-tower');

  // shipments by tab
  let shipmentsAll: ShipmentList = [];
  for (const tab of SHIPMENT_TABS) {
    const file = tab === 'all' ? 'shipments.json' : `shipments-${tab}.json`;
    const data = (await snap(
      `GET /api/shipments?tab=${tab}`,
      file,
      `/api/shipments?tab=${tab}`,
    )) as ShipmentList;
    if (tab === 'all') shipmentsAll = data;
  }

  // discover refs from /api/shipments (tab=all)
  const refs = Array.from(new Set(shipmentsAll.map((s) => s.ref)));
  console.log(`[snapshot] discovered ${refs.length} shipment refs`);

  for (const ref of refs) {
    await snap(`GET /api/shipments/${ref}`, `shipments/${ref}.json`, `/api/shipments/${ref}`);
    await snap(
      `GET /api/live-tracking/${ref}`,
      `live-tracking/${ref}.json`,
      `/api/live-tracking/${ref}`,
    );
  }

  // inbox folders + threads
  const allThreadIds = new Set<string>();
  for (const folder of INBOX_FOLDERS) {
    const data = (await snap(
      `GET /api/inbox?folder=${folder}`,
      `inbox-${folder}.json`,
      `/api/inbox?folder=${folder}`,
    )) as InboxList;
    for (const t of data.threads ?? []) allThreadIds.add(t.id);
  }
  console.log(`[snapshot] discovered ${allThreadIds.size} inbox threads`);
  for (const id of allThreadIds) {
    await snap(
      `GET /api/inbox/threads/${id}`,
      `inbox/threads/${id}.json`,
      `/api/inbox/threads/${id}`,
    );
  }

  // remaining endpoints
  await snap('GET /api/contacts', 'contacts.json', '/api/contacts');
  await snap('GET /api/purchase-orders', 'purchase-orders.json', '/api/purchase-orders');
  await snap('GET /api/integrations', 'integrations.json', '/api/integrations');
  await snap('GET /api/billing', 'billing.json', '/api/billing');
  await snap('GET /api/settings', 'settings.json', '/api/settings');

  console.log(`\n[snapshot] wrote ${totalFiles} files, ${(totalBytes / 1024).toFixed(1)} KiB total`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
