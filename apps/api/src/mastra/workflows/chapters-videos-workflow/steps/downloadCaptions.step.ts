import { createStep } from "@mastra/core/workflows";
import { getSubtitles, type Subtitle } from "youtube-caption-extractor";
import { z } from "zod";
import { captionsSchema, typeSchema } from "./chapters-videos-workflow.schema";

function extractVideoID(url: string): string {
  const urlObj = new URL(url);
  if (urlObj.hostname === "youtu.be") {
    return urlObj.pathname.slice(1);
  } else if (urlObj.hostname.includes("youtube.com")) {
    // Handle /live/{videoID} format
    if (urlObj.pathname.startsWith("/live/")) {
      const videoId = urlObj.pathname.split("/")[2];
      if (!videoId) {
        throw new Error("Invalid YouTube live URL format");
      }
      return videoId;
    }
    // Handle standard ?v={videoID} format
    return urlObj.searchParams.get("v") || "";
  }
  throw new Error("Invalid YouTube URL");
}

async function downloadCaptions(url: string): Promise<Subtitle[]> {
  console.log("🎬 Starting download of captions for URL:", url);

  const langCode = "es"; // Spanish language code

  try {
    const videoID = extractVideoID(url);
    console.log("⏩ videoID", videoID);
    const captions = await getSubtitles({
      videoID: videoID,
      lang: langCode,
    });

    console.log("🔴 captions", captions);

    const captionsContent = captions
      .map((caption, index) => {
        const startTime = new Date(parseFloat(caption.start) * 1000)
          .toISOString()
          .substr(11, 12)
          .replace(".", ",");
        const endTime = new Date(
          (parseFloat(caption.start) + parseFloat(caption.dur)) * 1000,
        )
          .toISOString()
          .substr(11, 12)
          .replace(".", ",");
        return `${index + 1}\n${startTime} --> ${endTime}\n${caption.text}\n`;
      })
      .join("\n");

    console.log("📝 First 200 characters:", captionsContent.substring(0, 200));

    return captions;
  } catch (error) {
    console.error("💥 Error downloading captions:", error);
    throw new Error(
      `Failed to download captions: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}

export const downloadCaptionsStep = createStep({
  id: "download-captions",
  inputSchema: z.object({
    url: z.url().describe("The URL of the video to download the captions for"),
    type: typeSchema,
    levelModel: z
      .enum(["light", "heavy", "high"])
      .describe("The level of the model to use"),
  }),
  outputSchema: captionsSchema,
  execute: async ({ inputData }) => {
    if (!inputData) {
      throw new Error("Input data not found");
    }

    const { url, type } = inputData;
    console.log("🎬 Downloading SRT captions for video:", url);
    const captions = await downloadCaptions(url);
    console.log(
      "✅ SRT captions downloaded successfully, length:",
      captions.length,
    );
    return { captions, type };
  },
});
