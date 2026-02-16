import { createStep } from "@mastra/core/workflows";
import {
  outputContinuityErrorDetectorSchema,
  outputDownloadWattpadChapterSchema,
} from "@repo/shared-types/mastra/validations/wattpad/wattpad-workflow.schema";
import { logger } from "../../../logger";
import { buildAnalyzerPrompt } from "./prompt-utils";

export { outputContinuityErrorDetectorSchema };

export const continuityErrorDetectorStep = createStep({
  id: "continuity-error-detector",
  inputSchema: outputDownloadWattpadChapterSchema,
  outputSchema: outputContinuityErrorDetectorSchema,
  execute: async ({ inputData, mastra }) => {
    if (!inputData) {
      throw new Error("Input data not found");
    }
    const { content, contextoEditorial } = inputData;

    const agent = mastra.getAgent("continuityErrorDetectorAgent");

    if (!agent) {
      throw new Error("Continuity Error Detector Agent not found");
    }

    const prompt = buildAnalyzerPrompt({
      analysisTarget: "continuidad",
      rules: [
        "Clasifica cada hallazgo como ERROR DE CRAFT, RASGO DEL MODO o AMBIGUO.",
        "Usa test de intencionalidad e impacto antes de penalizar.",
        "Cita textualmente toda contradicción relevante.",
        "Si falta contexto para confirmar, usa AMBIGUO y confianza baja.",
      ],
      contextoEditorial,
      content,
    });

    const stream = await agent.stream(prompt, {
      modelSettings: {
        temperature: 0.3,
      },
      structuredOutput: {
        schema: outputContinuityErrorDetectorSchema,
      },
    });

    // Stream with logging
    for await (const chunk of stream.textStream) {
      logger.debug({ chunk }, "continuity-error-detector stream chunk");
    }

    // Get structured object from stream
    const object = await stream.object;

    if (!object) {
      throw new Error("No analysis generated");
    }

    return object;
  },
});
