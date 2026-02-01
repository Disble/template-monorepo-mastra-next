import { createStep } from "@mastra/core/workflows";
import * as z from "zod";
import { outputDownloadWattpadChapterSchema } from "./download-chapter-wattpad.step";

export const outputEmotionalResonanceAnalyzerSchema = z.object({
  report: z.string(),
});

export const emotionalResonanceAnalyzerStep = createStep({
  id: "emotional-resonance-analyzer",
  inputSchema: outputDownloadWattpadChapterSchema,
  outputSchema: outputEmotionalResonanceAnalyzerSchema,
  execute: async ({ inputData, mastra }) => {
    if (!inputData) {
      throw new Error("Input data not found");
    }
    const { content } = inputData;

    const agent = mastra.getAgent("emotionalResonanceAnalyzerAgent");

    if (!agent) {
      throw new Error("Emotional Resonance Analyzer Agent not found");
    }

    const prompt = `Analiza la resonancia emocional del siguiente texto. Evalúa si genera emociones genuinas en el lector o permanece a nivel informativo. Identifica qué técnicas usa (o no usa) para transmitir emoción.

**TEXTO A ANALIZAR:**
<story_text>
\`\`\`markdown
${content}
\`\`\`
</story_text>

Proporciona tu análisis siguiendo tu formato estructurado, siendo específico sobre qué emociones se generan (o no) y por qué técnicamente funciona o falla.`;

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
