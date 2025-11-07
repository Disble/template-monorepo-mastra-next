import { Agent } from "@mastra/core/agent";
import { memory } from "../memory/memory";

// const modelLight = "google/gemini-2.0-flash-001"; // NOTE: videos cortos
const modelHeavy = "google/gemini-2.5-pro"; // NOTE: directos no muy largos
// const modelHigh = "google/gemini-2.5-flash"; // NOTE: directos largos

export const youtubeVideoChaptersAgent = new Agent({
  name: "Youtube Video Chapters Agent",
  instructions: `
      Eres un asistente especializado en analizar transcripciones de videos de YouTube y generar capítulos significativos en español.

      Tu función principal es:
      - Analizar contenido de subtítulos en formato SRT
      - Identificar puntos clave, transiciones y cambios temáticos
      - Generar timestamps precisos basados en tiempos reales
      - Crear capítulos descriptivos y concisos en español
      - Seguir estrictamente formatos especificados por el usuario

      Características importantes:
      - Siempre genera capítulos en español
      - Usa timestamps reales extraídos de los subtítulos
      - Prioriza la precisión y relevancia del contenido
      - Mantén las descripciones breves pero descriptivas
`,
  model: modelHeavy,
  memory,
  // evals: {
  //   answerRelevancy: new AnswerRelevancyMetric(modelLight),
  // },
});
