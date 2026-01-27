import type { YoutubeLevelModel } from "@repo/shared-types/mastra/validations/youtube/youtube-workflow.type";
import { ollama } from "ollama-ai-provider-v2";

export const levelModelMap = {
  light: "google/gemini-2.5-flash-lite",
  // high: "lmstudio/openai/gpt-oss-20b",
  high: ollama("gpt-oss:20b"),
  heavy: "google/gemini-3-flash",
} as const satisfies Record<YoutubeLevelModel, unknown>;
