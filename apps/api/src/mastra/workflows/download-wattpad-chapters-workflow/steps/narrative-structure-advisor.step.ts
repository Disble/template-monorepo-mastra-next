import { createStep } from "@mastra/core/workflows";
import {
  outputDownloadWattpadChapterSchema,
  outputNarrativeStructureAdvisorSchema,
} from "@repo/shared-types/mastra/validations/wattpad/wattpad-workflow.schema";

export { outputNarrativeStructureAdvisorSchema };

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

    const prompt = `Analiza la estructura narrativa del siguiente texto. Identifica qué estructuras utiliza en cada nivel (Macro, Meso, Micro), evalúa los 4 criterios (Identificación Estructural, Implementación Técnica, Efectividad Narrativa, Complejidad Justificada), y determina si aporta o resta a la experiencia narrativa.

**TEXTO A ANALIZAR:**
<story_text>
\`\`\`markdown
${content}
\`\`\`
</story_text>

Proporciona tu análisis estructurado, enfocándote en si la estructura elegida es la correcta para esta historia y si está bien ejecutada.`;

    const stream = await agent.stream(prompt, {
      modelSettings: {
        temperature: 0.7,
      },
      structuredOutput: {
        schema: outputNarrativeStructureAdvisorSchema,
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
