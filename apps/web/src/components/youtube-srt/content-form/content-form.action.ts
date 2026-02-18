"use server";

import { createWorkflowRunDirectoryEntry, db } from "@repo/db";
import type { InputYoutubeWorkflow } from "@repo/shared-types/mastra/validations/youtube/youtube-workflow.type";
import { headers } from "next/headers";
import { auth } from "#lib/auth";
import { chaptersVideosWorkflow } from "#lib/mastra/workflows";

export async function submitContentForm({
  url,
  type,
}: Omit<InputYoutubeWorkflow, "userId">) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      throw new Error("No autorizado");
    }

    const userId = session.user.id;

    const run = await chaptersVideosWorkflow.createRun();

    await createWorkflowRunDirectoryEntry(db, {
      runId: run.runId,
      workflowKey: "chapters-videos-workflow",
      workflowVersion: "v1",
      displayValue: url,
      formInput: {
        url,
        type,
      },
      ownerUserId: userId,
    });

    await run.start({
      inputData: {
        url,
        type,
        userId,
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
