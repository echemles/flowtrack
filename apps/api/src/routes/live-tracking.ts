import { Hono } from 'hono';
import { sql } from '../db';
import { shapeShipment } from '../lib/shape';

export const liveTrackingRoutes = new Hono();

// rough city → [lon, lat] lookup; covers the seed lanes
const COORDS: Record<string, [number, number]> = {
  'Ho Chi Minh': [106.6297, 10.8231],
  Rotterdam: [4.4777, 51.9244],
  Mumbai: [72.8777, 19.076],
  London: [-0.1276, 51.5074],
  Frankfurt: [8.6821, 50.1109],
  'New York': [-74.006, 40.7128],
  Shanghai: [121.4737, 31.2304],
  'Long Beach': [-118.1937, 33.767],
  Antwerp: [4.4025, 51.2194],
  Santos: [-46.3322, -23.9608],
  Madrid: [-3.7038, 40.4168],
  Paris: [2.3522, 48.8566],
  Lyon: [4.8357, 45.764],
  Milan: [9.19, 45.4642],
  Shenzhen: [114.0579, 22.5431],
  Berlin: [13.405, 52.52],
  Istanbul: [28.9784, 41.0082],
  Chicago: [-87.6298, 41.8781],
  'San Francisco': [-122.4194, 37.7749],
  Austin: [-97.7431, 30.2672],
  Yokohama: [139.6425, 35.4437],
  Hamburg: [9.9937, 53.5511],
  Singapore: [103.8198, 1.3521],
  'Los Angeles': [-118.2437, 34.0522],
};

liveTrackingRoutes.get('/:ref', async (c) => {
  const ref = c.req.param('ref');
  const rows = (await sql`
    select s.*, c.name as carrier_name, cl.name as client_name
    from shipments s
    left join companies c on c.id = s.carrier_company_id
    left join companies cl on cl.id = s.client_company_id
    where s.ref = ${ref} limit 1
  `) as any[];
  const row = rows[0];
  if (!row) return c.json({ error: { code: 'not_found', message: 'Not found' } }, 404);
  const shipment = shapeShipment(row);
  const milestones = ((await sql`
    select id, ord, label, at, status from shipment_milestones
    where shipment_id = ${row.id} order by ord
  `) as any[]).map((m) => ({
    id: m.id, ord: m.ord, label: m.label,
    at: m.at ? new Date(m.at).toISOString() : null, status: m.status,
  }));
  const origin = COORDS[shipment.origin_city] ?? [0, 0];
  const dest = COORDS[shipment.dest_city] ?? [0, 0];
  return c.json({
    shipment, milestones,
    route: { origin, dest },
    percent: shipment.percent_complete,
    daysRemaining: shipment.days_remaining,
  });
});
