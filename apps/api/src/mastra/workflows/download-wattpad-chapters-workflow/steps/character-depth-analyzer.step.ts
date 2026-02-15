import { createStep } from "@mastra/core/workflows";
import {
  outputCharacterDepthAnalyzerSchema,
  outputDownloadWattpadChapterSchema,
} from "@repo/shared-types/mastra/validations/wattpad/wattpad-workflow.schema";

export { outputCharacterDepthAnalyzerSchema };

export const characterDepthAnalyzerStep = createStep({
  id: "character-depth-analyzer",
  inputSchema: outputDownloadWattpadChapterSchema,
  outputSchema: outputCharacterDepthAnalyzerSchema,
  execute: async ({ inputData, mastra }) => {
    if (!inputData) {
      throw new Error("Input data not found");
    }
    const { content } = inputData;

    const agent = mastra.getAgent("characterDepthAnalyzerAgent");

    if (!agent) {
      throw new Error("Character Depth Analyzer Agent not found");
    }

    const prompt = `Analiza la profundidad y capacidad de transformación de los personajes en el siguiente texto. Evalúa si son tridimensionales, tienen capas, y si están en situaciones que permitan cambio interior genuino.

**TEXTO A ANALIZAR:**
<story_text>
\`\`\`markdown
${content}
\`\`\`
</story_text>

Proporciona tu análisis estructurado evaluando los 4 criterios (Tridimensionalidad, Diseño de Arco, Evidencia de Transformación, Especificidad), siendo específico sobre qué capas tiene el personaje (o le faltan) y si la situación narrativa permite transformación interior real.`;

    const stream = await agent.stream(prompt, {
      modelSettings: {
        temperature: 0.7,
      },
      structuredOutput: {
        schema: outputCharacterDepthAnalyzerSchema,
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
