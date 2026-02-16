import { createStep } from "@mastra/core/workflows";
import {
  outputDownloadWattpadChapterSchema,
  outputEngamentStoryAdvisorSchema,
} from "@repo/shared-types/mastra/validations/wattpad/wattpad-workflow.schema";

export { outputEngamentStoryAdvisorSchema };

export const engagementStoryAdvisorStep = createStep({
  id: "engagement-story-advisor",
  inputSchema: outputDownloadWattpadChapterSchema,
  outputSchema: outputEngamentStoryAdvisorSchema,
  execute: async ({ inputData, mastra }) => {
    if (!inputData) {
      throw new Error("Input data not found");
    }
    const { content, contextoEditorial } = inputData;

    const agent = mastra.getAgent("openingHookAnalyzerAgent");

    if (!agent) {
      throw new Error("Engagement Story Advisor Agent not found");
    }

    const contextoBlock = contextoEditorial
      ? `\n**CONTEXTO EDITORIAL (ten en cuenta para calibrar tu análisis):**\n<contexto_editorial>\n${contextoEditorial}\n</contexto_editorial>\n`
      : "";

    const prompt = `Analiza la efectividad emocional de la apertura del siguiente manuscrito. Evalúa las primeras escenas completas (no solo párrafos iniciales).
${contextoBlock}
**TEXTO A ANALIZAR:**
<story_text>
\`\`\`markdown
${content}
\`\`\`
</story_text>

Proporciona tu análisis estructurado evaluando los 4 criterios (Anclaje Emocional, Pregunta Implícita, Ritmo de Inversión, Especificidad Emocional), identificando el momento crítico, y determinando si estas escenas iniciales crearían inversión emocional en un lector real.`;

    const stream = await agent.stream(prompt, {
      modelSettings: {
        temperature: 0.7,
      },
      structuredOutput: {
        schema: outputEngamentStoryAdvisorSchema,
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
