import { createStep } from "@mastra/core/workflows";
import {
  outputDownloadWattpadChapterSchema,
  outputProseDisciplineAnalyzerSchema,
} from "@repo/shared-types/mastra/validations/wattpad/wattpad-workflow.schema";
import { buildAnalyzerPrompt } from "./prompt-utils";

export { outputProseDisciplineAnalyzerSchema };

export const proseDisciplineAnalyzerStep = createStep({
  id: "prose-discipline-analyzer",
  inputSchema: outputDownloadWattpadChapterSchema,
  outputSchema: outputProseDisciplineAnalyzerSchema,
  execute: async ({ inputData, mastra }) => {
    if (!inputData) {
      throw new Error("Input data not found");
    }
    const { content, contextoEditorial } = inputData;

    const agent = mastra.getAgent("proseDisciplineAnalyzerAgent");

    if (!agent) {
      throw new Error("Prose Discipline Analyzer Agent not found");
    }

    const prompt = buildAnalyzerPrompt({
      analysisTarget: "disciplina de prosa",
      rules: [
        "Aplica primero el filtro de adecuación al registro.",
        "Distingue siempre entre VICIO TÉCNICO, ELECCIÓN DISCUTIBLE y ELECCIÓN EFECTIVA.",
        "Penaliza solo vicios técnicos; no confundas voz de género con error automático.",
        "Si la muestra es insuficiente para detectar patrones, usa confianza media/baja.",
      ],
      contextoEditorial,
      content,
    });

    const stream = await agent.stream(prompt, {
      modelSettings: {
        temperature: 0.3,
      },
      structuredOutput: {
        schema: outputProseDisciplineAnalyzerSchema,
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
