"use server";

import { chaptersVideosWorkflow } from "#lib/mastra/workflows.js";

export async function submitContentForm({
  url,
  contentType,
}: {
  url: string;
  contentType: string;
}) {
  try {
    const run = await chaptersVideosWorkflow.createRunAsync();
    const { message } = await run.start({
      inputData: {
        url,
        type: contentType,
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
