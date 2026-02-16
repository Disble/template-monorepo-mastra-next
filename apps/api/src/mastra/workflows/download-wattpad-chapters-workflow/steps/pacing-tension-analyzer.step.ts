import { createStep } from "@mastra/core/workflows";
import {
  outputDownloadWattpadChapterSchema,
  outputPacingTensionAnalyzerSchema,
} from "@repo/shared-types/mastra/validations/wattpad/wattpad-workflow.schema";
import { buildAnalyzerPrompt } from "./prompt-utils";

export { outputPacingTensionAnalyzerSchema };

export const pacingTensionAnalyzerStep = createStep({
  id: "pacing-tension-analyzer",
  inputSchema: outputDownloadWattpadChapterSchema,
  outputSchema: outputPacingTensionAnalyzerSchema,
  execute: async ({ inputData, mastra }) => {
    if (!inputData) {
      throw new Error("Input data not found");
    }
    const { content, contextoEditorial } = inputData;

    const agent = mastra.getAgent("pacingTensionAnalyzerAgent");

    if (!agent) {
      throw new Error("Pacing Tension Analyzer Agent not found");
    }

    const prompt = buildAnalyzerPrompt({
      analysisTarget: "ritmo y tensión",
      rules: [
        "Identifica primero el modelo de tensión que realmente opera.",
        "Evalúa efecto de caídas de tensión según modelo (no por dogma clásico).",
        "No sobrecompenses por modelo correcto sin ejecución sólida.",
        "Si el fragmento no permite curva completa, baja confianza.",
      ],
      contextoEditorial,
      content,
    });

    const stream = await agent.stream(prompt, {
      modelSettings: {
        temperature: 0.3,
      },
      structuredOutput: {
        schema: outputPacingTensionAnalyzerSchema,
      },
    });

    // Stream with logging
    for await (const chunk of stream.textStream) {
      console.log(chunk);
    }

    // Get structured object from stream
    const object = await stream.object;

    if (!object) {
      throw new Error("No analysis generated");
    }

    return object;
  },
});
