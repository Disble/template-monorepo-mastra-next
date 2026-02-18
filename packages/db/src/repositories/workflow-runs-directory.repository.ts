import type { SQL } from "drizzle-orm";
import { and, count, desc, eq, ilike, isNull } from "drizzle-orm";
import type { DbClient } from "../client";
import {
  type WorkflowRunsDirectoryInsert,
  workflowRunsDirectory,
} from "../schema/workflow-runs-directory";

interface ListWorkflowRunsByOwnerParams {
  ownerUserId: string;
  workflowKey?: string;
  limit?: number;
  offset?: number;
  search?: string;
}

const DEFAULT_PAGE_SIZE = 25;

function buildOwnerWhereConditions(
  params: ListWorkflowRunsByOwnerParams,
): SQL[] {
  const conditions: SQL[] = [
    eq(workflowRunsDirectory.ownerUserId, params.ownerUserId),
    isNull(workflowRunsDirectory.deletedAt),
  ];

  if (params.workflowKey) {
    conditions.push(eq(workflowRunsDirectory.workflowKey, params.workflowKey));
  }

  if (params.search) {
    conditions.push(
      ilike(workflowRunsDirectory.displayValue, `%${params.search}%`),
    );
  }

  return conditions;
}

export const createWorkflowRunDirectoryEntry = async (
  db: DbClient,
  newEntry: WorkflowRunsDirectoryInsert,
) => {
  return db.insert(workflowRunsDirectory).values(newEntry).returning();
};

export const listWorkflowRunsByOwner = async (
  db: DbClient,
  params: ListWorkflowRunsByOwnerParams,
) => {
  const pageSize = params.limit ?? DEFAULT_PAGE_SIZE;
  const conditions = buildOwnerWhereConditions(params);

  return db.query.workflowRunsDirectory.findMany({
    where: and(...conditions),
    orderBy: [desc(workflowRunsDirectory.createdAt)],
    limit: pageSize,
    offset: params.offset ?? 0,
  });
};

export const countWorkflowRunsByOwner = async (
  db: DbClient,
  params: ListWorkflowRunsByOwnerParams,
) => {
  const conditions = buildOwnerWhereConditions(params);

  const result = await db
    .select({ total: count() })
    .from(workflowRunsDirectory)
    .where(and(...conditions));

  return result[0]?.total ?? 0;
};

export const findWorkflowRunByRunId = async (db: DbClient, runId: string) => {
  return db.query.workflowRunsDirectory.findFirst({
    where: and(
      eq(workflowRunsDirectory.runId, runId),
      isNull(workflowRunsDirectory.deletedAt),
    ),
  });
};

export const softDeleteWorkflowRunByRunId = async (
  db: DbClient,
  runId: string,
) => {
  return db
    .update(workflowRunsDirectory)
    .set({
      deletedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(workflowRunsDirectory.runId, runId))
    .returning();
};
