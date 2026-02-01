import { createStep } from "@mastra/core/workflows";
import * as z from "zod";
import { outputDownloadWattpadChapterSchema } from "./download-chapter-wattpad.step";

const criterioSchema = z.object({
  nombre: z.string().describe("Nombre del criterio evaluado"),
  score: z.number().min(0).max(10).describe("Puntuación de 0 a 10"),
  explicacion: z
    .string()
    .describe("Explicación específica con citas del texto"),
});

export const outputEngamentStoryAdvisorSchema = z.object({
  diagnostico: z
    .string()
    .describe("Párrafo explicando si funciona o no la apertura y por qué"),
  criterios: z
    .array(criterioSchema)
    .length(4)
    .describe(
      "Los 4 criterios evaluados: Anclaje Emocional, Pregunta Implícita, Ritmo de Inversión, Especificidad Emocional",
    ),
  momentoCritico: z
    .object({
      cita: z.string().describe("Cita textual del momento crítico"),
      analisis: z
        .string()
        .describe(
          "Análisis de por qué este momento es el punto de inflexión emocional",
        ),
    })
    .describe(
      "El momento específico donde el lector decide seguir leyendo o abandonar",
    ),
  veredicto: z
    .enum(["PASA", "NECESITA REVISIÓN", "NO PASA"])
    .describe("Veredicto editorial"),
  recomendaciones: z
    .array(z.string())
    .min(0)
    .max(3)
    .describe(
      "2-3 acciones concretas y específicas para fortalecer la apertura (solo si necesita revisión o no pasa)",
    ),
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
