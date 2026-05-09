import { Hono } from 'hono';
import { sql } from '../db';

export const billingRoutes = new Hono();

billingRoutes.get('/', async (c) => {
  const rows = (await sql`
    select i.*, c.name as carrier_name, s.ref as shipment_ref
    from invoices i
    left join companies c on c.id = i.carrier_company_id
    left join shipments s on s.id = i.shipment_id
    order by i.number
  `) as any[];
  const invoices = rows.map((i) => ({
    id: i.id, number: i.number, carrier: i.carrier_name ?? null,
    shipment_ref: i.shipment_ref ?? null,
    expected_minor: i.expected_minor, actual_minor: i.actual_minor,
    variance_minor: i.variance_minor, currency: i.currency, status: i.status,
  }));
  const stats = {
    outstanding_minor: invoices.filter((x) => x.status === 'outstanding').reduce((a, x) => a + x.actual_minor, 0),
    disputed_minor: invoices.filter((x) => x.status === 'disputed').reduce((a, x) => a + x.actual_minor, 0),
    flagged_count: invoices.filter((x) => x.status === 'flagged').length,
    currency: 'USD',
  };
  return c.json({ stats, invoices });
});
