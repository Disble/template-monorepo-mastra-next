"use server";

import { createWorkflowRunDirectoryEntry, db } from "@repo/db";
import { headers } from "next/headers";
import { auth } from "#lib/auth";
import { wattpadChapterDownloadWorkflow } from "#lib/mastra/workflows";

export async function submitStoryAnalyzerForm({
  url,
  pages,
  redownload,
  editorialContext,
}: {
  url: string;
  pages: number;
  redownload: boolean;
  editorialContext?: string;
}) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      throw new Error("No autorizado");
    }

    const run = await wattpadChapterDownloadWorkflow.createRun();

    await createWorkflowRunDirectoryEntry(db, {
      runId: run.runId,
      workflowKey: "download-wattpad-chapters-workflow",
      workflowVersion: "v1",
      displayValue: url,
      formInput: {
        url,
        pages,
        redownload,
        contextoEditorial: editorialContext ?? null,
      },
      ownerUserId: session.user.id,
    });

    await run.start({
      inputData: {
        url,
        pages,
        redownload,
        contextoEditorial: editorialContext || undefined,
      },
    });

    return {
      success: true as const,
      runId: run.runId,
    };
  } catch (error) {
    console.error("Server Action Error:", error);
    return {
      success: false as const,
      error: "Internal server error",
    };
  }
}
