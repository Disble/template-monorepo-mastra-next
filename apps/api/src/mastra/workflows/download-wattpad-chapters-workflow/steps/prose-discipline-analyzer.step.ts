import { createStep } from "@mastra/core/workflows";
import {
  outputDownloadWattpadChapterSchema,
  outputProseDisciplineAnalyzerSchema,
} from "@repo/shared-types/mastra/validations/wattpad/wattpad-workflow.schema";

export { outputProseDisciplineAnalyzerSchema };

export const proseDisciplineAnalyzerStep = createStep({
  id: "prose-discipline-analyzer",
  inputSchema: outputDownloadWattpadChapterSchema,
  outputSchema: outputProseDisciplineAnalyzerSchema,
  execute: async ({ inputData, mastra }) => {
    if (!inputData) {
      throw new Error("Input data not found");
    }
    const { content } = inputData;

    const agent = mastra.getAgent("proseDisciplineAnalyzerAgent");

    if (!agent) {
      throw new Error("Prose Discipline Analyzer Agent not found");
    }

    const prompt = `Analiza la disciplina de prosa del siguiente texto. Detecta engolosinamiento, prosa ornamental sin función, y malos hábitos técnicos de escritura. Sé específico con ejemplos textuales.

**TEXTO A ANALIZAR:**
<story_text>
\`\`\`markdown
${content}
\`\`\`
</story_text>

Proporciona tu análisis estructurado, citando textualmente cada problema detectado y distinguiendo entre vicios objetivos y posibles elecciones estilísticas.`;

    const stream = await agent.stream(prompt, {
      modelSettings: {
        temperature: 0.7,
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
