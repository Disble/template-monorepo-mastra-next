import type { YoutubeLevelModel } from "@repo/shared-types/mastra/validations/youtube/youtube-workflow.type";
import { ollama } from "ollama-ai-provider-v2";

export const levelModelMap = {
  light: "google/gemini-2.0-flash-lite",
  // high: "lmstudio/openai/gpt-oss-20b",
  high: ollama("gpt-oss:20b"),
  heavy: "google/gemini-3-flash-preview", // NOTE: it's not free anymore
} as const satisfies Record<YoutubeLevelModel, unknown>;
