import { createStep } from "@mastra/core/workflows";
import {
  outputContinuityErrorDetectorSchema,
  outputDownloadWattpadChapterSchema,
} from "@repo/shared-types/mastra/validations/wattpad/wattpad-workflow.schema";

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

    const contextoBlock = contextoEditorial
      ? `\n**CONTEXTO EDITORIAL (ten en cuenta para calibrar tu análisis):**\n<contexto_editorial>\n${contextoEditorial}\n</contexto_editorial>\n`
      : "";

    const prompt = `Analiza el siguiente texto en busca de errores de continuidad, contradicciones internas e inconsistencias. Rastrea todos los elementos establecidos y verifica que se mantengan coherentes a lo largo del texto.
${contextoBlock}
**TEXTO A ANALIZAR:**
<story_text>
\`\`\`markdown
${content}
\`\`\`
</story_text>

Proporciona tu análisis estructurado, citando textualmente cada contradicción detectada con su categoría, severidad, y solución sugerida.`;

    const stream = await agent.stream(prompt, {
      modelSettings: {
        temperature: 0.7,
      },
      structuredOutput: {
        schema: outputContinuityErrorDetectorSchema,
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
