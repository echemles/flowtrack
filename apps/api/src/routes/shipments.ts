import { Hono } from 'hono';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';
import { sql } from '../db';
import { shapeShipment } from '../lib/shape';

export const shipmentsRoutes = new Hono();

const TabSchema = z.enum(['all', 'arriving', 'dispatched', 'needs_action', 'overdue']).optional();

shipmentsRoutes.get('/', async (c) => {
  const tab = TabSchema.parse(c.req.query('tab') ?? 'all') ?? 'all';
  const rows = await sql`
    select s.*, c.name as carrier_name, cl.name as client_name
    from shipments s
    left join companies c on c.id = s.carrier_company_id
    left join companies cl on cl.id = s.client_company_id
    order by s.atd desc nulls last
  `;
  let shipments = (rows as any[]).map(shapeShipment);
  if (tab === 'arriving') shipments = shipments.filter((s) => s.status === 'arriving');
  else if (tab === 'dispatched') shipments = shipments.filter((s) => s.status === 'dispatched');
  else if (tab === 'overdue') shipments = shipments.filter((s) => s.status === 'overdue');
  else if (tab === 'needs_action') shipments = shipments.filter((s) => s.has_incident || s.status === 'overdue');
  return c.json(shipments);
});

shipmentsRoutes.post(
  '/check',
  zValidator('json', z.object({ refs: z.array(z.string().min(1)) })),
  async (c) => {
    const { refs } = c.req.valid('json');
    const known = new Set(
      ((await sql`select ref from shipments`) as any[]).map((r) => r.ref as string),
    );
    const docsByShipment = new Map<string, string[]>();
    const docRows = (await sql`
      select s.ref, d.status from shipments s
      join shipment_documents d on d.shipment_id = s.id
    `) as any[];
    docRows.forEach((r) => {
      const arr = docsByShipment.get(r.ref) ?? [];
      arr.push(r.status);
      docsByShipment.set(r.ref, arr);
    });
    const matched: string[] = [];
    const missingDocs: string[] = [];
    const notFound: string[] = [];
    for (const ref of refs) {
      if (!known.has(ref)) notFound.push(ref);
      else if ((docsByShipment.get(ref) ?? []).some((s) => s !== 'approved')) missingDocs.push(ref);
      else matched.push(ref);
    }
    return c.json({ matched, missingDocs, notFound });
  },
);

shipmentsRoutes.get('/:ref', async (c) => {
  const ref = c.req.param('ref');
  const rows = (await sql`
    select s.*, c.name as carrier_name, cl.name as client_name
    from shipments s
    left join companies c on c.id = s.carrier_company_id
    left join companies cl on cl.id = s.client_company_id
    where s.ref = ${ref}
    limit 1
  `) as any[];
  const row = rows[0];
  if (!row) return c.json({ error: { code: 'not_found', message: `Shipment ${ref} not found` } }, 404);
  const shipment = shapeShipment(row);

  const timeline = ((await sql`
    select id, ord, label, at, status from shipment_milestones
    where shipment_id = ${row.id} order by ord
  `) as any[]).map((m) => ({
    id: m.id, ord: m.ord, label: m.label,
    at: m.at ? new Date(m.at).toISOString() : null, status: m.status,
  }));

  const skus = ((await sql`select * from shipment_skus where shipment_id = ${row.id}`) as any[]).map((x) => ({
    id: x.id, sku: x.sku, description: x.description, qty: x.qty, weight_kg: x.weight_kg,
  }));

  const documents = ((await sql`select * from shipment_documents where shipment_id = ${row.id}`) as any[]).map((x) => ({
    id: x.id, kind: x.kind, status: x.status, url: x.url ?? null,
  }));

  const supplyChain = ((await sql`
    select l.*, c.name as provider_name from supply_chain_legs l
    left join companies c on c.id = l.provider_company_id
    where l.shipment_id = ${row.id} order by l.ord
  `) as any[]).map((l) => ({
    id: l.id, ord: l.ord, provider: l.provider_name ?? 'Unknown',
    role: l.role, on_time_pct: l.on_time_pct,
  }));

  const poRows = (await sql`
    select p.*, c.name as provider_name from purchase_orders p
    left join companies c on c.id = p.provider_company_id
    where p.shipment_id = ${row.id} limit 1
  `) as any[];
  let purchaseOrder = null;
  if (poRows.length) {
    const po = poRows[0];
    const lines = ((await sql`
      select * from purchase_order_lines where po_id = ${po.id} order by ord
    `) as any[]).map((l) => ({
      id: l.id, ord: l.ord, description: l.description, qty: l.qty, unit_price_minor: l.unit_price_minor,
    }));
    purchaseOrder = {
      row: {
        id: po.id, number: po.number, shipment_ref: ref, provider: po.provider_name,
        lines_count: po.lines_count, committed_minor: po.committed_minor,
        billed_minor: po.billed_minor, variance_minor: po.variance_minor,
        currency: po.currency, status: po.status,
      },
      lines,
    };
  }

  return c.json({
    shipment, timeline, skus, documents, supplyChain, purchaseOrder,
    financials: {
      value_minor: shipment.value_minor, currency: shipment.currency,
      committed_minor: purchaseOrder?.row.committed_minor ?? null,
      billed_minor: purchaseOrder?.row.billed_minor ?? null,
      variance_minor: purchaseOrder?.row.variance_minor ?? null,
    },
    notifications: [],
  });
});
