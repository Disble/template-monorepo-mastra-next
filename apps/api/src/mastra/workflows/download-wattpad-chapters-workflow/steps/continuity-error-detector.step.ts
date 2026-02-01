import { createStep } from "@mastra/core/workflows";
import * as z from "zod";
import { outputDownloadWattpadChapterSchema } from "./download-chapter-wattpad.step";

export const outputContinuityErrorDetectorSchema = z.object({
  report: z.string(),
});

export const continuityErrorDetectorStep = createStep({
  id: "continuity-error-detector",
  inputSchema: outputDownloadWattpadChapterSchema,
  outputSchema: outputContinuityErrorDetectorSchema,
  execute: async ({ inputData, mastra }) => {
    if (!inputData) {
      throw new Error("Input data not found");
    }
    const { content } = inputData;

    const agent = mastra.getAgent("continuityErrorDetectorAgent");

    if (!agent) {
      throw new Error("Continuity Error Detector Agent not found");
    }

    const prompt = `Analiza el siguiente texto en busca de errores de continuidad, contradicciones internas e inconsistencias. Rastrea todos los elementos establecidos y verifica que se mantengan coherentes a lo largo del texto.

**TEXTO A ANALIZAR:**
<story_text>
\`\`\`markdown
${content}
\`\`\`
</story_text>

Proporciona tu análisis siguiendo tu formato estructurado, citando textualmente cada contradicción detectada.`;

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
