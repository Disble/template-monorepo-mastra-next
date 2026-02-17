import { createStep } from "@mastra/core/workflows";
import {
  outputCharacterDepthAnalyzerSchema,
  outputDownloadWattpadChapterSchema,
} from "@repo/shared-types/mastra/validations/wattpad/wattpad-workflow.schema";
import { scorers } from "../../../constants/models.constant";
import { logger } from "../../../logger";
import { buildAnalyzerPrompt } from "./prompt-utils";

export { outputCharacterDepthAnalyzerSchema };

export const characterDepthAnalyzerStep = createStep({
  id: "character-depth-analyzer",
  inputSchema: outputDownloadWattpadChapterSchema,
  outputSchema: outputCharacterDepthAnalyzerSchema,
  execute: async ({ inputData, mastra }) => {
    if (!inputData) {
      throw new Error("Input data not found");
    }
    const { content, contextoEditorial } = inputData;

    const agent = mastra.getAgent("characterDepthAnalyzerAgent");

    if (!agent) {
      throw new Error("Character Depth Analyzer Agent not found");
    }

    const prompt = buildAnalyzerPrompt({
      analysisTarget: "profundidad de personaje",
      rules: [
        "Prioriza evidencia textual concreta sobre inferencias.",
        "No fuerces modelo de personaje si la evidencia es parcial.",
        "Incluye percepción interior (shinjō) cuando esté activa; si no, repórtala como inactiva sin penalizar.",
        "No sobrecompenses: identificar el modelo correcto no otorga score alto por sí solo.",
        "Si la muestra no permite concluir algo con seguridad, marca confianza media/baja.",
      ],
      contextoEditorial,
      content,
    });

    const stream = await agent.stream(prompt, {
      modelSettings: {
        temperature: 0.3,
      },
      structuredOutput: {
        schema: outputCharacterDepthAnalyzerSchema,
      },
    });

    // Stream with logging
    for await (const chunk of stream.textStream) {
      logger.debug({ chunk }, "character-depth-analyzer stream chunk");
    }

    // Get structured object from stream
    const object = await stream.object;

    if (!object) {
      throw new Error("No analysis generated");
    }

    return object;
  },
  scorers,
});
