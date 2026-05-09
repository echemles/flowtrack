import { Hono } from 'hono';
import { sql } from '../db';

export const integrationsRoutes = new Hono();

integrationsRoutes.get('/', async (c) => {
  const rows = ((await sql`select * from integrations order by tier, name`) as any[]).map((r) => ({
    id: r.id, tier: r.tier, key: r.key, name: r.name, plan: r.plan,
    status: r.status, setup_minutes: r.setup_minutes,
  }));
  const groups = {
    aggregators: rows.filter((r) => r.tier === 'aggregators'),
    carriers_direct: rows.filter((r) => r.tier === 'carriers_direct'),
    erp: rows.filter((r) => r.tier === 'erp'),
    communications: rows.filter((r) => r.tier === 'communications'),
  };
  const totals = {
    connected: rows.filter((r) => r.status === 'connected').length,
    total: rows.length,
  };
  return c.json({ totals, groups });
});
