import { createStep } from "@mastra/core/workflows";
import {
  outputDownloadWattpadChapterSchema,
  outputEmotionalResonanceAnalyzerSchema,
} from "@repo/shared-types/mastra/validations/wattpad/wattpad-workflow.schema";

export { outputEmotionalResonanceAnalyzerSchema };

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

Proporciona tu análisis estructurado evaluando los 4 criterios (Intensidad Emocional, Variedad Emocional, Autenticidad Emocional, Técnica Emocional), siendo específico sobre qué emociones se generan (o no) y por qué técnicamente funciona o falla.`;

    const stream = await agent.stream(prompt, {
      modelSettings: {
        temperature: 0.7,
      },
      structuredOutput: {
        schema: outputEmotionalResonanceAnalyzerSchema,
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
