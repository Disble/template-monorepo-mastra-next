import { createStep } from "@mastra/core/workflows";
import * as z from "zod";
import { outputDownloadWattpadChapterSchema } from "./download-chapter-wattpad.step";

const criterioEstructuralSchema = z.object({
  nombre: z.string().describe("Nombre del criterio evaluado"),
  score: z.number().min(0).max(10).describe("Puntuación de 0 a 10"),
  explicacion: z.string().describe("Explicación con evidencia textual"),
});

const identificacionNivelSchema = z.object({
  nivel: z.enum(["Macro", "Meso", "Micro"]).describe("Nivel estructural"),
  estructura: z.string().describe("Estructura identificada"),
  justificacion: z.string().describe("Breve justificación"),
});

const puntoEstructuralSchema = z.object({
  tipo: z
    .string()
    .describe(
      "Tipo de punto estructural (inciting incident, punto de giro, clímax, etc.)",
    ),
  cita: z.string().describe("Cita textual del momento"),
  posicionamiento: z
    .string()
    .describe("Análisis de si está bien posicionado o hay problemas de timing"),
});

export const outputNarrativeStructureAdvisorSchema = z.object({
  identificacionEstructural: z.object({
    niveles: z
      .array(identificacionNivelSchema)
      .length(3)
      .describe("Los 3 niveles: Macro, Meso, Micro"),
    descripcion: z
      .string()
      .describe("Descripción de cómo operan estas estructuras en el texto"),
  }),
  criterios: z
    .array(criterioEstructuralSchema)
    .length(4)
    .describe(
      "Los 4 criterios: Identificación Estructural, Implementación Técnica, Efectividad Narrativa, Complejidad Justificada",
    ),
  puntosEstructuralesClave: z
    .array(puntoEstructuralSchema)
    .min(1)
    .max(5)
    .describe("Momentos estructurales clave identificados"),
  diagnostico: z.object({
    aportaOResta: z
      .enum(["APORTA", "NEUTRAL", "RESTA"])
      .describe("¿La estructura aporta o resta?"),
    explicacion: z
      .string()
      .describe("Explicación de por qué la estructura funciona o no"),
  }),
  veredicto: z
    .enum(["ESTRUCTURA SÓLIDA", "NECESITA AJUSTES", "NECESITA REPLANTEAMIENTO"])
    .describe("Veredicto editorial"),
  recomendaciones: z
    .array(z.string())
    .min(0)
    .max(3)
    .describe("Recomendaciones específicas"),
});

export const narrativeStructureAdvisorStep = createStep({
  id: "narrative-structure-advisor",
  inputSchema: outputDownloadWattpadChapterSchema,
  outputSchema: outputNarrativeStructureAdvisorSchema,
  execute: async ({ inputData, mastra }) => {
    if (!inputData) {
      throw new Error("Input data not found");
    }
    const { content } = inputData;

    const agent = mastra.getAgent("narrativeStructureAnalyzerAgent");

    if (!agent) {
      throw new Error("Narrative Structure Analyzer Agent not found");
    }

    const prompt = `Analiza la estructura narrativa del siguiente texto. Identifica qué estructuras utiliza en cada nivel (Macro, Meso, Micro), evalúa los 4 criterios (Identificación Estructural, Implementación Técnica, Efectividad Narrativa, Complejidad Justificada), y determina si aporta o resta a la experiencia narrativa.

**TEXTO A ANALIZAR:**
<story_text>
\`\`\`markdown
${content}
\`\`\`
</story_text>

Proporciona tu análisis estructurado, enfocándote en si la estructura elegida es la correcta para esta historia y si está bien ejecutada.`;

    const stream = await agent.stream(prompt, {
      modelSettings: {
        temperature: 0.7,
      },
      structuredOutput: {
        schema: outputNarrativeStructureAdvisorSchema,
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
