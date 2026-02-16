import { createStep } from "@mastra/core/workflows";
import {
  outputDownloadWattpadChapterSchema,
  outputEngamentStoryAdvisorSchema,
} from "@repo/shared-types/mastra/validations/wattpad/wattpad-workflow.schema";
import { buildAnalyzerPrompt } from "./prompt-utils";

export { outputEngamentStoryAdvisorSchema };

export const engagementStoryAdvisorStep = createStep({
  id: "engagement-story-advisor",
  inputSchema: outputDownloadWattpadChapterSchema,
  outputSchema: outputEngamentStoryAdvisorSchema,
  execute: async ({ inputData, mastra }) => {
    if (!inputData) {
      throw new Error("Input data not found");
    }
    const { content, contextoEditorial } = inputData;

    const agent = mastra.getAgent("openingHookAnalyzerAgent");

    if (!agent) {
      throw new Error("Engagement Story Advisor Agent not found");
    }

    const prompt = buildAnalyzerPrompt({
      analysisTarget: "enganche de apertura",
      rules: [
        "Identifica primero la fuente primaria de enganche.",
        "Considera explícitamente el enganche por observación/perspectiva, no solo por conflicto o stakes.",
        "Identifica la pregunta implícita real del lector antes de evaluar su efectividad.",
        "Evalúa efectividad temprana según esa fuente (no contra otro paradigma).",
        "No sobrecompenses por clasificación correcta sin ejecución destacada.",
        "Si la muestra no representa una apertura suficiente, baja confianza.",
      ],
      contextoEditorial,
      content,
    });

    const stream = await agent.stream(prompt, {
      modelSettings: {
        temperature: 0.3,
      },
      structuredOutput: {
        schema: outputEngamentStoryAdvisorSchema,
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
