import { Hono } from 'hono';
import { sql } from '../db';

export const purchaseOrdersRoutes = new Hono();

purchaseOrdersRoutes.get('/', async (c) => {
  const rows = (await sql`
    select p.*, s.ref as shipment_ref, c.name as provider_name
    from purchase_orders p
    left join shipments s on s.id = p.shipment_id
    left join companies c on c.id = p.provider_company_id
    order by p.number
  `) as any[];
  const pos = rows.map((p) => ({
    id: p.id, number: p.number, shipment_ref: p.shipment_ref ?? null,
    provider: p.provider_name ?? null, lines_count: p.lines_count,
    committed_minor: p.committed_minor, billed_minor: p.billed_minor,
    variance_minor: p.variance_minor, currency: p.currency, status: p.status,
  }));
  const totals = pos.reduce(
    (acc, p) => ({
      committed: acc.committed + p.committed_minor,
      billed: acc.billed + p.billed_minor,
      variance: acc.variance + p.variance_minor,
    }),
    { committed: 0, billed: 0, variance: 0 },
  );
  const stats = {
    total: pos.length,
    at_risk: pos.filter((p) => p.status === 'at_risk').length,
    in_service: pos.filter((p) => p.status === 'in_service').length,
    committed_minor: totals.committed,
    billed_minor: totals.billed,
    variance_minor: totals.variance,
    currency: 'USD',
  };
  const byProvider = new Map<string, number>();
  pos.forEach((p) => {
    if (!p.provider) return;
    byProvider.set(p.provider, (byProvider.get(p.provider) ?? 0) + p.committed_minor);
  });
  const topProviders = [...byProvider.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([provider, committed_minor]) => ({ provider, committed_minor, currency: 'USD' }));
  return c.json({ stats, topProviders, pos });
});
