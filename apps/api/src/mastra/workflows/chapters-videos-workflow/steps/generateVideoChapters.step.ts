import { createStep } from "@mastra/core/workflows";
import { z } from "zod";
import { captionsSchema } from "./chapters-videos-workflow.schema";

const chaptersSchema = z.object({
  chapters: z.array(
    z.object({
      timestamp: z.string().describe("The timestamp of the chapter"),
      description: z.string().describe("The description of the chapter"),
    }),
  ),
});

export const generateVideoChaptersStep = createStep({
  id: "generate-video-chapters",
  inputSchema: captionsSchema,
  outputSchema: chaptersSchema,
  execute: async ({ inputData, mastra }) => {
    if (!inputData) {
      throw new Error("Input data not found");
    }
    const { captions, type } = inputData;
    const agent = mastra?.getAgent("youtubeVideoChaptersAgent");
    if (!agent) {
      throw new Error("Video chapters agent not found");
    }

    const example =
      type === "podcast"
        ? `00:00:00 Iniciando
00:08:51 Bienvenida a la autora Roma Damned
00:12:34 Pregunta de la invitada anterior
00:18:26 El comienzo de Roma como autora en Wattpad
00:24:43 La creación de Queen Editorial y críticas al mundo editorial
00:45:02 Consejos: ¿Qué NO hacer al presentar un manuscrito?
00:55:10 Cómo lidiar con las malas reseñas y los trolls
01:05:29 El mayor desafío de publicar por primera vez
01:22:40 Su primer contrato editorial: ¿Cómo fue?
01:28:17 Consejo final para escritores novatos
01:35:40 Despedida y cierre`
        : `00:00:00 Iniciando
    00:11:19 Introducción y Bienvenida
    00:15:15 Presentación de la novela
    00:19:13 Lectura de la sinopsis
    00:20:35 Análisis de la sinopsis
    00:26:30 Lectura del Prólogo
    00:37:12 Análisis del Prólogo
    00:51:14 Lectura del Capítulo 1
    01:06:36 Análisis del Capítulo 1
    01:24:05 Consejos generales de escritura
    01:32:18 Despedida
    01:35:01 Finalizando`;

    const prompt = `
    FORMATO REQUERIDO:
    Genera capítulos en el siguiente formato exacto:
    [HH:]MM:SS Descripción breve del capítulo

    EJEMPLO:
    ${example}

    INSTRUCCIONES ESPECÍFICAS:
    - Las descripciones deben ser breves (máximo 4-5 palabras)
    - Incluye capítulo inicial en 0:00 y final
    - Usa timestamps reales de los subtítulos

    CONTENIDO A ANALIZAR:
    \`\`\`json
    ${JSON.stringify(captions, null, 2)}
    \`\`\`

    Genera los capítulos siguiendo el formato especificado.
    `;

    const { object, usage } = await agent.generate(
      [
        {
          role: "user",
          content: prompt,
        },
      ],
      {
        structuredOutput: {
          schema: chaptersSchema,
          // model: 'google/gemini-2.0-flash-001',
          model: "google/gemini-2.5-flash",
        },
      },
    );

    console.log("🔴 Token usage", usage);
    console.log("🔍 Texto generado:", object);

    if (!object) {
      throw new Error("No chapters generated");
    }

    return object;
  },
});
