import { createAnswerRelevancyScorer } from "@mastra/evals/scorers/prebuilt";
import { ollama } from "ollama-ai-provider-v2";

export const models = {
  // parallelTextModel: ollama("qwen3:14b"),
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

/**
 * Scorers configuration for Agent evaluations.
 *
 * - relevancy: Checks if the agent output is relevant to the input using the provided model.
 *   Uses the 'qwen3:14b' model via Ollama for answer relevancy scoring.
 *   Optionally supports sampling with a ratio (example commented out).
 *
 * - hallucination: Detects hallucinated (factually incorrect or fabricated) content in agent output.
 *   Uses the same 'qwen3:14b' model via Ollama for hallucination detection.
 */
export const scorers = {
  /**
   * Relevancy scorer to evaluate if the answer is relevant to the question or context.
   */
  relevancy: {
    scorer: createAnswerRelevancyScorer({
      model: ollama("qwen3:14b"),
    }),
    // Optionally use sampling to adjust the ratio of scored responses:
    // sampling: { type: 'ratio', rate: 0.5 }
  },
  // /**
  //  * Hallucination scorer to detect fabricated or non-factual content in responses.
  //  */
  // hallucination: {
  //    scorer: createHallucinationScorer({
  //       model: ollama("qwen3:14b")
  //    }),
  // }
};
