import { createStep } from "@mastra/core/workflows";
import {
  outputDownloadWattpadChapterSchema,
  outputNarrativeStructureAdvisorSchema,
} from "@repo/shared-types/mastra/validations/wattpad/wattpad-workflow.schema";
import { logger } from "../../../logger";
import { buildAnalyzerPrompt } from "./prompt-utils";

export { outputNarrativeStructureAdvisorSchema };

export const narrativeStructureAdvisorStep = createStep({
  id: "narrative-structure-advisor",
  inputSchema: outputDownloadWattpadChapterSchema,
  outputSchema: outputNarrativeStructureAdvisorSchema,
  execute: async ({ inputData, mastra }) => {
    if (!inputData) {
      throw new Error("Input data not found");
    }
    const { content, contextoEditorial } = inputData;

    const agent = mastra.getAgent("narrativeStructureAnalyzerAgent");

    if (!agent) {
      throw new Error("Narrative Structure Analyzer Agent not found");
    }

    const prompt = buildAnalyzerPrompt({
      analysisTarget: "estructura narrativa",
      rules: [
        "No fuerces clasificación si el encaje es parcial.",
        "Informa porcentaje de alineación y alternativa cercana cuando aplique.",
        "Distingue principio organizador de la historia vs. elementos presentes (incluido conflicto si existe).",
        "No asumas que tener conflicto implica estar estructurado alrededor del conflicto.",
        "Evalúa forma-función: no basta con nombrar estructura.",
        "Si la muestra es incompleta, baja confianza para cierres macro.",
      ],
      contextoEditorial,
      content,
    });

    const stream = await agent.stream(prompt, {
      modelSettings: {
        temperature: 0.3,
      },
      structuredOutput: {
        schema: outputNarrativeStructureAdvisorSchema,
      },
    });

    // Stream with logging
    for await (const chunk of stream.textStream) {
      logger.debug({ chunk }, "narrative-structure-advisor stream chunk");
    }

    // Get structured object from stream
    const object = await stream.object;

    if (!object) {
      throw new Error("No analysis generated");
    }

    return object;
  },
});
