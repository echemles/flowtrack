import { Hono } from 'hono';
import { sql } from '../db';

export const settingsRoutes = new Hono();

settingsRoutes.get('/', async (c) => {
  const team = ((await sql`
    select p.*, c.name as company_name from people p
    left join companies c on c.id = p.company_id
    where p.is_internal = true
  `) as any[]).map((p) => ({
    id: p.id, name: p.name, role: p.role, email: p.email, phone: p.phone,
    is_internal: p.is_internal, company: p.company_name ?? null,
  }));
  const notificationDefaults = [
    { key: 'shipment_status_change', label: 'Shipment status change', enabled: true },
    { key: 'invoice_variance', label: 'Invoice variance', enabled: true },
    { key: 'agi_escalation', label: 'AGI escalation', enabled: true },
    { key: 'new_inbox_thread', label: 'New inbox thread', enabled: false },
    { key: 'po_at_risk', label: 'PO at risk', enabled: true },
  ];
  const moreTools = [
    { key: 'api_keys', label: 'API keys' },
    { key: 'webhooks', label: 'Webhooks' },
    { key: 'audit_log', label: 'Audit log' },
    { key: 'roles', label: 'Roles & permissions' },
  ];
  return c.json({ team, notificationDefaults, moreTools });
});
