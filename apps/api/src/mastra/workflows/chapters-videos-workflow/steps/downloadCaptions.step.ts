import { createStep } from "@mastra/core/workflows";
import {
  inputYoutubeWorkflow,
  youtubeCaptionsSchema,
} from "@repo/shared-types/mastra/validations/youtube/youtube-workflow.schema";
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
    console.log("🎬 Downloading captions for video:", url);

    setState({ type });

    const srt = await downloadCaptionsWithYouTubeAPI(url, userId);
    console.log(
      "✅ Captions downloaded successfully using YouTube API, length:",
      srt.length,
    );

    if (!srt || srt.trim().length === 0) {
      throw new Error("No captions found for the provided video URL");
    }

    return { srt };
  },
});
