"use server";

import type { InputYoutubeWorkflow } from "@repo/shared-types/mastra/validations/youtube/youtube-workflow.type";
import { headers } from "next/headers";
import { auth } from "#lib/auth";
import { chaptersVideosWorkflow } from "#lib/mastra/workflows";

export async function submitContentForm({
  url,
  type,
  levelModel,
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
    const { message } = await run.start({
      inputData: {
        url,
        type,
        levelModel,
        userId,
      },
    });
    console.log("🥝 message: ", message);
    return {
      success: true,
      runId: run.runId,
    };
  } catch (error) {
    console.error("Server Action Error:", error);
    return {
      success: false,
      error: "Internal server error",
    };
  }
}
