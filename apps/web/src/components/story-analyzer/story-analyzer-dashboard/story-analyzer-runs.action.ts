"use server";

import {
  countWorkflowRunsByOwner,
  db,
  findWorkflowRunByRunId,
  listWorkflowRunsByOwner,
  softDeleteWorkflowRunByRunId,
} from "@repo/db";
import { headers } from "next/headers";
import { auth } from "#lib/auth";
import type { PaginationParams } from "#lib/types/workflow-history";

const STORY_ANALYZER_WORKFLOW_KEY = "download-wattpad-chapters-workflow";

export async function getStoryAnalyzerRunHistory(
  params?: Partial<PaginationParams>,
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return {
      success: false as const,
      error: "No autorizado",
      runs: [],
      totalCount: 0,
      page: 1,
      pageSize: params?.pageSize ?? 10,
    };
  }

  const page = params?.page ?? 1;
  const pageSize = params?.pageSize ?? 10;
  const search = params?.search ?? "";
  const offset = (page - 1) * pageSize;

  const queryParams = {
    ownerUserId: session.user.id,
    workflowKey: STORY_ANALYZER_WORKFLOW_KEY,
    limit: pageSize,
    offset,
    search: search || undefined,
  };

  const [runs, totalCount] = await Promise.all([
    listWorkflowRunsByOwner(db, queryParams),
    countWorkflowRunsByOwner(db, queryParams),
  ]);

  return {
    success: true as const,
    runs,
    totalCount,
    page,
    pageSize,
  };
}

export async function getStoryAnalyzerRunByRunId(runId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return {
      success: false as const,
      error: "No autorizado",
      run: null,
    };
  }

  const run = await findWorkflowRunByRunId(db, runId);

  if (!run || run.ownerUserId !== session.user.id) {
    return {
      success: false as const,
      error: "Run no encontrado",
      run: null,
    };
  }

  return {
    success: true as const,
    run,
  };
}

export async function deleteStoryAnalyzerRunByRunId(runId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return {
      success: false as const,
      error: "No autorizado",
    };
  }

  const run = await findWorkflowRunByRunId(db, runId);

  if (!run || run.ownerUserId !== session.user.id) {
    return {
      success: false as const,
      error: "Run no encontrado",
    };
  }

  await softDeleteWorkflowRunByRunId(db, runId);

  return {
    success: true as const,
  };
}
