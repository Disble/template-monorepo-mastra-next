import type { YoutubeLevelModel } from "@repo/shared-types/mastra/validations/youtube/youtube-workflow.type";

export const levelModelMap = {
  light: "google/gemini-2.0-flash-001",
  high: "google/gemini-2.5-flash",
  heavy: "google/gemini-2.5-pro",
} as const satisfies Record<YoutubeLevelModel, string>;
