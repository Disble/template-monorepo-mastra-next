import { createStep } from "@mastra/core/workflows";
import * as z from "zod";
import { outputDownloadWattpadChapterSchema } from "./download-chapter-wattpad.step";

export const outputCharacterDepthAnalyzerSchema = z.object({
  report: z.string(),
});

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

Proporciona tu análisis siguiendo tu formato estructurado, siendo específico sobre qué capas tiene el personaje (o le faltan) y si la situación narrativa permite transformación interior real.`;

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
