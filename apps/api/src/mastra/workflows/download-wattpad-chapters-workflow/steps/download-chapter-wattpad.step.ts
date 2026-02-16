import { createStep } from "@mastra/core/workflows";
import {
  createDbClient,
  createStory,
  findStoryByUrl,
  updateStory,
} from "@repo/db";
import { env } from "@repo/envs/node";
import {
  inputDownloadWattpadChapterSchema,
  outputDownloadWattpadChapterSchema,
} from "@repo/shared-types/mastra/validations/wattpad/wattpad-workflow.schema";
import { logger } from "../../../logger";
import { getContentPage } from "../../../tools/get-content-page/get-content-page-wattpad";

export {
  inputDownloadWattpadChapterSchema,
  outputDownloadWattpadChapterSchema,
};

export const downloadWattpadChapterStep = createStep({
  id: "download-wattpad-chapter",
  inputSchema: inputDownloadWattpadChapterSchema,
  outputSchema: outputDownloadWattpadChapterSchema,
  execute: async ({ inputData }) => {
    if (!inputData) {
      throw new Error("Input data not found");
    }
    const { url, pages, redownload, contextoEditorial } = inputData;

    const db = createDbClient(env.DATABASE_URL);

    const story = await findStoryByUrl(db, url);

    if (story && !redownload) {
      return { content: story.text, contextoEditorial };
    }

    logger.info({ url, pages }, "Story not found, downloading content");

    const responseContentPage = await getContentPage(url, pages);

    if (story?.id && responseContentPage.content && redownload) {
      updateStory(db, story?.id || 0, {
        authorName: story?.authorName || "Unknown",
        text: responseContentPage.content,
        title: story?.title || `Wattpad Chapter from ${url}`,
        url,
      });
    } else {
      await createStory(db, {
        authorName: "Unknown",
        text: responseContentPage.content,
        title: `Wattpad Chapter from ${url}`,
        url,
      });
    }

    logger.info({ url, pages }, "Content downloaded successfully");

    return { ...responseContentPage, contextoEditorial };
  },
});
