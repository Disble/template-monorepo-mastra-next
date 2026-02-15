"use server";

import type { InputDownloadWattpadChapter } from "@repo/shared-types/mastra/validations/wattpad/wattpad-workflow.type";
import { wattpadChapterDownloadWorkflow } from "#lib/mastra/workflows";

export async function submitStoryAnalyzerForm({
  url,
  pages,
  redownload,
}: InputDownloadWattpadChapter) {
  try {
    const run = await wattpadChapterDownloadWorkflow.createRun();
    await run.start({
      inputData: {
        url,
        pages,
        redownload,
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
