import { ollama } from "ollama-ai-provider-v2";

export const models = {
  // parallelTextModel: ["google/gemini-2.5-flash-lite", ollama("qwen3:14b")],
  parallelTextModel: [
    {
      model: "google/gemini-3-flash-preview",
      maxRetries: 1,
    },
    {
      model: ollama("qwen3:14b"),
    },
  ],
};
