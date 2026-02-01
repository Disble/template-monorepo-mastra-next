import { ollama } from "ollama-ai-provider-v2";

export const models = {
  parallelTextModel: ollama("qwen3:14b"),
};
