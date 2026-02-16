import { createStep } from "@mastra/core/workflows";
import {
  inputYoutubeWorkflow,
  youtubeCaptionsSchema,
} from "@repo/shared-types/mastra/validations/youtube/youtube-workflow.schema";
import { logger } from "../../../logger";
import { downloadCaptionsWithYouTubeAPI } from "./download-by-yt-key";

export const downloadCaptionsStep = createStep({
  id: "download-captions",
  inputSchema: inputYoutubeWorkflow,
  outputSchema: youtubeCaptionsSchema,
  execute: async ({ inputData, setState }) => {
    if (!inputData) {
      throw new Error("Input data not found");
    }

    const { url, userId, type } = inputData;
    logger.info({ url }, "Downloading captions for video");

    setState({ type });

    const srt = await downloadCaptionsWithYouTubeAPI(url, userId);
    logger.info(
      { length: srt.length },
      "Captions downloaded successfully using YouTube API",
    );

    if (!srt || srt.trim().length === 0) {
      throw new Error("No captions found for the provided video URL");
    }

    return { srt };
  },
});
