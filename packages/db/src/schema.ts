import {
  pgTable,
  text,
  integer,
  boolean,
  timestamp,
  pgEnum,
} from 'drizzle-orm/pg-core';

export const companyKindEnum = pgEnum('company_kind', [
  'client',
  'provider',
  'team',
  'factory',
]);
export const modeEnum = pgEnum('mode', ['air', 'sea', 'road', 'ecom', 'courier']);
export const shipmentStatusEnum = pgEnum('shipment_status', [
  'planned',
  'dispatched',
  'in_transit',
  'arriving',
  'delivered',
  'overdue',
]);
export const milestoneStatusEnum = pgEnum('milestone_status', [
  'done',
  'active',
  'pending',
]);
export const poStatusEnum = pgEnum('po_status', ['at_risk', 'in_service', 'closed']);
export const invoiceStatusEnum = pgEnum('invoice_status', [
  'outstanding',
  'disputed',
  'paid',
  'flagged',
]);
export const channelEnum = pgEnum('channel', [
  'email',
  'whatsapp',
  'sms',
  'voice',
  'slack',
  'teams',
]);
export const folderEnum = pgEnum('folder', [
  'inbox',
  'starred',
  'agi_escalations',
  'archived',
]);
export const directionEnum = pgEnum('direction', ['in', 'out']);
export const integrationTierEnum = pgEnum('integration_tier', [
  'aggregators',
  'carriers_direct',
  'erp',
  'communications',
]);
export const integrationStatusEnum = pgEnum('integration_status', [
  'connected',
  'connecting',
  'available',
]);
export const severityEnum = pgEnum('severity', ['low', 'med', 'high']);

export const companies = pgTable('companies', {
  id: text('id').primaryKey(),
  kind: companyKindEnum('kind').notNull(),
  name: text('name').notNull(),
  country: text('country'),
  website: text('website'),
  industry: text('industry'),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export const people = pgTable('people', {
  id: text('id').primaryKey(),
  company_id: text('company_id').references(() => companies.id),
  name: text('name').notNull(),
  role: text('role'),
  email: text('email'),
  phone: text('phone'),
  slack: text('slack'),
  teams_handle: text('teams_handle'),
  is_internal: boolean('is_internal').notNull().default(false),
});

export const shipments = pgTable('shipments', {
  id: text('id').primaryKey(),
  ref: text('ref').notNull().unique(),
  mode: modeEnum('mode').notNull(),
  status: shipmentStatusEnum('status').notNull(),
  origin_city: text('origin_city').notNull(),
  origin_country: text('origin_country').notNull(),
  dest_city: text('dest_city').notNull(),
  dest_country: text('dest_country').notNull(),
  carrier_company_id: text('carrier_company_id').references(() => companies.id),
  client_company_id: text('client_company_id').references(() => companies.id),
  atd: timestamp('atd', { withTimezone: true }),
  eta_carrier: timestamp('eta_carrier', { withTimezone: true }),
  eta_agi: timestamp('eta_agi', { withTimezone: true }),
  percent_complete: integer('percent_complete').notNull().default(0),
  days_remaining: integer('days_remaining'),
  value_minor: integer('value_minor').notNull().default(0),
  currency: text('currency').notNull().default('USD'),
  has_incident: boolean('has_incident').notNull().default(false),
});

export const shipment_milestones = pgTable('shipment_milestones', {
  id: text('id').primaryKey(),
  shipment_id: text('shipment_id').notNull().references(() => shipments.id),
  ord: integer('ord').notNull(),
  label: text('label').notNull(),
  at: timestamp('at', { withTimezone: true }),
  status: milestoneStatusEnum('status').notNull(),
});

export const shipment_skus = pgTable('shipment_skus', {
  id: text('id').primaryKey(),
  shipment_id: text('shipment_id').notNull().references(() => shipments.id),
  sku: text('sku').notNull(),
  description: text('description').notNull(),
  qty: integer('qty').notNull(),
  weight_kg: integer('weight_kg').notNull(),
});

export const shipment_documents = pgTable('shipment_documents', {
  id: text('id').primaryKey(),
  shipment_id: text('shipment_id').notNull().references(() => shipments.id),
  kind: text('kind').notNull(),
  status: text('status').notNull(),
  url: text('url'),
});

export const supply_chain_legs = pgTable('supply_chain_legs', {
  id: text('id').primaryKey(),
  shipment_id: text('shipment_id').notNull().references(() => shipments.id),
  ord: integer('ord').notNull(),
  provider_company_id: text('provider_company_id').references(() => companies.id),
  role: text('role').notNull(),
  on_time_pct: integer('on_time_pct').notNull(),
});

export const purchase_orders = pgTable('purchase_orders', {
  id: text('id').primaryKey(),
  number: text('number').notNull().unique(),
  shipment_id: text('shipment_id').references(() => shipments.id),
  provider_company_id: text('provider_company_id').references(() => companies.id),
  lines_count: integer('lines_count').notNull().default(0),
  committed_minor: integer('committed_minor').notNull().default(0),
  billed_minor: integer('billed_minor').notNull().default(0),
  variance_minor: integer('variance_minor').notNull().default(0),
  currency: text('currency').notNull().default('USD'),
  status: poStatusEnum('status').notNull(),
});

export const purchase_order_lines = pgTable('purchase_order_lines', {
  id: text('id').primaryKey(),
  po_id: text('po_id').notNull().references(() => purchase_orders.id),
  ord: integer('ord').notNull(),
  description: text('description').notNull(),
  qty: integer('qty').notNull(),
  unit_price_minor: integer('unit_price_minor').notNull(),
});

export const invoices = pgTable('invoices', {
  id: text('id').primaryKey(),
  number: text('number').notNull().unique(),
  carrier_company_id: text('carrier_company_id').references(() => companies.id),
  shipment_id: text('shipment_id').references(() => shipments.id),
  expected_minor: integer('expected_minor').notNull().default(0),
  actual_minor: integer('actual_minor').notNull().default(0),
  variance_minor: integer('variance_minor').notNull().default(0),
  currency: text('currency').notNull().default('USD'),
  status: invoiceStatusEnum('status').notNull(),
});

export const invoice_lines = pgTable('invoice_lines', {
  id: text('id').primaryKey(),
  invoice_id: text('invoice_id').notNull().references(() => invoices.id),
  ord: integer('ord').notNull(),
  description: text('description').notNull(),
  qty: integer('qty').notNull(),
  unit_price_minor: integer('unit_price_minor').notNull(),
});

export const inbox_threads = pgTable('inbox_threads', {
  id: text('id').primaryKey(),
  channel: channelEnum('channel').notNull(),
  counterpart_company_id: text('counterpart_company_id').references(() => companies.id),
  subject: text('subject').notNull(),
  last_at: timestamp('last_at', { withTimezone: true }).notNull(),
  unread: boolean('unread').notNull().default(false),
  starred: boolean('starred').notNull().default(false),
  folder: folderEnum('folder').notNull(),
  shipment_ref: text('shipment_ref'),
});

export const inbox_messages = pgTable('inbox_messages', {
  id: text('id').primaryKey(),
  thread_id: text('thread_id').notNull().references(() => inbox_threads.id),
  ord: integer('ord').notNull(),
  from_name: text('from_name').notNull(),
  body: text('body').notNull(),
  at: timestamp('at', { withTimezone: true }).notNull(),
  direction: directionEnum('direction').notNull(),
});

export const integrations = pgTable('integrations', {
  id: text('id').primaryKey(),
  tier: integrationTierEnum('tier').notNull(),
  key: text('key').notNull().unique(),
  name: text('name').notNull(),
  plan: text('plan'),
  status: integrationStatusEnum('status').notNull(),
  setup_minutes: integer('setup_minutes'),
});

export const alerts = pgTable('alerts', {
  id: text('id').primaryKey(),
  kind: text('kind').notNull(),
  title: text('title').notNull(),
  body: text('body').notNull(),
  severity: severityEnum('severity').notNull(),
  shipment_ref: text('shipment_ref'),
  created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const daily_briefing_items = pgTable('daily_briefing_items', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  body: text('body').notNull(),
  link: text('link'),
});

export const kpis = pgTable('kpis', {
  id: text('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  label: text('label').notNull(),
  value_minor: integer('value_minor'),
  value_pct: integer('value_pct'),
  currency: text('currency'),
  text_array: text('text_array').array(),
});

export const network_lanes = pgTable('network_lanes', {
  id: text('id').primaryKey(),
  origin_city: text('origin_city').notNull(),
  origin_country: text('origin_country').notNull(),
  dest_city: text('dest_city').notNull(),
  dest_country: text('dest_country').notNull(),
  mode: modeEnum('mode').notNull(),
  is_active: boolean('is_active').notNull().default(true),
  weight: integer('weight').notNull().default(1),
});
