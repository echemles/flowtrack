import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { sql } from './db';
import { loadEnv } from './env';
import { controlTowerRoutes } from './routes/control-tower';
import { shipmentsRoutes } from './routes/shipments';
import { liveTrackingRoutes } from './routes/live-tracking';
import { inboxRoutes } from './routes/inbox';
import { contactsRoutes } from './routes/contacts';
import { purchaseOrdersRoutes } from './routes/purchase-orders';
import { integrationsRoutes } from './routes/integrations';
import { billingRoutes } from './routes/billing';
import { settingsRoutes } from './routes/settings';

const env = loadEnv();
const app = new Hono();

app.use(
  '*',
  cors({
    origin: 'http://localhost:5174',
    allowHeaders: ['Content-Type', 'Authorization'],
    allowMethods: ['GET', 'POST', 'OPTIONS'],
  }),
);

const startedAt = Date.now();

app.get('/health', async (c) => {
  let db: 'connected' | 'down' = 'down';
  try {
    await sql`select 1`;
    db = 'connected';
  } catch (err) {
    db = 'down';
  }
  return c.json({
    ok: db === 'connected',
    db,
    uptime: (Date.now() - startedAt) / 1000,
    ts: new Date().toISOString(),
  });
});

app.route('/api/control-tower', controlTowerRoutes);
app.route('/api/shipments', shipmentsRoutes);
app.route('/api/live-tracking', liveTrackingRoutes);
app.route('/api/inbox', inboxRoutes);
app.route('/api/contacts', contactsRoutes);
app.route('/api/purchase-orders', purchaseOrdersRoutes);
app.route('/api/integrations', integrationsRoutes);
app.route('/api/billing', billingRoutes);
app.route('/api/settings', settingsRoutes);

serve({ fetch: app.fetch, port: env.PORT }, (info) => {
  console.log(`flowtrack api listening on http://localhost:${info.port}`);
});
