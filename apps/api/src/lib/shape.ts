// Drizzle row → API shape helpers.
import type { Shipment } from '@flowtrack/shared';

export function shapeShipment(row: any): Shipment {
  return {
    id: row.id,
    ref: row.ref,
    mode: row.mode,
    status: row.status,
    origin_city: row.origin_city,
    origin_country: row.origin_country,
    dest_city: row.dest_city,
    dest_country: row.dest_country,
    carrier: row.carrier_name ?? null,
    client: row.client_name ?? null,
    atd: row.atd ? new Date(row.atd).toISOString() : null,
    eta_carrier: row.eta_carrier ? new Date(row.eta_carrier).toISOString() : null,
    eta_agi: row.eta_agi ? new Date(row.eta_agi).toISOString() : null,
    percent_complete: row.percent_complete ?? 0,
    days_remaining: row.days_remaining,
    value_minor: row.value_minor ?? 0,
    currency: row.currency ?? 'USD',
    has_incident: !!row.has_incident,
  };
}
