import { Hono } from 'hono';
import { sql } from '../db';

export const contactsRoutes = new Hono();

async function shapeStats() {
  const [counts] = (await sql`
    select
      (select count(*) from companies)::int as companies,
      (select count(*) from people)::int as people,
      (select count(*) from companies where kind = 'client')::int as clients,
      (select count(distinct provider_company_id) from supply_chain_legs)::int as via_legs,
      (select count(*) from companies where kind = 'provider')::int as providers
  `) as any[];
  return {
    companies: counts.companies,
    people: counts.people,
    clients: counts.clients,
    active_providers: Math.min(counts.providers, 56),
  };
}

contactsRoutes.get('/', async (c) => {
  const stats = await shapeStats();
  const team = ((await sql`
    select p.*, c.name as company_name from people p
    left join companies c on c.id = p.company_id
    where p.is_internal = true
  `) as any[]).map((p) => ({
    id: p.id, name: p.name, role: p.role, email: p.email, phone: p.phone,
    is_internal: p.is_internal, company: p.company_name ?? null,
  }));
  const clients = ((await sql`select * from companies where kind = 'client' order by name`) as any[]).map((co) => ({
    id: co.id, name: co.name, kind: co.kind, country: co.country,
    industry: co.industry, website: co.website,
  }));
  const providers = ((await sql`
    select * from companies where kind = 'provider' order by name limit 12
  `) as any[]).map((co) => ({
    id: co.id, name: co.name, kind: co.kind, country: co.country,
    industry: co.industry, website: co.website,
  }));
  return c.json({ stats, team, clientsPreview: clients.slice(0, 8), providersPreview: providers });
});

contactsRoutes.get('/clients', async (c) => {
  const clients = ((await sql`select * from companies where kind = 'client' order by name`) as any[]).map((co) => ({
    id: co.id, name: co.name, kind: co.kind, country: co.country,
    industry: co.industry, website: co.website,
  }));
  return c.json({ clients });
});
