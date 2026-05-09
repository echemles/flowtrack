import { Hono } from 'hono';
import { db, sql } from '../db';
import { shapeShipment } from '../lib/shape';

export const controlTowerRoutes = new Hono();

controlTowerRoutes.get('/', async (c) => {
  const alerts = (await sql`select * from alerts order by created_at desc`).map((a: any) => ({
    id: a.id, kind: a.kind, title: a.title, body: a.body, severity: a.severity,
    shipment_ref: a.shipment_ref, created_at: new Date(a.created_at).toISOString(),
  }));

  const briefing = (await sql`select id, title, body, link from daily_briefing_items`).map((b: any) => ({
    id: b.id, title: b.title, body: b.body, link: b.link ?? null,
  }));

  const needsYouNow = alerts.filter((a) =>
    ['agi_escalation', 'missing_document', 'invoice_variance'].includes(a.kind),
  );

  const shipmentRows = await sql`
    select s.*, c.name as carrier_name, cl.name as client_name
    from shipments s
    left join companies c on c.id = s.carrier_company_id
    left join companies cl on cl.id = s.client_company_id
  `;
  const shipments = (shipmentRows as any[]).map(shapeShipment);
  const arriving = shipments.filter((s) => s.status === 'arriving');
  const dispatched = shipments.filter((s) => s.status === 'dispatched');

  const pulse = (await sql`select * from kpis`).map((k: any) => ({
    slug: k.slug, label: k.label, value_minor: k.value_minor, value_pct: k.value_pct,
    currency: k.currency, text: k.text_array,
  }));

  const networkLanes = (await sql`select * from network_lanes`).map((l: any) => ({
    id: l.id, origin_city: l.origin_city, origin_country: l.origin_country,
    dest_city: l.dest_city, dest_country: l.dest_country,
    mode: l.mode, is_active: l.is_active, weight: l.weight,
  }));

  return c.json({ alerts, briefing, needsYouNow, todaysFlow: { arriving, dispatched }, pulse, networkLanes });
});
