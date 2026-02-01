import { createStep } from "@mastra/core/workflows";
import * as z from "zod";
import { outputDownloadWattpadChapterSchema } from "./download-chapter-wattpad.step";

export const outputNarrativeStructureAdvisorSchema = z.object({
  report: z.string(),
});

export const narrativeStructureAdvisorStep = createStep({
  id: "narrative-structure-advisor",
  inputSchema: outputDownloadWattpadChapterSchema,
  outputSchema: outputNarrativeStructureAdvisorSchema,
  execute: async ({ inputData, mastra }) => {
    if (!inputData) {
      throw new Error("Input data not found");
    }
    const { content } = inputData;

    const agent = mastra.getAgent("narrativeStructureAnalyzerAgent");

    if (!agent) {
      throw new Error("Narrative Structure Analyzer Agent not found");
    }

    const prompt = `Analiza la estructura narrativa del siguiente texto. Identifica qué estructuras utiliza, evalúa su implementación y determina si aporta o resta a la experiencia narrativa.

**TEXTO A ANALIZAR:**
<story_text>
\`\`\`markdown
${content}
\`\`\`
</story_text>

Proporciona tu análisis siguiendo tu formato estructurado, enfocándote en si la estructura elegida es la correcta para esta historia y si está bien ejecutada.`;

    const stream = await agent.stream(prompt, {
      modelSettings: {
        temperature: 0.7,
      },
    });

    // Stream with logging
    for await (const chunk of stream.textStream) {
      console.log(chunk);
    }

    // Get full text after streaming
    const text = await stream.text;

    return { report: text };
  },
});
