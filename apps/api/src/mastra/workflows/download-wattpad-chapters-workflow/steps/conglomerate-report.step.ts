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

    const prompt = `Sintetiza los siguientes 7 analisis literarios especializados en una evaluacion global coherente. NO re-analices el texto original. Tu trabajo es encontrar patrones transversales, conexiones causales entre dimensiones, y producir un plan de mejora priorizado por impacto.

**ANALISIS RECIBIDOS:**
<analisis_json>
${JSON.stringify(analisisIndividuales, null, 2)}
</analisis_json>

Produce una sintesis que incluya:
1. Evaluacion global (score 0-10 ponderado inteligente, categoria, resumen ejecutivo)
2. Resumen por dimension (7 dimensiones con veredicto, score promedio, hallazgo principal)
3. Patrones transversales (2-7 conexiones entre dimensiones)
4. Fortalezas principales (1-5)
5. Debilidades principales (1-5)
6. Plan de mejora priorizado por impacto (3-10 items, priorizados por efecto domino)
7. Veredicto editorial final`;

    const stream = await agent.stream(prompt, {
      modelSettings: {
        temperature: 0.7,
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
