import { createStep } from "@mastra/core/workflows";
import {
  outputDownloadWattpadChapterSchema,
  outputEmotionalResonanceAnalyzerSchema,
} from "@repo/shared-types/mastra/validations/wattpad/wattpad-workflow.schema";
import { buildAnalyzerPrompt } from "./prompt-utils";

export { outputEmotionalResonanceAnalyzerSchema };

export const emotionalResonanceAnalyzerStep = createStep({
  id: "emotional-resonance-analyzer",
  inputSchema: outputDownloadWattpadChapterSchema,
  outputSchema: outputEmotionalResonanceAnalyzerSchema,
  execute: async ({ inputData, mastra }) => {
    if (!inputData) {
      throw new Error("Input data not found");
    }
    const { content, contextoEditorial } = inputData;

    const agent = mastra.getAgent("emotionalResonanceAnalyzerAgent");

    if (!agent) {
      throw new Error("Emotional Resonance Analyzer Agent not found");
    }

    const prompt = buildAnalyzerPrompt({
      analysisTarget: "resonancia emocional",
      rules: [
        "Identifica primero el objetivo emocional real del texto.",
        "Distingue reconocimiento pasivo vs. resonancia activa.",
        "Mide resonancia posterior (yoin), inmersión atmosférica (kūkikan) y emoción de comprensión cuando aparezcan.",
        "Si una dimensión no está activa, repórtala inactiva sin penalización automática.",
        "Devuelve EXCLUSIVAMENTE un objeto estructurado (sin XML, sin markdown, sin texto libre) con TODAS las claves requeridas: objetivoEmocional, diagnosticoEmocional, criterios, momentosEmocionalesClave, presenciaSensorial, lectorIdeal, patronesEmocionales, veredicto, recomendaciones, notaClave.",
        "Usa enums exactos y en mayúsculas: categoriaLectura ∈ [VISCERAL, RESONANTE, PRESENTE, INFORMATIVA, INERTE] y veredicto ∈ [EMOCIONALMENTE EFECTIVO, NECESITA PROFUNDIZAR, EMOCIONALMENTE PLANO].",
        "Si no tienes evidencia suficiente, completa igualmente todos los campos con valores conservadores válidos para el schema en vez de omitirlos.",
        "No sobrecompenses: identificar bien el objetivo no implica score alto.",
        "Si evidencia emocional es insuficiente, usa confianza media/baja.",
      ],
      contextoEditorial,
      content,
    });

    const stream = await agent.stream(prompt, {
      modelSettings: {
        temperature: 0.3,
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
