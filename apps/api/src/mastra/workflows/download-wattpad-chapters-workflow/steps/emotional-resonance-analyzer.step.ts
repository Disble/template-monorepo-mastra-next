import { createStep } from "@mastra/core/workflows";
import * as z from "zod";
import { outputDownloadWattpadChapterSchema } from "./download-chapter-wattpad.step";

const criterioEmocionalSchema = z.object({
  nombre: z.string().describe("Nombre del criterio evaluado"),
  score: z.number().min(0).max(10).describe("Puntuación de 0 a 10"),
  explicacion: z
    .string()
    .describe("Explicación con evidencia textual específica"),
});

const momentoEmocionalSchema = z.object({
  tipo: z
    .enum(["FUNCIONA", "FALLA"])
    .describe("Si el momento funciona o falla emocionalmente"),
  cita: z.string().describe("Cita breve del momento"),
  analisis: z.string().describe("Por qué genera o no genera emoción"),
  emocion: z
    .string()
    .describe("Qué emoción genera o qué oportunidad emocional se pierde"),
});

const presenciaSensorialSchema = z.object({
  sentidosPresentes: z
    .array(z.string())
    .describe("Sentidos que el texto activa efectivamente"),
  sentidosAusentes: z
    .array(z.string())
    .describe("Sentidos ausentes que enriquecerían la experiencia"),
  analisis: z
    .string()
    .describe(
      "Cómo la presencia/ausencia sensorial afecta la inmersión emocional",
    ),
});

export const outputEmotionalResonanceAnalyzerSchema = z.object({
  diagnosticoEmocional: z.object({
    categoriaLectura: z
      .enum(["VISCERAL", "RESONANTE", "PRESENTE", "INFORMATIVA", "INERTE"])
      .describe("Categoría de lectura emocional"),
    descripcion: z
      .string()
      .describe(
        "Qué se siente al leer este texto, experiencia emocional dominante",
      ),
  }),
  criterios: z
    .array(criterioEmocionalSchema)
    .length(4)
    .describe(
      "Los 4 criterios: Intensidad Emocional, Variedad Emocional, Autenticidad Emocional, Técnica Emocional",
    ),
  momentosEmocionalesClave: z
    .array(momentoEmocionalSchema)
    .min(2)
    .max(6)
    .describe("Momentos donde la emoción funciona o falla"),
  presenciaSensorial: presenciaSensorialSchema.describe(
    "Evaluación de qué sentidos activa el texto y cuáles están ausentes",
  ),
  lectorIdeal: z
    .string()
    .describe(
      "Perfil breve del lector que más conectaría con este texto (emocional/experiencial, no comercial)",
    ),
  patronesEmocionales: z
    .array(z.string())
    .min(1)
    .max(5)
    .describe("Patrones generales identificados en el manejo emocional"),
  veredicto: z
    .enum([
      "EMOCIONALMENTE EFECTIVO",
      "NECESITA PROFUNDIZAR",
      "EMOCIONALMENTE PLANO",
    ])
    .describe("Veredicto editorial"),
  recomendaciones: z
    .array(z.string())
    .min(0)
    .max(3)
    .describe("Acciones específicas para incrementar resonancia emocional"),
  notaClave: z
    .string()
    .describe("La observación más importante sobre la emocionalidad del texto"),
});

export const emotionalResonanceAnalyzerStep = createStep({
  id: "emotional-resonance-analyzer",
  inputSchema: outputDownloadWattpadChapterSchema,
  outputSchema: outputEmotionalResonanceAnalyzerSchema,
  execute: async ({ inputData, mastra }) => {
    if (!inputData) {
      throw new Error("Input data not found");
    }
    const { content } = inputData;

    const agent = mastra.getAgent("emotionalResonanceAnalyzerAgent");

    if (!agent) {
      throw new Error("Emotional Resonance Analyzer Agent not found");
    }

    const prompt = `Analiza la resonancia emocional del siguiente texto. Evalúa si genera emociones genuinas en el lector o permanece a nivel informativo. Identifica qué técnicas usa (o no usa) para transmitir emoción.

**TEXTO A ANALIZAR:**
<story_text>
\`\`\`markdown
${content}
\`\`\`
</story_text>

Proporciona tu análisis estructurado evaluando los 4 criterios (Intensidad Emocional, Variedad Emocional, Autenticidad Emocional, Técnica Emocional), siendo específico sobre qué emociones se generan (o no) y por qué técnicamente funciona o falla.`;

    const stream = await agent.stream(prompt, {
      modelSettings: {
        temperature: 0.7,
      },
      structuredOutput: {
        schema: outputEmotionalResonanceAnalyzerSchema,
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
