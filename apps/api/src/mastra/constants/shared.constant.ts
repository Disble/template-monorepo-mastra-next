import { ollama } from "ollama-ai-provider-v2";

export const levelModelMap = {
  light: ollama("gpt-oss:20b"),
  // high: "lmstudio/openai/gpt-oss-20b",
  high: "google/gemini-2.5-flash-lite",
  heavy: "google/gemini-3-flash-preview",
} as const;
