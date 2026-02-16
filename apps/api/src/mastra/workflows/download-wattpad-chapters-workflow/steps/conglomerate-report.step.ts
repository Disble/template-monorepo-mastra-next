import { createStep } from "@mastra/core/workflows";
import {
  outputCharacterDepthAnalyzerSchema,
  outputConglomerateReportSchema,
  outputContinuityErrorDetectorSchema,
  outputEmotionalResonanceAnalyzerSchema,
  outputEngamentStoryAdvisorSchema,
  outputNarrativeStructureAdvisorSchema,
  outputPacingTensionAnalyzerSchema,
  outputProseDisciplineAnalyzerSchema,
  synthesisSchema,
} from "@repo/shared-types/mastra/validations/wattpad/wattpad-workflow.schema";
import { z } from "zod";

export { outputConglomerateReportSchema };

const parallelOutputSchema = z.object({
  "engagement-story-advisor": outputEngamentStoryAdvisorSchema,
  "narrative-structure-advisor": outputNarrativeStructureAdvisorSchema,
  "continuity-error-detector": outputContinuityErrorDetectorSchema,
  "emotional-resonance-analyzer": outputEmotionalResonanceAnalyzerSchema,
  "character-depth-analyzer": outputCharacterDepthAnalyzerSchema,
  "prose-discipline-analyzer": outputProseDisciplineAnalyzerSchema,
  "pacing-tension-analyzer": outputPacingTensionAnalyzerSchema,
});

export const sendReportToUserStep = createStep({
  id: "conglomerate-report",
  inputSchema: parallelOutputSchema,
  outputSchema: outputConglomerateReportSchema,
  execute: async ({ inputData, mastra }) => {
    const engagement = inputData["engagement-story-advisor"];
    const narrativeStructure = inputData["narrative-structure-advisor"];
    const continuityErrors = inputData["continuity-error-detector"];
    const emotionalResonance = inputData["emotional-resonance-analyzer"];
    const characterDepth = inputData["character-depth-analyzer"];
    const proseDiscipline = inputData["prose-discipline-analyzer"];
    const pacingTension = inputData["pacing-tension-analyzer"];

    const analisisIndividuales = {
      engagementStoryAdvisor: engagement,
      narrativeStructureAnalyzer: narrativeStructure,
      continuityErrorDetector: continuityErrors,
      emotionalResonanceAnalyzer: emotionalResonance,
      characterDepthAnalyzer: characterDepth,
      proseDisciplineAnalyzer: proseDiscipline,
      pacingTensionAnalyzer: pacingTension,
    };

    const agent = mastra.getAgent("literarySynthesisAgent");

    if (!agent) {
      throw new Error("Literary Synthesis Agent not found");
    }

    const prompt = `Sintetiza los siguientes 7 analisis literarios especializados en una evaluacion global coherente. NO re-analices el texto original. Tu trabajo es interpretar, ponderar, detectar sesgos y producir una sintesis inteligente.

  Reglas de rigor:
  - Todo ajuste de score debe ser trazable (agente, score original, score ajustado, razon concreta).
  - Corregir sesgo no es bonificar: recalibra por calidad real dentro del modelo correcto.
  - Si falta evidencia para una conclusion fuerte, usa confianza media/baja y evita extrapolar.
  - Mantén coherencia global: no otorgues score alto si persisten fallos críticos de comprensión.
  - Declara SIEMPRE patrón narrativo [A/B/C/D/E] con justificación breve; si no encaja, usa E.
  - Si detectas fricción entre patrón narrativo y expectativas de audiencia, repórtalo como observación contextual, no como defecto.

**ANALISIS RECIBIDOS:**
<analisis_json>
${JSON.stringify(analisisIndividuales, null, 2)}
</analisis_json>

Sigue tu proceso de calibracion paso a paso:

1. **Identificacion del texto**: Clasifica el texto (genero, tono, proposito, modelo de personaje, fuente de enganche) ANTES de procesar los scores.

2. **Evaluacion global**: Score 0-10 ponderado por jerarquia de capas (Capa 1: comprension > Capa 2: voz/forma > Capa 3: experiencia lector > Capa 4: contenido profundo > Capa 5: ejecucion tecnica) y por relevancia de cada dimension para el tipo de texto. Categoria y resumen ejecutivo.

3. **Resumen por dimension**: 7 dimensiones con veredicto, score promedio, hallazgo principal.

4. **Deteccion y correccion de sesgos**: Revisa si algun agente penalizo por la razon equivocada (sesgo de transformacion, profundidad emocional, consecuencias, anticlimax, modo narrativo). Para cada correccion, indica agente, score original, score ajustado, tipo de sesgo y explicacion breve. Si no hay sesgos, devuelve array vacio. **IMPORTANTE: El ajuste no es una bonificacion, es una recalibracion.** Si un agente dio un 3 por la razon equivocada, re-evalua desde cero dentro del modelo correcto — el score podria ser un 5, no necesariamente un 7 o un 8.

5. **Patrones transversales**: 2-7 conexiones causales entre dimensiones.

6. **Patrón narrativo**: Completa el campo estructurado patronNarrativo con: patron (A/B/C/D/E), justificacion breve basada en dimensiones activas y notaFriccionAudiencia solo si aplica.

7. **Fortalezas y debilidades principales**: 1-5 de cada una.

8. **Plan de mejora priorizado**: 3-10 items priorizados por efecto domino.

9. **Veredicto editorial estructurado**: Responde en orden: Se entiende lo que ocurre? Las decisiones de voz/estructura/forma funcionan? Provoca algo en el lector? Hay profundidad? Ejecucion tecnica? Sugerencias priorizadas.`;

    const stream = await agent.stream(prompt, {
      modelSettings: {
        temperature: 0.35,
      },
      structuredOutput: {
        schema: synthesisSchema,
      },
    });

    // Stream with logging
    for await (const chunk of stream.textStream) {
      console.log(chunk);
    }

    // Get structured object from stream
    const sintesis = await stream.object;

    if (!sintesis) {
      throw new Error("No synthesis generated");
    }

    return {
      analisisIndividuales,
      sintesis,
    };
  },
});
