CREATE TABLE "rate_limit_hits" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"key_hash" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "registrations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"preferred_name" varchar(80) NOT NULL,
	"email" varchar(254) NOT NULL,
	"industry" varchar(64) NOT NULL,
	"how_did_you_hear" varchar(64),
	"why_join" varchar(500) NOT NULL,
	"consent_accepted_at" timestamp with time zone NOT NULL,
	"confirmed_at" timestamp with time zone,
	"confirmation_token_hash" text NOT NULL,
	"confirmation_expires_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "rate_limit_hits_key_created_idx" ON "rate_limit_hits" USING btree ("key_hash","created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "registrations_email_lower_key" ON "registrations" USING btree (lower("email"));--> statement-breakpoint
CREATE UNIQUE INDEX "registrations_confirmation_token_hash_key" ON "registrations" USING btree ("confirmation_token_hash");--> statement-breakpoint
CREATE INDEX "registrations_confirmed_at_idx" ON "registrations" USING btree ("confirmed_at");--> statement-breakpoint
CREATE INDEX "registrations_created_at_idx" ON "registrations" USING btree ("created_at");