import { createStep } from "@mastra/core/workflows";
import * as z from "zod";
import { outputDownloadWattpadChapterSchema } from "./download-chapter-wattpad.step";

const errorContinuidadSchema = z.object({
  numero: z.number().describe("Número del error"),
  categoria: z
    .enum([
      "CRONOLOGÍA",
      "CARACTERÍSTICAS FÍSICAS",
      "DETALLES FACTUALES",
      "OBJETOS Y ESPACIOS",
      "REGLAS DEL MUNDO",
      "ACCIONES Y EVENTOS",
    ])
    .describe("Categoría del error"),
  severidad: z
    .enum(["CRÍTICO", "MODERADO", "MENOR", "AMBIGUO"])
    .describe("Nivel de severidad"),
  instancia1: z.object({
    cita: z.string().describe("Cita textual exacta"),
    ubicacion: z.string().describe("Ubicación en el texto"),
  }),
  instancia2: z.object({
    cita: z.string().describe("Cita textual exacta"),
    ubicacion: z.string().describe("Ubicación en el texto"),
  }),
  analisis: z.string().describe("Explicación de por qué es una contradicción"),
  impactoEnLectura: z
    .string()
    .describe("¿Rompe inmersión? ¿Es detectable fácilmente?"),
  solucionSugerida: z
    .string()
    .describe("Cuál versión mantener o cómo armonizarlas"),
});

export const outputContinuityErrorDetectorSchema = z.object({
  resumenEjecutivo: z.object({
    totalErrores: z.number().describe("Total de errores detectados"),
    criticos: z.number().describe("Número de errores críticos"),
    moderados: z.number().describe("Número de errores moderados"),
    menores: z.number().describe("Número de errores menores"),
    ambiguos: z.number().describe("Número de errores ambiguos"),
    resumen: z.string().describe("Párrafo resumen del estado de continuidad"),
  }),
  erroresDetectados: z
    .array(errorContinuidadSchema)
    .describe("Lista de errores detectados"),
  elementosRastreadosCorrectamente: z
    .array(z.string())
    .describe("Elementos que SÍ mantienen continuidad consistente"),
  veredicto: z
    .enum([
      "CONTINUIDAD SÓLIDA",
      "ERRORES MENORES CORREGIBLES",
      "REQUIERE REVISIÓN PROFUNDA",
    ])
    .describe("Veredicto editorial"),
  prioridadesCorreccion: z
    .array(z.string())
    .min(0)
    .max(5)
    .describe("Errores prioritarios a resolver"),
  notasAdicionales: z
    .string()
    .optional()
    .describe("Patrones detectados o notas adicionales"),
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
