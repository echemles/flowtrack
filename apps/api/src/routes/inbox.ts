import { Hono } from 'hono';
import { sql } from '../db';

export const inboxRoutes = new Hono();

const FOLDERS = ['inbox', 'starred', 'agi_escalations', 'archived'] as const;

inboxRoutes.get('/', async (c) => {
  const folder = (c.req.query('folder') as (typeof FOLDERS)[number] | undefined) ?? 'inbox';
  const rows = (await sql`
    select t.*, c.name as counterpart_name from inbox_threads t
    left join companies c on c.id = t.counterpart_company_id
    order by t.last_at desc
  `) as any[];
  let threads = rows.map((t) => ({
    id: t.id, channel: t.channel, counterpart: t.counterpart_name ?? null,
    subject: t.subject, last_at: new Date(t.last_at).toISOString(),
    unread: t.unread, starred: t.starred, folder: t.folder, shipment_ref: t.shipment_ref,
  }));
  const counts = {
    inbox: threads.filter((t) => t.folder === 'inbox').length,
    unread: threads.filter((t) => t.unread).length,
    starred: threads.filter((t) => t.starred).length,
    agi_escalations: threads.filter((t) => t.folder === 'agi_escalations').length,
    archived: threads.filter((t) => t.folder === 'archived').length,
  };
  if (folder === 'starred') threads = threads.filter((t) => t.starred);
  else threads = threads.filter((t) => t.folder === folder);
  return c.json({ threads, counts });
});

inboxRoutes.get('/threads/:id', async (c) => {
  const id = c.req.param('id');
  const messages = ((await sql`
    select * from inbox_messages where thread_id = ${id} order by ord
  `) as any[]).map((m) => ({
    id: m.id, ord: m.ord, from_name: m.from_name, body: m.body,
    at: new Date(m.at).toISOString(), direction: m.direction,
  }));
  return c.json({ messages });
});
