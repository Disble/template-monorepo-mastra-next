"use server";

import type { InputYoutubeWorkflow } from "@repo/shared-types/mastra/validations/youtube/youtube-workflow.type";
import { chaptersVideosWorkflow } from "#lib/mastra/workflows";

export async function submitContentForm({
  url,
  type,
  levelModel,
}: InputYoutubeWorkflow) {
  try {
    const run = await chaptersVideosWorkflow.createRunAsync();
    const { message } = await run.start({
      inputData: {
        url,
        type,
        levelModel,
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
