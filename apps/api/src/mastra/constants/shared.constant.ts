import type { YoutubeLevelModel } from "@repo/shared-types/mastra/validations/youtube/youtube-workflow.type";

export const levelModelMap = {
  light: "google/gemini-2.0-flash-lite",
  high: "google/gemini-2.5-flash-lite",
  heavy: "google/gemini-2.5-pro", // NOTE: it's not free anymore
} as const satisfies Record<YoutubeLevelModel, string>;
