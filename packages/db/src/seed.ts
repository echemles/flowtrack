import { ulid } from 'ulid';
import { getDb, getSql } from './client';
import * as s from './schema';

const db = getDb();
const sql = getSql();

const id = () => ulid();

// ---------- companies ----------
type Co = { id: string; kind: 'client' | 'provider' | 'team' | 'factory'; name: string; country?: string; industry?: string; website?: string };
const C: Record<string, Co> = {
  innovtex: { id: id(), kind: 'team', name: 'Innovtex Logistics', country: 'US', industry: 'Logistics' },
  // 8 client companies (fits "8 client accounts")
  voltrex: { id: id(), kind: 'client', name: 'Voltrex Industrial', country: 'DE', industry: 'Industrial' },
  helix: { id: id(), kind: 'client', name: 'Helix Electronics', country: 'GB', industry: 'Electronics' },
  lumen: { id: id(), kind: 'client', name: 'Lumen Beauty Co.', country: 'US', industry: 'Beauty' },
  nordic: { id: id(), kind: 'client', name: 'Nordic Apparel Group', country: 'SE', industry: 'Apparel' },
  meridian: { id: id(), kind: 'client', name: 'Meridian Pharma', country: 'CH', industry: 'Pharma' },
  d2c: { id: id(), kind: 'client', name: 'Direct-to-Consumer Inc.', country: 'US', industry: 'D2C' },
  asia_hub: { id: id(), kind: 'client', name: 'Asia Commerce Hub', country: 'SG', industry: 'Commerce' },
  mercat: { id: id(), kind: 'client', name: 'Mercat Gourmet', country: 'ES', industry: 'Food' },
  // carriers / providers used in shipments + supply chain + POs
  maersk: { id: id(), kind: 'provider', name: 'Maersk', country: 'DK', industry: 'Ocean' },
  cma: { id: id(), kind: 'provider', name: 'CMA CGM', country: 'FR', industry: 'Ocean' },
  msc: { id: id(), kind: 'provider', name: 'MSC', country: 'CH', industry: 'Ocean' },
  hapag: { id: id(), kind: 'provider', name: 'Hapag-Lloyd', country: 'DE', industry: 'Ocean' },
  ba_cargo: { id: id(), kind: 'provider', name: 'British Airways Cargo', country: 'GB', industry: 'Air' },
  lh_cargo: { id: id(), kind: 'provider', name: 'Lufthansa Cargo', country: 'DE', industry: 'Air' },
  turkish: { id: id(), kind: 'provider', name: 'Turkish Cargo', country: 'TR', industry: 'Air' },
  dhl_freight: { id: id(), kind: 'provider', name: 'DHL Freight', country: 'DE', industry: 'Road' },
  dhl_global: { id: id(), kind: 'provider', name: 'DHL Global', country: 'DE', industry: 'Freight' },
  dhl_ecom: { id: id(), kind: 'provider', name: 'DHL', country: 'DE', industry: 'Ecom' },
  fedex: { id: id(), kind: 'provider', name: 'FedEx', country: 'US', industry: 'Air' },
  ups: { id: id(), kind: 'provider', name: 'UPS', country: 'US', industry: 'Courier' },
  knl: { id: id(), kind: 'provider', name: 'Kuehne+Nagel', country: 'CH', industry: 'Freight' },
  crane: { id: id(), kind: 'provider', name: 'Crane Worldwide', country: 'US', industry: 'Freight' },
  dsv: { id: id(), kind: 'provider', name: 'DSV Global', country: 'DK', industry: 'Freight' },
  europa: { id: id(), kind: 'provider', name: 'Europa Worldwide', country: 'GB', industry: 'Freight' },
  xpo: { id: id(), kind: 'provider', name: 'XPO Logistics', country: 'US', industry: 'Last Mile' },
  stuart: { id: id(), kind: 'provider', name: 'Stuart Madrid', country: 'ES', industry: 'Last Mile' },
  ryder: { id: id(), kind: 'provider', name: 'Ryder SF Bay', country: 'US', industry: 'Last Mile' },
  cat_lai: { id: id(), kind: 'provider', name: 'Cat Lai Port', country: 'VN', industry: 'Port' },
  rotterdam: { id: id(), kind: 'provider', name: 'Port of Rotterdam', country: 'NL', industry: 'Port' },
  voltrex_factory: { id: id(), kind: 'factory', name: 'Voltrex Components VN', country: 'VN', industry: 'Components' },
};

// fillers for the 65 companies / 56 active providers stat targets
const FILLER_PROVIDERS: string[] = [];
for (let i = 0; i < 30; i++) FILLER_PROVIDERS.push(`Regional Carrier ${i + 1}`);
const fillerProviders = FILLER_PROVIDERS.map((name) => ({
  id: id(),
  kind: 'provider' as const,
  name,
  country: ['US', 'DE', 'GB', 'FR', 'NL', 'SG', 'JP'][Math.floor(Math.random() * 7)] ?? 'US',
  industry: 'Freight',
}));

const allCompanies = [...Object.values(C), ...fillerProviders];

// people: get to ~96
const PEOPLE: Array<{ id: string; company_id: string; name: string; role: string; email: string; phone?: string; is_internal?: boolean }> = [
  // internal team (Innovtex)
  { id: id(), company_id: C.innovtex.id, name: 'Avery Chen', role: 'Operations Lead', email: 'avery@innovtex.com', is_internal: true },
  { id: id(), company_id: C.innovtex.id, name: 'Jordan Kim', role: 'Carrier Manager', email: 'jordan@innovtex.com', is_internal: true },
  { id: id(), company_id: C.innovtex.id, name: 'Priya Patel', role: 'Customs Specialist', email: 'priya@innovtex.com', is_internal: true },
  { id: id(), company_id: C.innovtex.id, name: 'Marco Rossi', role: 'Finance Ops', email: 'marco@innovtex.com', is_internal: true },
  { id: id(), company_id: C.innovtex.id, name: 'Sara Lopez', role: 'Customer Success', email: 'sara@innovtex.com', is_internal: true },
  { id: id(), company_id: C.innovtex.id, name: 'Diego Alvarez', role: 'Last-mile Coordinator', email: 'diego@innovtex.com', is_internal: true },
];
// Two contacts per major company, one filler each, until we hit ~96
const COMPANY_FOR_PEOPLE: Co[] = [
  C.voltrex, C.helix, C.lumen, C.nordic, C.meridian, C.d2c, C.asia_hub, C.mercat,
  C.maersk, C.cma, C.msc, C.ba_cargo, C.lh_cargo, C.dhl_freight, C.dhl_global, C.knl, C.crane, C.dsv, C.europa, C.xpo, C.stuart, C.ryder,
];
let pIdx = 0;
while (PEOPLE.length < 96) {
  const co = COMPANY_FOR_PEOPLE[pIdx % COMPANY_FOR_PEOPLE.length]!;
  PEOPLE.push({
    id: id(),
    company_id: co.id,
    name: `${['Alex', 'Sam', 'Robin', 'Casey', 'Drew', 'Kai', 'Jamie', 'Reese', 'Quinn', 'Sasha'][pIdx % 10]} ${['Smith', 'Lee', 'Garcia', 'Mueller', 'Tanaka', 'Singh', 'Costa', 'Nilsson'][pIdx % 8]}`,
    role: ['Account Manager', 'Operations', 'Compliance', 'Sales', 'Support'][pIdx % 5]!,
    email: `contact${pIdx + 1}@${co.name.toLowerCase().replace(/[^a-z]/g, '')}.com`,
    is_internal: false,
  });
  pIdx++;
}

// ---------- shipments ----------
type Ship = {
  id: string;
  ref: string;
  mode: 'air' | 'sea' | 'road' | 'ecom' | 'courier';
  status: 'planned' | 'dispatched' | 'in_transit' | 'arriving' | 'delivered' | 'overdue';
  origin_city: string;
  origin_country: string;
  dest_city: string;
  dest_country: string;
  carrier_company_id: string | null;
  client_company_id: string | null;
  atd: Date | null;
  eta_carrier: Date | null;
  eta_agi: Date | null;
  percent_complete: number;
  days_remaining: number | null;
  value_minor: number;
  currency: string;
  has_incident: boolean;
};

const d = (s: string) => new Date(s);

const SHIPMENTS: Ship[] = [
  {
    id: id(), ref: 'FT-26-S891', mode: 'sea', status: 'in_transit',
    origin_city: 'Ho Chi Minh', origin_country: 'VN', dest_city: 'Rotterdam', dest_country: 'NL',
    carrier_company_id: C.maersk.id, client_company_id: C.voltrex.id,
    atd: d('2026-04-08'), eta_carrier: d('2026-05-04'), eta_agi: d('2026-05-02'),
    percent_complete: 48, days_remaining: 13, value_minor: 12000000, currency: 'USD', has_incident: false,
  },
  {
    id: id(), ref: 'FT-26-A557', mode: 'air', status: 'delivered',
    origin_city: 'Mumbai', origin_country: 'IN', dest_city: 'London', dest_country: 'GB',
    carrier_company_id: C.ba_cargo.id, client_company_id: C.helix.id,
    atd: d('2026-05-04'), eta_carrier: d('2026-05-06'), eta_agi: d('2026-05-06'),
    percent_complete: 97, days_remaining: 0, value_minor: 8500000, currency: 'USD', has_incident: false,
  },
  {
    id: id(), ref: 'FT-26-A103', mode: 'air', status: 'arriving',
    origin_city: 'Frankfurt', origin_country: 'DE', dest_city: 'New York', dest_country: 'US',
    carrier_company_id: C.lh_cargo.id, client_company_id: C.helix.id,
    atd: d('2026-05-07'), eta_carrier: d('2026-05-09'), eta_agi: d('2026-05-09'),
    percent_complete: 88, days_remaining: 1, value_minor: 9200000, currency: 'USD', has_incident: false,
  },
  {
    id: id(), ref: 'FT-26-S442', mode: 'sea', status: 'in_transit',
    origin_city: 'Shanghai', origin_country: 'CN', dest_city: 'Long Beach', dest_country: 'US',
    carrier_company_id: C.cma.id, client_company_id: C.d2c.id,
    atd: d('2026-04-15'), eta_carrier: d('2026-05-22'), eta_agi: d('2026-05-21'),
    percent_complete: 55, days_remaining: 13, value_minor: 14500000, currency: 'USD', has_incident: false,
  },
  {
    id: id(), ref: 'FT-26-S918', mode: 'sea', status: 'overdue',
    origin_city: 'Antwerp', origin_country: 'BE', dest_city: 'Santos', dest_country: 'BR',
    carrier_company_id: C.msc.id, client_company_id: C.mercat.id,
    atd: d('2026-04-01'), eta_carrier: d('2026-05-05'), eta_agi: d('2026-05-08'),
    percent_complete: 72, days_remaining: -2, value_minor: 6800000, currency: 'USD', has_incident: true,
  },
  {
    id: id(), ref: 'FT-26-R221', mode: 'road', status: 'dispatched',
    origin_city: 'Madrid', origin_country: 'ES', dest_city: 'Paris', dest_country: 'FR',
    carrier_company_id: C.dhl_freight.id, client_company_id: C.mercat.id,
    atd: d('2026-05-08'), eta_carrier: d('2026-05-10'), eta_agi: d('2026-05-10'),
    percent_complete: 30, days_remaining: 1, value_minor: 1200000, currency: 'USD', has_incident: false,
  },
  {
    id: id(), ref: 'FT-26-R338', mode: 'road', status: 'in_transit',
    origin_city: 'Lyon', origin_country: 'FR', dest_city: 'Milan', dest_country: 'IT',
    carrier_company_id: C.dhl_freight.id, client_company_id: C.nordic.id,
    atd: d('2026-05-08'), eta_carrier: d('2026-05-09'), eta_agi: d('2026-05-09'),
    percent_complete: 65, days_remaining: 0, value_minor: 850000, currency: 'USD', has_incident: false,
  },
  {
    id: id(), ref: 'FT-26-E672', mode: 'ecom', status: 'arriving',
    origin_city: 'Shenzhen', origin_country: 'CN', dest_city: 'Berlin', dest_country: 'DE',
    carrier_company_id: C.dhl_ecom.id, client_company_id: C.lumen.id,
    atd: d('2026-04-30'), eta_carrier: d('2026-05-09'), eta_agi: d('2026-05-09'),
    percent_complete: 92, days_remaining: 0, value_minor: 320000, currency: 'USD', has_incident: false,
  },
  {
    id: id(), ref: 'FT-26-A774', mode: 'air', status: 'in_transit',
    origin_city: 'Istanbul', origin_country: 'TR', dest_city: 'Chicago', dest_country: 'US',
    carrier_company_id: C.turkish.id, client_company_id: C.meridian.id,
    atd: d('2026-05-07'), eta_carrier: d('2026-05-10'), eta_agi: d('2026-05-10'),
    percent_complete: 50, days_remaining: 1, value_minor: 4200000, currency: 'USD', has_incident: false,
  },
  {
    id: id(), ref: 'FT-26-C015', mode: 'courier', status: 'dispatched',
    origin_city: 'San Francisco', origin_country: 'US', dest_city: 'Austin', dest_country: 'US',
    carrier_company_id: C.ups.id, client_company_id: C.d2c.id,
    atd: d('2026-05-09'), eta_carrier: d('2026-05-10'), eta_agi: d('2026-05-10'),
    percent_complete: 20, days_remaining: 1, value_minor: 80000, currency: 'USD', has_incident: false,
  },
  {
    id: id(), ref: 'FT-26-S205', mode: 'sea', status: 'planned',
    origin_city: 'Yokohama', origin_country: 'JP', dest_city: 'Hamburg', dest_country: 'DE',
    carrier_company_id: C.hapag.id, client_company_id: C.asia_hub.id,
    atd: null, eta_carrier: d('2026-06-12'), eta_agi: d('2026-06-12'),
    percent_complete: 5, days_remaining: 34, value_minor: 11200000, currency: 'USD', has_incident: false,
  },
  {
    id: id(), ref: 'FT-26-A881', mode: 'air', status: 'arriving',
    origin_city: 'Singapore', origin_country: 'SG', dest_city: 'Los Angeles', dest_country: 'US',
    carrier_company_id: C.fedex.id, client_company_id: C.asia_hub.id,
    atd: d('2026-05-08'), eta_carrier: d('2026-05-09'), eta_agi: d('2026-05-09'),
    percent_complete: 90, days_remaining: 0, value_minor: 2700000, currency: 'USD', has_incident: false,
  },
];

const S891 = SHIPMENTS[0]!;
const A557 = SHIPMENTS[1]!;
const E672 = SHIPMENTS.find(x => x.ref === 'FT-26-E672')!;

const MILESTONE_LABELS = [
  'Booking Confirmed',
  'Cargo Received',
  'Export Customs Cleared',
  'Departed Origin',
  'In Transit',
  'Arrived at Destination',
  'Import Customs Cleared',
  'Out for Delivery',
];

type MilestoneSeed = { id: string; shipment_id: string; ord: number; label: string; at: Date | null; status: 'done' | 'active' | 'pending' };
const MILESTONES: MilestoneSeed[] = [];
// FT-26-A557 — all done
MILESTONE_LABELS.forEach((label, i) => {
  MILESTONES.push({
    id: id(), shipment_id: A557.id, ord: i + 1, label,
    at: new Date(Date.UTC(2026, 4, 1 + i)), status: 'done',
  });
});
// FT-26-S891 — first 4 done, ord 5 active, rest pending
MILESTONE_LABELS.forEach((label, i) => {
  let status: 'done' | 'active' | 'pending';
  if (i < 4) status = 'done';
  else if (i === 4) status = 'active';
  else status = 'pending';
  MILESTONES.push({
    id: id(), shipment_id: S891.id, ord: i + 1, label,
    at: status === 'pending' ? null : new Date(Date.UTC(2026, 3, 8 + i * 3)),
    status,
  });
});
// minimal milestones for E672 (so live-tracking demo works for ecom too)
['Booking Confirmed', 'Cargo Received', 'Departed Origin', 'In Transit'].forEach((label, i) =>
  MILESTONES.push({
    id: id(), shipment_id: E672.id, ord: i + 1, label,
    at: new Date(Date.UTC(2026, 3, 30 + i)), status: i < 3 ? 'done' : 'active',
  }),
);

// ---------- supply chain legs (FT-26-S891) ----------
const LEGS = [
  { provider: C.voltrex_factory.id, role: 'origin_supplier', on_time_pct: 96 },
  { provider: C.dsv.id, role: 'origin_freight', on_time_pct: 92 },
  { provider: C.cat_lai.id, role: 'origin_port', on_time_pct: 88 },
  { provider: C.maersk.id, role: 'vessel', on_time_pct: 94 },
  { provider: C.rotterdam.id, role: 'destination_port', on_time_pct: 95 },
  { provider: C.europa.id, role: 'destination_freight', on_time_pct: 91 },
  { provider: C.xpo.id, role: 'last_mile', on_time_pct: 98 },
].map((l, i) => ({ id: id(), shipment_id: S891.id, ord: i + 1, provider_company_id: l.provider, role: l.role, on_time_pct: l.on_time_pct }));

// ---------- skus + documents for FT-26-S891 ----------
const SKUS = [
  { sku: 'VLT-IND-220V', description: 'Industrial inverter 220V', qty: 240, weight_kg: 1080 },
  { sku: 'VLT-CAB-12M', description: 'Power cabling 12m', qty: 600, weight_kg: 720 },
  { sku: 'VLT-PCB-A4', description: 'Control PCB rev A4', qty: 1200, weight_kg: 180 },
].map(x => ({ id: id(), shipment_id: S891.id, ...x }));

const DOCS = [
  { kind: 'Bill of Lading', status: 'approved', url: null },
  { kind: 'Commercial Invoice', status: 'approved', url: null },
  { kind: 'Packing List', status: 'approved', url: null },
  { kind: 'Certificate of Origin', status: 'pending', url: null },
].map(x => ({ id: id(), shipment_id: S891.id, ...x }));

// ---------- POs ----------
const PO_S891 = { id: id(), number: 'SPO-26-S891', shipment_id: S891.id, provider_company_id: C.maersk.id, lines_count: 6, committed_minor: 150000, billed_minor: 30200, variance_minor: -39800, currency: 'USD', status: 'at_risk' as const };
const PO_LINES_S891 = [
  { description: 'Ocean freight Ho Chi Minh → Rotterdam', qty: 1, unit_price_minor: 80000 },
  { description: 'Container handling origin', qty: 1, unit_price_minor: 20000 },
  { description: 'Customs origin', qty: 1, unit_price_minor: 15000 },
  { description: 'Container handling destination', qty: 1, unit_price_minor: 18000 },
  { description: 'Customs destination', qty: 1, unit_price_minor: 12000 },
  { description: 'Last-mile', qty: 1, unit_price_minor: 5000 },
].map((l, i) => ({ id: id(), po_id: PO_S891.id, ord: i + 1, ...l }));

// 7 in-service POs (top providers committed totals targeted)
const IN_SERVICE = [
  { number: 'PO-26-A557', provider: C.knl.id, committed: 152000, billed: 152000, lines: 4, shipment: A557.id },
  { number: 'PO-26-A103', provider: C.dhl_global.id, committed: 114000, billed: 110000, lines: 5, shipment: SHIPMENTS[2]!.id },
  { number: 'PO-26-S442', provider: C.knl.id, committed: 92000, billed: 89000, lines: 4, shipment: SHIPMENTS[3]!.id },
  { number: 'PO-26-S918', provider: C.crane.id, committed: 71000, billed: 68000, lines: 3, shipment: SHIPMENTS[4]!.id },
  { number: 'PO-26-R221', provider: C.dhl_global.id, committed: 60000, billed: 58000, lines: 2, shipment: SHIPMENTS[5]!.id },
  { number: 'PO-26-R338', provider: C.dsv.id, committed: 60000, billed: 60000, lines: 2, shipment: SHIPMENTS[6]!.id },
  { number: 'PO-26-E672', provider: C.europa.id, committed: 58000, billed: 57000, lines: 2, shipment: E672.id },
].map(p => ({
  id: id(), number: p.number, shipment_id: p.shipment, provider_company_id: p.provider,
  lines_count: p.lines, committed_minor: p.committed, billed_minor: p.billed,
  variance_minor: p.billed - p.committed, currency: 'USD', status: 'in_service' as const,
}));
const ALL_POS = [PO_S891, ...IN_SERVICE];

const IN_SERVICE_LINES = IN_SERVICE.flatMap(po =>
  Array.from({ length: po.lines_count }, (_, i) => ({
    id: id(), po_id: po.id, ord: i + 1,
    description: `Line ${i + 1} for ${po.number}`,
    qty: 1, unit_price_minor: Math.floor(po.committed_minor / po.lines_count),
  })),
);

// ---------- invoices: 12 total. Outstanding $48,499, Disputed $23,740, Flagged 2 ----------
const INVOICES = [
  { number: 'INV-26-001', carrier: C.maersk.id, shipment: S891.id, expected: 150000, actual: 150000, status: 'outstanding' as const },
  { number: 'INV-26-002', carrier: C.knl.id, shipment: A557.id, expected: 90000, actual: 90000, status: 'outstanding' as const },
  { number: 'INV-26-003', carrier: C.dhl_global.id, shipment: SHIPMENTS[2]!.id, expected: 95000, actual: 99900, status: 'flagged' as const },
  { number: 'INV-26-004', carrier: C.cma.id, shipment: SHIPMENTS[3]!.id, expected: 110000, actual: 117000, status: 'disputed' as const },
  { number: 'INV-26-005', carrier: C.msc.id, shipment: SHIPMENTS[4]!.id, expected: 120000, actual: 120400, status: 'disputed' as const },
  { number: 'INV-26-006', carrier: C.dhl_freight.id, shipment: SHIPMENTS[5]!.id, expected: 50000, actual: 50000, status: 'paid' as const },
  { number: 'INV-26-007', carrier: C.dhl_freight.id, shipment: SHIPMENTS[6]!.id, expected: 40000, actual: 40000, status: 'paid' as const },
  { number: 'INV-26-008', carrier: C.dhl_ecom.id, shipment: E672.id, expected: 30000, actual: 31000, status: 'flagged' as const },
  { number: 'INV-26-009', carrier: C.turkish.id, shipment: SHIPMENTS[8]!.id, expected: 60000, actual: 60000, status: 'paid' as const },
  { number: 'INV-26-010', carrier: C.ups.id, shipment: SHIPMENTS[9]!.id, expected: 8000, actual: 8000, status: 'paid' as const },
  { number: 'INV-26-011', carrier: C.hapag.id, shipment: SHIPMENTS[10]!.id, expected: 95000, actual: 95000, status: 'outstanding' as const },
  { number: 'INV-26-012', carrier: C.fedex.id, shipment: SHIPMENTS[11]!.id, expected: 27000, actual: 27000, status: 'outstanding' as const },
];

// adjust to hit $48,499 outstanding total + $23,740 disputed total
INVOICES[0]!.expected = 14999; INVOICES[0]!.actual = 14999;
INVOICES[1]!.expected = 9000; INVOICES[1]!.actual = 9000;
INVOICES[10]!.expected = 16000; INVOICES[10]!.actual = 16000;
INVOICES[11]!.expected = 8500; INVOICES[11]!.actual = 8500;
// outstanding sum: 14999 + 9000 + 16000 + 8500 = 48,499 ✓
INVOICES[3]!.expected = 11500; INVOICES[3]!.actual = 11870; // disputed
INVOICES[4]!.expected = 11500; INVOICES[4]!.actual = 11870; // disputed
// disputed actual sum: 11870 + 11870 = 23,740 ✓
// flagged: INV-003 + INV-008 = 2 ✓

const INVOICE_ROWS = INVOICES.map(i => ({
  id: id(), number: i.number, carrier_company_id: i.carrier, shipment_id: i.shipment,
  expected_minor: i.expected, actual_minor: i.actual, variance_minor: i.actual - i.expected,
  currency: 'USD', status: i.status,
}));

const INVOICE_LINES = INVOICE_ROWS.flatMap(inv =>
  Array.from({ length: 2 }, (_, i) => ({
    id: id(), invoice_id: inv.id, ord: i + 1,
    description: `Line ${i + 1}`, qty: 1, unit_price_minor: Math.floor(inv.actual_minor / 2),
  })),
);

// ---------- inbox ----------
const THREADS_RAW = [
  { channel: 'whatsapp' as const, counterpart: C.maersk.id, subject: 'Maersk Vietnam — vessel update FT-26-S891', folder: 'inbox' as const, unread: true, starred: true, shipment_ref: S891.ref },
  { channel: 'email' as const, counterpart: C.crane.id, subject: 'Crane Worldwide — POD ready', folder: 'inbox' as const, unread: true, starred: false, shipment_ref: SHIPMENTS[4]!.ref },
  { channel: 'email' as const, counterpart: C.voltrex_factory.id, subject: 'Voltrex Components VN — packing list', folder: 'inbox' as const, unread: false, starred: false, shipment_ref: S891.ref },
  { channel: 'sms' as const, counterpart: C.stuart.id, subject: 'Stuart Madrid — driver arriving 5 min', folder: 'inbox' as const, unread: false, starred: false, shipment_ref: SHIPMENTS[5]!.ref },
  { channel: 'voice' as const, counterpart: C.dhl_freight.id, subject: 'DHL Freight — call transcript', folder: 'agi_escalations' as const, unread: false, starred: false, shipment_ref: SHIPMENTS[6]!.ref },
  { channel: 'slack' as const, counterpart: C.turkish.id, subject: 'Turkish Cargo — load tender', folder: 'agi_escalations' as const, unread: false, starred: false, shipment_ref: SHIPMENTS[8]!.ref },
  { channel: 'teams' as const, counterpart: C.ryder.id, subject: 'Ryder SF Bay — last mile capacity', folder: 'inbox' as const, unread: true, starred: false, shipment_ref: SHIPMENTS[9]!.ref },
  // padding for inbox count = 8
  { channel: 'email' as const, counterpart: C.knl.id, subject: 'Kuehne+Nagel — invoice batch ready', folder: 'inbox' as const, unread: true, starred: true, shipment_ref: null },
  // 1 archived to give "archived" non-zero
  { channel: 'email' as const, counterpart: C.dhl_global.id, subject: 'DHL Global — closed PO confirmation', folder: 'archived' as const, unread: false, starred: false, shipment_ref: null },
  // a third agi_escalations to hit 3
  { channel: 'whatsapp' as const, counterpart: C.msc.id, subject: 'MSC — incident escalated', folder: 'agi_escalations' as const, unread: false, starred: false, shipment_ref: SHIPMENTS[4]!.ref },
];
const THREADS = THREADS_RAW.map((t, i) => ({
  id: id(), channel: t.channel, counterpart_company_id: t.counterpart,
  subject: t.subject, last_at: new Date(Date.UTC(2026, 4, 9, 8 + i)),
  unread: t.unread, starred: t.starred, folder: t.folder, shipment_ref: t.shipment_ref,
}));

const MESSAGES = THREADS.flatMap((t, ti) =>
  [
    { from_name: 'Counterpart', body: 'Initial message body', direction: 'in' as const },
    { from_name: 'Innovtex', body: 'Acknowledged.', direction: 'out' as const },
  ].map((m, i) => ({
    id: id(), thread_id: t.id, ord: i + 1, from_name: m.from_name,
    body: m.body, at: new Date(Date.UTC(2026, 4, 9, 8 + ti, i * 5)), direction: m.direction,
  })),
);

// ---------- integrations: 4 connected total ----------
const INTEGRATIONS_RAW = [
  // aggregators
  { tier: 'aggregators' as const, key: 'project44', name: 'project44', plan: 'Premium', status: 'connected' as const, setup_minutes: null },
  { tier: 'aggregators' as const, key: 'fourkites', name: 'FourKites', plan: 'Enterprise', status: 'available' as const, setup_minutes: 30 },
  { tier: 'aggregators' as const, key: 'vizion', name: 'Vizion', plan: 'Standard', status: 'available' as const, setup_minutes: 20 },
  { tier: 'aggregators' as const, key: '17track', name: '17Track', plan: 'Plus', status: 'available' as const, setup_minutes: 10 },
  { tier: 'aggregators' as const, key: 'aftership', name: 'AfterShip', plan: 'Pro', status: 'available' as const, setup_minutes: 15 },
  { tier: 'aggregators' as const, key: 'easypost', name: 'EasyPost', plan: 'Standard', status: 'available' as const, setup_minutes: 15 },
  // carriers direct
  { tier: 'carriers_direct' as const, key: 'maersk', name: 'Maersk', plan: 'Direct API', status: 'connecting' as const, setup_minutes: 45 },
  { tier: 'carriers_direct' as const, key: 'cma', name: 'CMA CGM', plan: 'Direct API', status: 'available' as const, setup_minutes: 45 },
  { tier: 'carriers_direct' as const, key: 'msc', name: 'MSC', plan: 'Direct API', status: 'available' as const, setup_minutes: 45 },
  { tier: 'carriers_direct' as const, key: 'hapag', name: 'Hapag-Lloyd', plan: 'Direct API', status: 'available' as const, setup_minutes: 45 },
  { tier: 'carriers_direct' as const, key: 'dhl', name: 'DHL', plan: 'Direct API', status: 'available' as const, setup_minutes: 30 },
  { tier: 'carriers_direct' as const, key: 'fedex', name: 'FedEx', plan: 'Direct API', status: 'available' as const, setup_minutes: 30 },
  { tier: 'carriers_direct' as const, key: 'ups', name: 'UPS', plan: 'Direct API', status: 'available' as const, setup_minutes: 30 },
  { tier: 'carriers_direct' as const, key: 'lufthansa', name: 'Lufthansa Cargo', plan: 'Direct API', status: 'available' as const, setup_minutes: 30 },
  // ERP
  { tier: 'erp' as const, key: 'netsuite', name: 'NetSuite', plan: 'Enterprise', status: 'available' as const, setup_minutes: 90 },
  { tier: 'erp' as const, key: 's4hana', name: 'SAP S/4HANA', plan: 'Enterprise', status: 'available' as const, setup_minutes: 120 },
  { tier: 'erp' as const, key: 'oracle', name: 'Oracle Fusion', plan: 'Enterprise', status: 'available' as const, setup_minutes: 120 },
  { tier: 'erp' as const, key: 'msdyn365', name: 'MS Dynamics 365', plan: 'Enterprise', status: 'available' as const, setup_minutes: 90 },
  // communications
  { tier: 'communications' as const, key: 'gmail', name: 'Gmail', plan: 'Workspace', status: 'connected' as const, setup_minutes: null },
  { tier: 'communications' as const, key: 'outlook365', name: 'Outlook 365', plan: 'Business', status: 'available' as const, setup_minutes: 10 },
  { tier: 'communications' as const, key: 'whatsapp_biz', name: 'WhatsApp Business', plan: 'Cloud', status: 'connected' as const, setup_minutes: null },
  { tier: 'communications' as const, key: 'slack', name: 'Slack', plan: 'Pro', status: 'connected' as const, setup_minutes: null },
  { tier: 'communications' as const, key: 'teams', name: 'Microsoft Teams', plan: 'Business', status: 'available' as const, setup_minutes: 10 },
  { tier: 'communications' as const, key: 'twilio_sms', name: 'Twilio SMS', plan: 'Pay-as-you-go', status: 'available' as const, setup_minutes: 5 },
  // pad to 28 total
  { tier: 'aggregators' as const, key: 'shipsy', name: 'Shipsy', plan: 'Standard', status: 'available' as const, setup_minutes: 25 },
  { tier: 'aggregators' as const, key: 'flexport', name: 'Flexport API', plan: 'Standard', status: 'available' as const, setup_minutes: 30 },
  { tier: 'erp' as const, key: 'sapb1', name: 'SAP Business One', plan: 'SMB', status: 'available' as const, setup_minutes: 60 },
  { tier: 'communications' as const, key: 'zoom_phone', name: 'Zoom Phone', plan: 'Business', status: 'available' as const, setup_minutes: 15 },
];
// Connected count check: project44, gmail, whatsapp, slack = 4 ✓
const INTEGRATIONS = INTEGRATIONS_RAW.map(i => ({ id: id(), ...i }));

// ---------- alerts ----------
const ALERTS_RAW = [
  { kind: 'reroute_approval', title: 'Reroute approval needed', body: 'Hapag suggests reroute via Hamburg', severity: 'high' as const, shipment_ref: SHIPMENTS[10]!.ref },
  { kind: 'missing_document', title: 'Missing document — Cert. of Origin', body: 'FT-26-S891 cert of origin not yet uploaded', severity: 'med' as const, shipment_ref: S891.ref },
  { kind: 'hs_code_reclassification', title: 'HS code reclassification proposed', body: '8504.40 → 8504.50 saves $420', severity: 'low' as const, shipment_ref: S891.ref },
  { kind: 'sms_driver_arriving', title: 'Driver arriving in 5 minutes', body: 'Stuart driver inbound to Madrid DC', severity: 'low' as const, shipment_ref: SHIPMENTS[5]!.ref },
  { kind: 'invoice_variance', title: 'Invoice variance flagged', body: 'INV-26-003 +5.2% over expected', severity: 'med' as const, shipment_ref: SHIPMENTS[2]!.ref },
  { kind: 'overdue', title: 'Shipment overdue', body: 'FT-26-S918 ETA passed by 2 days', severity: 'high' as const, shipment_ref: SHIPMENTS[4]!.ref },
  { kind: 'incident', title: 'Incident reported', body: 'Container damage flagged at port', severity: 'high' as const, shipment_ref: SHIPMENTS[4]!.ref },
  { kind: 'agi_escalation', title: 'AGI Escalation', body: 'Customs query awaiting reply', severity: 'high' as const, shipment_ref: S891.ref },
  { kind: 'missing_document', title: 'Missing Document', body: 'BOL outstanding on FT-26-A103', severity: 'med' as const, shipment_ref: SHIPMENTS[2]!.ref },
  { kind: 'invoice_variance', title: 'Invoice Variance', body: 'INV-26-008 flagged +3.3%', severity: 'med' as const, shipment_ref: E672.ref },
];
const ALERTS = ALERTS_RAW.map((a, i) => ({
  id: id(), ...a, created_at: new Date(Date.UTC(2026, 4, 9, 6 + i)),
}));

// ---------- daily briefing items ----------
const BRIEFING = [
  { title: '12 shipments in motion', body: '4 arriving today, 1 overdue.', link: '/shipments' },
  { title: '$371K value in transit', body: 'Across SEA, AIR, ROAD, ECOM.', link: '/' },
  { title: 'On-time delivery 100% (last 7d)', body: 'No SLA misses since FT-26-S801.', link: '/' },
].map(b => ({ id: id(), ...b }));

// ---------- KPIs ----------
const KPIS = [
  { slug: 'on_time_delivery', label: 'On-Time Delivery', value_minor: null, value_pct: 100, currency: null },
  { slug: 'value_in_transit', label: 'Value in Transit', value_minor: 37100000, value_pct: null, currency: 'USD' },
  { slug: 'outstanding', label: 'Outstanding', value_minor: 4849900, value_pct: null, currency: 'USD' },
  { slug: 'disputed', label: 'Disputed', value_minor: 2374000, value_pct: null, currency: 'USD' },
  { slug: 'variance_exposure', label: 'Variance Exposure', value_minor: 339000, value_pct: null, currency: 'USD' },
].map(k => ({ id: id(), ...k, text_array: null as string[] | null }));

KPIS.push({
  id: id(), slug: 'industry_coverage', label: 'Industry Coverage',
  value_minor: null, value_pct: null, currency: null,
  text_array: ['Industrial', 'Electronics', 'Beauty', 'Apparel', 'Pharma', 'D2C', 'Commerce', 'Food'],
});

// ---------- network lanes (9 active) ----------
const LANES_RAW = [
  ['Ho Chi Minh', 'VN', 'Rotterdam', 'NL', 'sea'],
  ['Mumbai', 'IN', 'London', 'GB', 'air'],
  ['Frankfurt', 'DE', 'New York', 'US', 'air'],
  ['Shanghai', 'CN', 'Long Beach', 'US', 'sea'],
  ['Antwerp', 'BE', 'Santos', 'BR', 'sea'],
  ['Madrid', 'ES', 'Paris', 'FR', 'road'],
  ['Lyon', 'FR', 'Milan', 'IT', 'road'],
  ['Shenzhen', 'CN', 'Berlin', 'DE', 'ecom'],
  ['Singapore', 'SG', 'Los Angeles', 'US', 'air'],
] as const;
const LANES = LANES_RAW.map((l, i) => ({
  id: id(), origin_city: l[0], origin_country: l[1], dest_city: l[2], dest_country: l[3],
  mode: l[4] as 'air' | 'sea' | 'road' | 'ecom' | 'courier',
  is_active: true, weight: 5 + (i % 5),
}));

// ---------- truncate + insert ----------
console.log('truncating tables…');
await sql`truncate table
  invoice_lines, invoices,
  purchase_order_lines, purchase_orders,
  inbox_messages, inbox_threads,
  shipment_documents, shipment_skus, supply_chain_legs, shipment_milestones, shipments,
  alerts, daily_briefing_items, kpis, integrations, network_lanes,
  people, companies
restart identity cascade`;

console.log('inserting companies…');
await db.insert(s.companies).values(allCompanies);
console.log('inserting people…');
await db.insert(s.people).values(PEOPLE);
console.log('inserting shipments…');
await db.insert(s.shipments).values(SHIPMENTS);
await db.insert(s.shipment_milestones).values(MILESTONES);
await db.insert(s.shipment_skus).values(SKUS);
await db.insert(s.shipment_documents).values(DOCS);
await db.insert(s.supply_chain_legs).values(LEGS);
console.log('inserting POs…');
await db.insert(s.purchase_orders).values(ALL_POS);
await db.insert(s.purchase_order_lines).values([...PO_LINES_S891, ...IN_SERVICE_LINES]);
console.log('inserting invoices…');
await db.insert(s.invoices).values(INVOICE_ROWS);
await db.insert(s.invoice_lines).values(INVOICE_LINES);
console.log('inserting inbox…');
await db.insert(s.inbox_threads).values(THREADS);
await db.insert(s.inbox_messages).values(MESSAGES);
console.log('inserting integrations + alerts + briefing + kpis + lanes…');
await db.insert(s.integrations).values(INTEGRATIONS);
await db.insert(s.alerts).values(ALERTS);
await db.insert(s.daily_briefing_items).values(BRIEFING);
await db.insert(s.kpis).values(KPIS);
await db.insert(s.network_lanes).values(LANES);

console.log(`seed complete: ${allCompanies.length} companies, ${PEOPLE.length} people, ${SHIPMENTS.length} shipments`);
await sql.end();
