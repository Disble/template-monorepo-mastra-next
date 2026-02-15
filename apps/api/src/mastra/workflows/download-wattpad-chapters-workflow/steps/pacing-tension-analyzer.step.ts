import { createStep } from "@mastra/core/workflows";
import * as z from "zod";
import { outputDownloadWattpadChapterSchema } from "./download-chapter-wattpad.step";

const criterioRitmoSchema = z.object({
  nombre: z.string().describe("Nombre del criterio evaluado"),
  score: z.number().min(0).max(10).describe("Puntuacion de 0 a 10"),
  explicacion: z
    .string()
    .describe("Explicacion con evidencia textual especifica"),
});

const distribucionTemporalSchema = z.object({
  escena: z
    .number()
    .min(0)
    .max(100)
    .describe("Porcentaje estimado de escena en el texto"),
  sumario: z
    .number()
    .min(0)
    .max(100)
    .describe("Porcentaje estimado de sumario en el texto"),
  pausa: z
    .number()
    .min(0)
    .max(100)
    .describe("Porcentaje estimado de pausa en el texto"),
  elipsis: z
    .number()
    .min(0)
    .max(100)
    .describe("Porcentaje estimado de elipsis en el texto"),
  observacion: z
    .string()
    .describe(
      "Observacion sobre si la distribucion es adecuada para este tipo de texto",
    ),
});

const interesesNarrativosSchema = z.object({
  suspense: z.string().describe("Presencia y manejo del suspense en el texto"),
  curiosidad: z
    .string()
    .describe("Presencia y manejo de la curiosidad retrospectiva en el texto"),
  sorpresa: z
    .string()
    .describe("Presencia y manejo de sorpresas o giros en el texto"),
});

const puntoTensionSchema = z.object({
  seccion: z.string().describe("Seccion del texto"),
  nivelTension: z
    .number()
    .min(0)
    .max(10)
    .describe("Nivel de tension de 0 a 10"),
  tipo: z
    .enum(["PICO", "VALLE", "MESETA", "ASCENSO", "DESCENSO"])
    .describe("Tipo de punto en la curva de tension"),
});

export const outputPacingTensionAnalyzerSchema = z.object({
  diagnostico: z
    .string()
    .describe("Evaluacion general del sistema ritmico y de tension del texto"),
  criterios: z
    .array(criterioRitmoSchema)
    .length(3)
    .describe(
      "Los 3 criterios: Distribucion de Modalidades Temporales, Gestion de Intereses Narrativos, Curva de Tension y Ritmo",
    ),
  distribucionTemporal: distribucionTemporalSchema.describe(
    "Porcentaje estimado por modalidad temporal y observacion",
  ),
  interesesNarrativos: interesesNarrativosSchema.describe(
    "Presencia y gestion de suspense, curiosidad y sorpresa",
  ),
  curvaDeTension: z
    .array(puntoTensionSchema)
    .min(3)
    .describe("Puntos de la curva de tension a lo largo del texto"),
  veredicto: z
    .enum([
      "RITMO Y TENSION EFECTIVOS",
      "NECESITA AJUSTES DE RITMO",
      "PROBLEMAS SERIOS DE RITMO Y TENSION",
    ])
    .describe("Veredicto editorial"),
  recomendaciones: z
    .array(z.string())
    .min(0)
    .max(3)
    .describe("Recomendaciones especificas para mejorar ritmo y tension"),
  notaCritica: z
    .string()
    .describe(
      "La observacion mas importante sobre el ritmo y la tension en este texto",
    ),
});

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
