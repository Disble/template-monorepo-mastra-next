import { Agent } from "@mastra/core/agent";
import { levelModelMap } from "../constants/shared.constant";
import { memory } from "../memory/memory";

export const youtubeVideoChaptersAgent = new Agent({
  id: "youtube-video-chapters-agent",
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
  model: levelModelMap.heavy,
  memory,
  // evals: {
  //   answerRelevancy: new AnswerRelevancyMetric(modelLight),
  // },
});
