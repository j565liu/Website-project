CREATE TABLE "event_reservations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"event_id" varchar(100) NOT NULL,
	"registration_id" uuid NOT NULL,
	"reserved_at" timestamp with time zone NOT NULL,
	"cancelled_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "event_reservations" ADD CONSTRAINT "event_reservations_registration_id_registrations_id_fk" FOREIGN KEY ("registration_id") REFERENCES "public"."registrations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "event_reservations_event_registration_key" ON "event_reservations" USING btree ("event_id","registration_id");--> statement-breakpoint
CREATE INDEX "event_reservations_event_id_idx" ON "event_reservations" USING btree ("event_id");