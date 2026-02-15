import { createStep } from "@mastra/core/workflows";
import * as z from "zod";
import { outputDownloadWattpadChapterSchema } from "./download-chapter-wattpad.step";

const criterioPersonajeSchema = z.object({
  nombre: z.string().describe("Nombre del criterio evaluado"),
  score: z.number().min(0).max(10).describe("Puntuación de 0 a 10"),
  explicacion: z
    .string()
    .describe("Explicación con evidencia textual específica"),
});

const momentoReveladorSchema = z.object({
  tipo: z
    .enum(["REVELA PROFUNDIDAD", "REVELA FALTA DE PROFUNDIDAD"])
    .describe("Tipo de momento"),
  cita: z.string().describe("Cita textual"),
  analisis: z.string().describe("Qué revela o qué oportunidad se perdió"),
});

const perfilPersonajeSchema = z.object({
  nombre: z.string().describe("Nombre del personaje analizado"),
  primeraImpresion: z
    .string()
    .describe("Cómo se presenta el personaje en superficie"),
  capasDetectadas: z
    .array(z.string())
    .describe("Capas de personalidad de superficie a profundidad"),
  contradiccionesInternas: z
    .array(z.string())
    .describe("Deseos en conflicto, brechas entre máscara y self"),
});

const analisisArcoSchema = z.object({
  estadoInicial: z.string().describe("Quién es el personaje al empezar"),
  presionesQueEnfrenta: z
    .array(z.string())
    .describe("Conflictos/situaciones que podrían provocar cambio"),
  evidenciaCambio: z
    .string()
    .describe("Qué transformación se ha mostrado, si alguna"),
  trayectoriaProyectada: z
    .string()
    .describe("Hacia dónde parece dirigirse el arco"),
  diagnostico: z
    .string()
    .describe(
      "¿Está en camino de transformación real o solo resuelve problemas externos?",
    ),
});

const personajeSecundarioSchema = z.object({
  nombre: z.string().describe("Nombre del personaje secundario"),
  evaluacion: z
    .string()
    .describe("Si tiene dimensionalidad propia o es puramente funcional"),
});

const analisisDialogoSchema = z.object({
  aportanAlTexto: z
    .enum(["SÍ", "PARCIALMENTE", "NO"])
    .describe("¿Los diálogos aportan al texto?"),
  credibilidad: z
    .string()
    .describe("¿Los diálogos suenan naturales para los personajes?"),
  observacionPrincipal: z
    .string()
    .describe("El hallazgo más relevante sobre los diálogos"),
});

export const outputCharacterDepthAnalyzerSchema = z.object({
  perfilPersonaje: perfilPersonajeSchema,
  criterios: z
    .array(criterioPersonajeSchema)
    .length(4)
    .describe(
      "Los 4 criterios: Tridimensionalidad, Diseño de Arco, Evidencia de Transformación, Voz Diálogo y Especificidad",
    ),
  momentosReveladores: z
    .array(momentoReveladorSchema)
    .min(1)
    .max(6)
    .describe("Momentos que revelan profundidad o falta de ella"),
  analisisArco: analisisArcoSchema,
  analisisDialogo: analisisDialogoSchema.describe(
    "Evaluación breve de la calidad y función de los diálogos",
  ),
  personajesSecundarios: z
    .array(personajeSecundarioSchema)
    .optional()
    .describe("Evaluación de personajes secundarios relevantes"),
  veredicto: z
    .enum([
      "PERSONAJE TRIDIMENSIONAL",
      "NECESITA PROFUNDIZAR",
      "PERSONAJE PLANO",
    ])
    .describe("Veredicto editorial"),
  recomendacionesProfundidad: z
    .array(z.string())
    .min(0)
    .max(3)
    .describe("Recomendaciones para incrementar profundidad"),
  recomendacionesArco: z
    .array(z.string())
    .min(0)
    .max(2)
    .describe("Recomendaciones para potenciar el arco"),
  notaCritica: z
    .string()
    .describe("La observación más importante sobre este personaje"),
});

export const characterDepthAnalyzerStep = createStep({
  id: "character-depth-analyzer",
  inputSchema: outputDownloadWattpadChapterSchema,
  outputSchema: outputCharacterDepthAnalyzerSchema,
  execute: async ({ inputData, mastra }) => {
    if (!inputData) {
      throw new Error("Input data not found");
    }
    const { content } = inputData;

    const agent = mastra.getAgent("characterDepthAnalyzerAgent");

    if (!agent) {
      throw new Error("Character Depth Analyzer Agent not found");
    }

    const prompt = `Analiza la profundidad y capacidad de transformación de los personajes en el siguiente texto. Evalúa si son tridimensionales, tienen capas, y si están en situaciones que permitan cambio interior genuino.

**TEXTO A ANALIZAR:**
<story_text>
\`\`\`markdown
${content}
\`\`\`
</story_text>

Proporciona tu análisis estructurado evaluando los 4 criterios (Tridimensionalidad, Diseño de Arco, Evidencia de Transformación, Especificidad), siendo específico sobre qué capas tiene el personaje (o le faltan) y si la situación narrativa permite transformación interior real.`;

    const stream = await agent.stream(prompt, {
      modelSettings: {
        temperature: 0.7,
      },
      structuredOutput: {
        schema: outputCharacterDepthAnalyzerSchema,
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
