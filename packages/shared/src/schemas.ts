import { z } from 'zod';

// ---------- atoms ----------
export const ModeSchema = z.enum(['air', 'sea', 'road', 'ecom', 'courier']);
export const ShipmentStatusSchema = z.enum([
  'planned',
  'dispatched',
  'in_transit',
  'arriving',
  'delivered',
  'overdue',
]);
export const MoneySchema = z.object({
  amount_minor: z.number().int(),
  currency: z.string(),
});

// ---------- shipments ----------
export const ShipmentRowSchema = z.object({
  id: z.string(),
  ref: z.string(),
  mode: ModeSchema,
  status: ShipmentStatusSchema,
  origin_city: z.string(),
  origin_country: z.string(),
  dest_city: z.string(),
  dest_country: z.string(),
  carrier: z.string().nullable(),
  client: z.string().nullable(),
  atd: z.string().nullable(),
  eta_carrier: z.string().nullable(),
  eta_agi: z.string().nullable(),
  percent_complete: z.number(),
  days_remaining: z.number().nullable(),
  value_minor: z.number(),
  currency: z.string(),
  has_incident: z.boolean(),
});
export const ShipmentListSchema = z.array(ShipmentRowSchema);

export const MilestoneSchema = z.object({
  id: z.string(),
  ord: z.number(),
  label: z.string(),
  at: z.string().nullable(),
  status: z.enum(['done', 'active', 'pending']),
});

export const SkuSchema = z.object({
  id: z.string(),
  sku: z.string(),
  description: z.string(),
  qty: z.number(),
  weight_kg: z.number(),
});

export const DocumentSchema = z.object({
  id: z.string(),
  kind: z.string(),
  status: z.string(),
  url: z.string().nullable(),
});

export const SupplyChainLegSchema = z.object({
  id: z.string(),
  ord: z.number(),
  provider: z.string(),
  role: z.string(),
  on_time_pct: z.number(),
});

export const PurchaseOrderRowSchema = z.object({
  id: z.string(),
  number: z.string(),
  shipment_ref: z.string().nullable(),
  provider: z.string().nullable(),
  lines_count: z.number(),
  committed_minor: z.number(),
  billed_minor: z.number(),
  variance_minor: z.number(),
  currency: z.string(),
  status: z.enum(['at_risk', 'in_service', 'closed']),
});

export const PurchaseOrderLineSchema = z.object({
  id: z.string(),
  ord: z.number(),
  description: z.string(),
  qty: z.number(),
  unit_price_minor: z.number(),
});

export const ShipmentDetailSchema = z.object({
  shipment: ShipmentRowSchema,
  timeline: z.array(MilestoneSchema),
  skus: z.array(SkuSchema),
  documents: z.array(DocumentSchema),
  supplyChain: z.array(SupplyChainLegSchema),
  purchaseOrder: z
    .object({ row: PurchaseOrderRowSchema, lines: z.array(PurchaseOrderLineSchema) })
    .nullable(),
  financials: z.object({
    value_minor: z.number(),
    currency: z.string(),
    committed_minor: z.number().nullable(),
    billed_minor: z.number().nullable(),
    variance_minor: z.number().nullable(),
  }),
  notifications: z.array(
    z.object({ id: z.string(), kind: z.string(), title: z.string(), at: z.string() }),
  ),
});

// ---------- live tracking ----------
export const LiveTrackingSchema = z.object({
  shipment: ShipmentRowSchema,
  milestones: z.array(MilestoneSchema),
  route: z.object({
    origin: z.tuple([z.number(), z.number()]),
    dest: z.tuple([z.number(), z.number()]),
  }),
  percent: z.number(),
  daysRemaining: z.number().nullable(),
});

// ---------- inbox ----------
export const InboxThreadSchema = z.object({
  id: z.string(),
  channel: z.enum(['email', 'whatsapp', 'sms', 'voice', 'slack', 'teams']),
  counterpart: z.string().nullable(),
  subject: z.string(),
  last_at: z.string(),
  unread: z.boolean(),
  starred: z.boolean(),
  folder: z.enum(['inbox', 'starred', 'agi_escalations', 'archived']),
  shipment_ref: z.string().nullable(),
});
export const InboxResponseSchema = z.object({
  threads: z.array(InboxThreadSchema),
  counts: z.object({
    inbox: z.number(),
    unread: z.number(),
    starred: z.number(),
    agi_escalations: z.number(),
    archived: z.number(),
  }),
});
export const InboxMessageSchema = z.object({
  id: z.string(),
  ord: z.number(),
  from_name: z.string(),
  body: z.string(),
  at: z.string(),
  direction: z.enum(['in', 'out']),
});

// ---------- contacts ----------
export const ContactsStatsSchema = z.object({
  companies: z.number(),
  people: z.number(),
  clients: z.number(),
  active_providers: z.number(),
});
export const PersonSchema = z.object({
  id: z.string(),
  name: z.string(),
  role: z.string().nullable(),
  email: z.string().nullable(),
  phone: z.string().nullable(),
  is_internal: z.boolean(),
  company: z.string().nullable(),
});
export const CompanySchema = z.object({
  id: z.string(),
  name: z.string(),
  kind: z.enum(['client', 'provider', 'team', 'factory']),
  country: z.string().nullable(),
  industry: z.string().nullable(),
  website: z.string().nullable(),
});
export const ContactsResponseSchema = z.object({
  stats: ContactsStatsSchema,
  team: z.array(PersonSchema),
  clientsPreview: z.array(CompanySchema),
  providersPreview: z.array(CompanySchema),
});
export const ContactsClientsSchema = z.object({ clients: z.array(CompanySchema) });

// ---------- POs ----------
export const PurchaseOrdersResponseSchema = z.object({
  stats: z.object({
    total: z.number(),
    at_risk: z.number(),
    in_service: z.number(),
    committed_minor: z.number(),
    billed_minor: z.number(),
    variance_minor: z.number(),
    currency: z.string(),
  }),
  topProviders: z.array(
    z.object({ provider: z.string(), committed_minor: z.number(), currency: z.string() }),
  ),
  pos: z.array(PurchaseOrderRowSchema),
});

// ---------- integrations ----------
export const IntegrationSchema = z.object({
  id: z.string(),
  tier: z.enum(['aggregators', 'carriers_direct', 'erp', 'communications']),
  key: z.string(),
  name: z.string(),
  plan: z.string().nullable(),
  status: z.enum(['connected', 'connecting', 'available']),
  setup_minutes: z.number().nullable(),
});
export const IntegrationsResponseSchema = z.object({
  totals: z.object({ connected: z.number(), total: z.number() }),
  groups: z.object({
    aggregators: z.array(IntegrationSchema),
    carriers_direct: z.array(IntegrationSchema),
    erp: z.array(IntegrationSchema),
    communications: z.array(IntegrationSchema),
  }),
});

// ---------- billing ----------
export const InvoiceSchema = z.object({
  id: z.string(),
  number: z.string(),
  carrier: z.string().nullable(),
  shipment_ref: z.string().nullable(),
  expected_minor: z.number(),
  actual_minor: z.number(),
  variance_minor: z.number(),
  currency: z.string(),
  status: z.enum(['outstanding', 'disputed', 'paid', 'flagged']),
});
export const BillingResponseSchema = z.object({
  stats: z.object({
    outstanding_minor: z.number(),
    disputed_minor: z.number(),
    flagged_count: z.number(),
    currency: z.string(),
  }),
  invoices: z.array(InvoiceSchema),
});

// ---------- settings ----------
export const SettingsResponseSchema = z.object({
  team: z.array(PersonSchema),
  notificationDefaults: z.array(
    z.object({ key: z.string(), label: z.string(), enabled: z.boolean() }),
  ),
  moreTools: z.array(z.object({ key: z.string(), label: z.string() })),
});

// ---------- control tower ----------
export const AlertSchema = z.object({
  id: z.string(),
  kind: z.string(),
  title: z.string(),
  body: z.string(),
  severity: z.enum(['low', 'med', 'high']),
  shipment_ref: z.string().nullable(),
  created_at: z.string(),
});
export const BriefingItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  body: z.string(),
  link: z.string().nullable(),
});
export const KpiSchema = z.object({
  slug: z.string(),
  label: z.string(),
  value_minor: z.number().nullable(),
  value_pct: z.number().nullable(),
  currency: z.string().nullable(),
  text: z.array(z.string()).nullable(),
});
export const NetworkLaneSchema = z.object({
  id: z.string(),
  origin_city: z.string(),
  origin_country: z.string(),
  dest_city: z.string(),
  dest_country: z.string(),
  mode: ModeSchema,
  is_active: z.boolean(),
  weight: z.number(),
});
export const ControlTowerResponseSchema = z.object({
  alerts: z.array(AlertSchema),
  briefing: z.array(BriefingItemSchema),
  needsYouNow: z.array(AlertSchema),
  todaysFlow: z.object({
    arriving: z.array(ShipmentRowSchema),
    dispatched: z.array(ShipmentRowSchema),
  }),
  pulse: z.array(KpiSchema),
  networkLanes: z.array(NetworkLaneSchema),
});

// ---------- shipments check ----------
export const ShipmentsCheckRequestSchema = z.object({
  refs: z.array(z.string().min(1)),
});
export const ShipmentsCheckResponseSchema = z.object({
  matched: z.array(z.string()),
  missingDocs: z.array(z.string()),
  notFound: z.array(z.string()),
});

// ---------- health ----------
export const HealthSchema = z.object({
  ok: z.boolean(),
  db: z.enum(['connected', 'down']),
  uptime: z.number(),
  ts: z.string(),
});

// ---------- inferred types ----------
export type Shipment = z.infer<typeof ShipmentRowSchema>;
export type ShipmentDetail = z.infer<typeof ShipmentDetailSchema>;
export type Mode = z.infer<typeof ModeSchema>;
export type ShipmentStatus = z.infer<typeof ShipmentStatusSchema>;
export type Milestone = z.infer<typeof MilestoneSchema>;
export type Sku = z.infer<typeof SkuSchema>;
export type SupplyChainLeg = z.infer<typeof SupplyChainLegSchema>;
export type PurchaseOrderRow = z.infer<typeof PurchaseOrderRowSchema>;
export type InboxThread = z.infer<typeof InboxThreadSchema>;
export type InboxMessage = z.infer<typeof InboxMessageSchema>;
export type Person = z.infer<typeof PersonSchema>;
export type Company = z.infer<typeof CompanySchema>;
export type Integration = z.infer<typeof IntegrationSchema>;
export type Invoice = z.infer<typeof InvoiceSchema>;
export type Alert = z.infer<typeof AlertSchema>;
export type BriefingItem = z.infer<typeof BriefingItemSchema>;
export type Kpi = z.infer<typeof KpiSchema>;
export type NetworkLane = z.infer<typeof NetworkLaneSchema>;
export type ControlTower = z.infer<typeof ControlTowerResponseSchema>;
export type Health = z.infer<typeof HealthSchema>;
