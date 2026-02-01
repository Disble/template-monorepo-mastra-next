import { createStep } from "@mastra/core/workflows";
import * as z from "zod";
import { outputDownloadWattpadChapterSchema } from "./download-chapter-wattpad.step";

const ejemploProblemaSchema = z.object({
  cita: z.string().describe("Cita textual del problema"),
  problema: z.string().describe("Descripción del problema"),
  severidad: z
    .enum(["CRÍTICO", "MODERADO", "MENOR", "ESTILÍSTICO"])
    .describe("Nivel de severidad"),
  alternativa: z.string().optional().describe("Alternativa sugerida si aplica"),
});

const adverbioProblemaSchema = z.object({
  cita: z.string().describe("Cita con contexto"),
  severidad: z
    .enum(["CRÍTICO", "MODERADO", "MENOR"])
    .describe("Nivel de severidad"),
  alternativa: z.string().describe("Cómo reescribirlo"),
});

const repeticionSchema = z.object({
  palabra: z.string().describe("Palabra o estructura repetida"),
  veces: z.number().describe("Número de veces en proximidad"),
  ubicaciones: z.string().describe("Citas breves o indicación de ubicaciones"),
  severidad: z
    .enum(["CRÍTICO", "MODERADO", "MENOR"])
    .describe("Nivel de severidad"),
});

export const outputProseDisciplineAnalyzerSchema = z.object({
  resumenEjecutivo: z.object({
    nivelDisciplina: z
      .enum([
        "DISCIPLINADO",
        "ALGUNOS EXCESOS",
        "ENGOLOSINAMIENTO NOTABLE",
        "NECESITA EDICIÓN PROFUNDA",
      ])
      .describe("Nivel general de disciplina"),
    descripcion: z.string().describe("Caracterización general de la prosa"),
  }),
  engolosinamiento: z.object({
    hayEngolosinamiento: z
      .enum(["SÍ", "ALGO", "NO"])
      .describe("¿Hay engolosinamiento?"),
    descripcionesOrnamentales: z
      .array(ejemploProblemaSchema)
      .describe("Descripciones ornamentales sin función"),
    juegosAutocomplacientes: z
      .array(ejemploProblemaSchema)
      .describe("Juegos de palabras auto-complacientes"),
    exhibicionismoLexico: z
      .array(ejemploProblemaSchema)
      .describe("Exhibicionismo léxico"),
  }),
  malosHabitosTecnicos: z.object({
    adverbiosMente: z.object({
      frecuenciaTotal: z.number().describe("Total de ocurrencias en el texto"),
      problematicas: z.number().describe("Número de problemáticas"),
      ejemplos: z
        .array(adverbioProblemaSchema)
        .describe("Ejemplos problemáticos"),
    }),
    repeticiones: z.array(repeticionSchema).describe("Repeticiones detectadas"),
    cacofonias: z
      .array(ejemploProblemaSchema)
      .describe("Cacofonías detectadas"),
    inconsistenciasTemporales: z
      .array(ejemploProblemaSchema)
      .describe("Inconsistencias temporales"),
    otrosVicios: z
      .array(ejemploProblemaSchema)
      .describe("Otros vicios detectados"),
  }),
  patronesGenerales: z
    .array(z.string())
    .min(1)
    .max(5)
    .describe("Patrones sistemáticos identificados"),
  elementosBienEjecutados: z
    .array(z.string())
    .min(0)
    .max(3)
    .describe("Qué hace bien el autor en disciplina de prosa"),
  veredicto: z
    .enum([
      "PROSA DISCIPLINADA",
      "NECESITA EDICIÓN DE LÍNEA",
      "NECESITA REVISIÓN PROFUNDA",
    ])
    .describe("Veredicto editorial"),
  prioridadesCorreccion: z
    .array(z.string())
    .min(0)
    .max(3)
    .describe("Problemas prioritarios a resolver"),
  recomendacionesGenerales: z
    .array(z.string())
    .min(0)
    .max(3)
    .describe("Consejos generales"),
  notaSobreEstilo: z
    .string()
    .optional()
    .describe("Nota si algunos problemas podrían ser elecciones estilísticas"),
});

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
