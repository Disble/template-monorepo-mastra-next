ALTER TABLE "workflow_runs_directory" DROP CONSTRAINT "workflow_runs_directory_pkey";--> statement-breakpoint
DROP INDEX "workflow_runs_directory_run_id_unique";--> statement-breakpoint
ALTER TABLE "workflow_runs_directory" DROP COLUMN "id";
--> statement-breakpoint
ALTER TABLE "workflow_runs_directory" ADD PRIMARY KEY ("run_id");
