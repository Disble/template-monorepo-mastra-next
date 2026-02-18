import { index, jsonb, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { user } from "./users";

export const workflowRunsDirectory = pgTable(
  "workflow_runs_directory",
  {
    runId: text("run_id").primaryKey(),
    workflowKey: text("workflow_key").notNull(),
    workflowVersion: text("workflow_version").notNull(),
    displayValue: text("display_value").notNull(),
    formInput: jsonb("form_input").$type<Record<string, unknown>>().notNull(),
    ownerUserId: text("owner_user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
    deletedAt: timestamp("deleted_at"),
  },
  (table) => [
    index("workflow_runs_directory_owner_created_at_idx").on(
      table.ownerUserId,
      table.createdAt,
    ),
    index("workflow_runs_directory_workflow_key_created_at_idx").on(
      table.workflowKey,
      table.createdAt,
    ),
  ],
);

export type WorkflowRunsDirectoryInsert =
  typeof workflowRunsDirectory.$inferInsert;
export type WorkflowRunsDirectory = typeof workflowRunsDirectory.$inferSelect;
