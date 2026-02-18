CREATE TABLE "workflow_runs_directory" (
	"id" serial PRIMARY KEY NOT NULL,
	"run_id" text NOT NULL,
	"workflow_key" text NOT NULL,
	"workflow_version" text NOT NULL,
	"display_value" text NOT NULL,
	"form_input" jsonb NOT NULL,
	"owner_user_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "workflow_runs_directory" ADD CONSTRAINT "workflow_runs_directory_owner_user_id_user_id_fk" FOREIGN KEY ("owner_user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "workflow_runs_directory_run_id_unique" ON "workflow_runs_directory" USING btree ("run_id");--> statement-breakpoint
CREATE INDEX "workflow_runs_directory_owner_created_at_idx" ON "workflow_runs_directory" USING btree ("owner_user_id","created_at");--> statement-breakpoint
CREATE INDEX "workflow_runs_directory_workflow_key_created_at_idx" ON "workflow_runs_directory" USING btree ("workflow_key","created_at");