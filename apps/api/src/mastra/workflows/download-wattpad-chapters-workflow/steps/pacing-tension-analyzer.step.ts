import { createStep } from "@mastra/core/workflows";
import {
  outputDownloadWattpadChapterSchema,
  outputPacingTensionAnalyzerSchema,
} from "@repo/shared-types/mastra/validations/wattpad/wattpad-workflow.schema";

export { outputPacingTensionAnalyzerSchema };

export const pacingTensionAnalyzerStep = createStep({
  id: "pacing-tension-analyzer",
  inputSchema: outputDownloadWattpadChapterSchema,
  outputSchema: outputPacingTensionAnalyzerSchema,
  execute: async ({ inputData, mastra }) => {
    if (!inputData) {
      throw new Error("Input data not found");
    }
    const { content } = inputData;

    const agent = mastra.getAgent("pacingTensionAnalyzerAgent");

    if (!agent) {
      throw new Error("Pacing Tension Analyzer Agent not found");
    }

    const prompt = `Analiza el ritmo narrativo y la gestion de tension del siguiente texto. Evalua la distribucion de modalidades temporales (Genette), la gestion de intereses narrativos (Sternberg), y la curva de tension y ritmo (Swain + Freytag).

**TEXTO A ANALIZAR:**
<story_text>
\`\`\`markdown
${content}
\`\`\`
</story_text>

Proporciona tu analisis estructurado evaluando los 3 criterios (Distribucion de Modalidades Temporales, Gestion de Intereses Narrativos, Curva de Tension y Ritmo), estimando la distribucion temporal por modalidad, identificando los intereses narrativos activos, y trazando la curva de tension del texto.`;

    const stream = await agent.stream(prompt, {
      modelSettings: {
        temperature: 0.7,
      },
      structuredOutput: {
        schema: outputPacingTensionAnalyzerSchema,
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
