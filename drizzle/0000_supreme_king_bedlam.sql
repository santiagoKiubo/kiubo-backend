CREATE TABLE "brokers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"specialties" text[] DEFAULT '{}' NOT NULL,
	"phone" text,
	"email" text,
	"city" text,
	"active" boolean DEFAULT true NOT NULL,
	"google_sheet_id" text NOT NULL,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "leads" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"phone" text NOT NULL,
	"product" text NOT NULL,
	"name" text,
	"age" integer,
	"city" text,
	"income_range" text,
	"family_members" integer,
	"current_insurer" text,
	"coverage_amount" text,
	"preexisting_conditions" text,
	"assigned_broker_id" uuid,
	"status" text DEFAULT 'collecting' NOT NULL,
	"user_rating" integer,
	"user_feedback" text,
	"broker_reported_status" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"sent_to_broker_at" timestamp with time zone,
	"closed_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"phone" text PRIMARY KEY NOT NULL,
	"thread_id" text,
	"current_product" text,
	"current_lead_id" uuid,
	"missing_fields" jsonb DEFAULT '[]'::jsonb,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "leads" ADD CONSTRAINT "leads_assigned_broker_id_brokers_id_fk" FOREIGN KEY ("assigned_broker_id") REFERENCES "public"."brokers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_current_lead_id_leads_id_fk" FOREIGN KEY ("current_lead_id") REFERENCES "public"."leads"("id") ON DELETE no action ON UPDATE no action;