import { createStep } from "@mastra/core/workflows";
import * as z from "zod";
import { outputDownloadWattpadChapterSchema } from "./download-chapter-wattpad.step";

export const outputEngamentStoryAdvisorSchema = z.object({
  report: z.string(),
});

export const engagementStoryAdvisorStep = createStep({
  id: "engagement-story-advisor",
  inputSchema: outputDownloadWattpadChapterSchema,
  outputSchema: outputEngamentStoryAdvisorSchema,
  execute: async ({ inputData, mastra }) => {
    if (!inputData) {
      throw new Error("Input data not found");
    }
    const { content } = inputData;

    const agent = mastra.getAgent("openingHookAnalyzerAgent");

    if (!agent) {
      throw new Error("Engagement Story Advisor Agent not found");
    }

    const prompt = `Analiza la efectividad emocional de la apertura del siguiente manuscrito. Evalúa las primeras escenas completas (no solo párrafos iniciales).

**TEXTO A ANALIZAR:**
<story_text>
\`\`\`markdown
${content}
\`\`\`
</story_text>

Proporciona tu análisis siguiendo tu formato estructurado, enfocándote en si estas escenas iniciales crearían inversión emocional en un lector real.`;

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
