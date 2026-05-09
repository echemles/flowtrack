CREATE TYPE "public"."channel" AS ENUM('email', 'whatsapp', 'sms', 'voice', 'slack', 'teams');--> statement-breakpoint
CREATE TYPE "public"."company_kind" AS ENUM('client', 'provider', 'team', 'factory');--> statement-breakpoint
CREATE TYPE "public"."direction" AS ENUM('in', 'out');--> statement-breakpoint
CREATE TYPE "public"."folder" AS ENUM('inbox', 'starred', 'agi_escalations', 'archived');--> statement-breakpoint
CREATE TYPE "public"."integration_status" AS ENUM('connected', 'connecting', 'available');--> statement-breakpoint
CREATE TYPE "public"."integration_tier" AS ENUM('aggregators', 'carriers_direct', 'erp', 'communications');--> statement-breakpoint
CREATE TYPE "public"."invoice_status" AS ENUM('outstanding', 'disputed', 'paid', 'flagged');--> statement-breakpoint
CREATE TYPE "public"."milestone_status" AS ENUM('done', 'active', 'pending');--> statement-breakpoint
CREATE TYPE "public"."mode" AS ENUM('air', 'sea', 'road', 'ecom', 'courier');--> statement-breakpoint
CREATE TYPE "public"."po_status" AS ENUM('at_risk', 'in_service', 'closed');--> statement-breakpoint
CREATE TYPE "public"."severity" AS ENUM('low', 'med', 'high');--> statement-breakpoint
CREATE TYPE "public"."shipment_status" AS ENUM('planned', 'dispatched', 'in_transit', 'arriving', 'delivered', 'overdue');--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "alerts" (
	"id" text PRIMARY KEY NOT NULL,
	"kind" text NOT NULL,
	"title" text NOT NULL,
	"body" text NOT NULL,
	"severity" "severity" NOT NULL,
	"shipment_ref" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "companies" (
	"id" text PRIMARY KEY NOT NULL,
	"kind" "company_kind" NOT NULL,
	"name" text NOT NULL,
	"country" text,
	"website" text,
	"industry" text,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "daily_briefing_items" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"body" text NOT NULL,
	"link" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "inbox_messages" (
	"id" text PRIMARY KEY NOT NULL,
	"thread_id" text NOT NULL,
	"ord" integer NOT NULL,
	"from_name" text NOT NULL,
	"body" text NOT NULL,
	"at" timestamp with time zone NOT NULL,
	"direction" "direction" NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "inbox_threads" (
	"id" text PRIMARY KEY NOT NULL,
	"channel" "channel" NOT NULL,
	"counterpart_company_id" text,
	"subject" text NOT NULL,
	"last_at" timestamp with time zone NOT NULL,
	"unread" boolean DEFAULT false NOT NULL,
	"starred" boolean DEFAULT false NOT NULL,
	"folder" "folder" NOT NULL,
	"shipment_ref" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "integrations" (
	"id" text PRIMARY KEY NOT NULL,
	"tier" "integration_tier" NOT NULL,
	"key" text NOT NULL,
	"name" text NOT NULL,
	"plan" text,
	"status" "integration_status" NOT NULL,
	"setup_minutes" integer,
	CONSTRAINT "integrations_key_unique" UNIQUE("key")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "invoice_lines" (
	"id" text PRIMARY KEY NOT NULL,
	"invoice_id" text NOT NULL,
	"ord" integer NOT NULL,
	"description" text NOT NULL,
	"qty" integer NOT NULL,
	"unit_price_minor" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "invoices" (
	"id" text PRIMARY KEY NOT NULL,
	"number" text NOT NULL,
	"carrier_company_id" text,
	"shipment_id" text,
	"expected_minor" integer DEFAULT 0 NOT NULL,
	"actual_minor" integer DEFAULT 0 NOT NULL,
	"variance_minor" integer DEFAULT 0 NOT NULL,
	"currency" text DEFAULT 'USD' NOT NULL,
	"status" "invoice_status" NOT NULL,
	CONSTRAINT "invoices_number_unique" UNIQUE("number")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "kpis" (
	"id" text PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"label" text NOT NULL,
	"value_minor" integer,
	"value_pct" integer,
	"currency" text,
	"text_array" text[],
	CONSTRAINT "kpis_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "network_lanes" (
	"id" text PRIMARY KEY NOT NULL,
	"origin_city" text NOT NULL,
	"origin_country" text NOT NULL,
	"dest_city" text NOT NULL,
	"dest_country" text NOT NULL,
	"mode" "mode" NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"weight" integer DEFAULT 1 NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "people" (
	"id" text PRIMARY KEY NOT NULL,
	"company_id" text,
	"name" text NOT NULL,
	"role" text,
	"email" text,
	"phone" text,
	"slack" text,
	"teams_handle" text,
	"is_internal" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "purchase_order_lines" (
	"id" text PRIMARY KEY NOT NULL,
	"po_id" text NOT NULL,
	"ord" integer NOT NULL,
	"description" text NOT NULL,
	"qty" integer NOT NULL,
	"unit_price_minor" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "purchase_orders" (
	"id" text PRIMARY KEY NOT NULL,
	"number" text NOT NULL,
	"shipment_id" text,
	"provider_company_id" text,
	"lines_count" integer DEFAULT 0 NOT NULL,
	"committed_minor" integer DEFAULT 0 NOT NULL,
	"billed_minor" integer DEFAULT 0 NOT NULL,
	"variance_minor" integer DEFAULT 0 NOT NULL,
	"currency" text DEFAULT 'USD' NOT NULL,
	"status" "po_status" NOT NULL,
	CONSTRAINT "purchase_orders_number_unique" UNIQUE("number")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "shipment_documents" (
	"id" text PRIMARY KEY NOT NULL,
	"shipment_id" text NOT NULL,
	"kind" text NOT NULL,
	"status" text NOT NULL,
	"url" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "shipment_milestones" (
	"id" text PRIMARY KEY NOT NULL,
	"shipment_id" text NOT NULL,
	"ord" integer NOT NULL,
	"label" text NOT NULL,
	"at" timestamp with time zone,
	"status" "milestone_status" NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "shipment_skus" (
	"id" text PRIMARY KEY NOT NULL,
	"shipment_id" text NOT NULL,
	"sku" text NOT NULL,
	"description" text NOT NULL,
	"qty" integer NOT NULL,
	"weight_kg" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "shipments" (
	"id" text PRIMARY KEY NOT NULL,
	"ref" text NOT NULL,
	"mode" "mode" NOT NULL,
	"status" "shipment_status" NOT NULL,
	"origin_city" text NOT NULL,
	"origin_country" text NOT NULL,
	"dest_city" text NOT NULL,
	"dest_country" text NOT NULL,
	"carrier_company_id" text,
	"client_company_id" text,
	"atd" timestamp with time zone,
	"eta_carrier" timestamp with time zone,
	"eta_agi" timestamp with time zone,
	"percent_complete" integer DEFAULT 0 NOT NULL,
	"days_remaining" integer,
	"value_minor" integer DEFAULT 0 NOT NULL,
	"currency" text DEFAULT 'USD' NOT NULL,
	"has_incident" boolean DEFAULT false NOT NULL,
	CONSTRAINT "shipments_ref_unique" UNIQUE("ref")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "supply_chain_legs" (
	"id" text PRIMARY KEY NOT NULL,
	"shipment_id" text NOT NULL,
	"ord" integer NOT NULL,
	"provider_company_id" text,
	"role" text NOT NULL,
	"on_time_pct" integer NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "inbox_messages" ADD CONSTRAINT "inbox_messages_thread_id_inbox_threads_id_fk" FOREIGN KEY ("thread_id") REFERENCES "public"."inbox_threads"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "inbox_threads" ADD CONSTRAINT "inbox_threads_counterpart_company_id_companies_id_fk" FOREIGN KEY ("counterpart_company_id") REFERENCES "public"."companies"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "invoice_lines" ADD CONSTRAINT "invoice_lines_invoice_id_invoices_id_fk" FOREIGN KEY ("invoice_id") REFERENCES "public"."invoices"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "invoices" ADD CONSTRAINT "invoices_carrier_company_id_companies_id_fk" FOREIGN KEY ("carrier_company_id") REFERENCES "public"."companies"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "invoices" ADD CONSTRAINT "invoices_shipment_id_shipments_id_fk" FOREIGN KEY ("shipment_id") REFERENCES "public"."shipments"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "people" ADD CONSTRAINT "people_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "purchase_order_lines" ADD CONSTRAINT "purchase_order_lines_po_id_purchase_orders_id_fk" FOREIGN KEY ("po_id") REFERENCES "public"."purchase_orders"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "purchase_orders" ADD CONSTRAINT "purchase_orders_shipment_id_shipments_id_fk" FOREIGN KEY ("shipment_id") REFERENCES "public"."shipments"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "purchase_orders" ADD CONSTRAINT "purchase_orders_provider_company_id_companies_id_fk" FOREIGN KEY ("provider_company_id") REFERENCES "public"."companies"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "shipment_documents" ADD CONSTRAINT "shipment_documents_shipment_id_shipments_id_fk" FOREIGN KEY ("shipment_id") REFERENCES "public"."shipments"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "shipment_milestones" ADD CONSTRAINT "shipment_milestones_shipment_id_shipments_id_fk" FOREIGN KEY ("shipment_id") REFERENCES "public"."shipments"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "shipment_skus" ADD CONSTRAINT "shipment_skus_shipment_id_shipments_id_fk" FOREIGN KEY ("shipment_id") REFERENCES "public"."shipments"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "shipments" ADD CONSTRAINT "shipments_carrier_company_id_companies_id_fk" FOREIGN KEY ("carrier_company_id") REFERENCES "public"."companies"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "shipments" ADD CONSTRAINT "shipments_client_company_id_companies_id_fk" FOREIGN KEY ("client_company_id") REFERENCES "public"."companies"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "supply_chain_legs" ADD CONSTRAINT "supply_chain_legs_shipment_id_shipments_id_fk" FOREIGN KEY ("shipment_id") REFERENCES "public"."shipments"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "supply_chain_legs" ADD CONSTRAINT "supply_chain_legs_provider_company_id_companies_id_fk" FOREIGN KEY ("provider_company_id") REFERENCES "public"."companies"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
