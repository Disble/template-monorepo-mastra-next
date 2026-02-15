import { createStep } from "@mastra/core/workflows";
import * as z from "zod";
import { outputCharacterDepthAnalyzerSchema } from "./character-depth-analyzer.step";
import { outputContinuityErrorDetectorSchema } from "./continuity-error-detector.step";
import { outputEmotionalResonanceAnalyzerSchema } from "./emotional-resonance-analyzer.step";
import { outputEngamentStoryAdvisorSchema } from "./engagement-story-advisor.step";
import { outputNarrativeStructureAdvisorSchema } from "./narrative-structure-advisor.step";
import { outputPacingTensionAnalyzerSchema } from "./pacing-tension-analyzer.step";
import { outputProseDisciplineAnalyzerSchema } from "./prose-discipline-analyzer.step";

const parallelOutputSchema = z.object({
  "engagement-story-advisor": outputEngamentStoryAdvisorSchema,
  "narrative-structure-advisor": outputNarrativeStructureAdvisorSchema,
  "continuity-error-detector": outputContinuityErrorDetectorSchema,
  "emotional-resonance-analyzer": outputEmotionalResonanceAnalyzerSchema,
  "character-depth-analyzer": outputCharacterDepthAnalyzerSchema,
  "prose-discipline-analyzer": outputProseDisciplineAnalyzerSchema,
  "pacing-tension-analyzer": outputPacingTensionAnalyzerSchema,
});

const resumenDimensionSchema = z.object({
  dimension: z.string().describe("Nombre de la dimension analizada"),
  veredicto: z.string().describe("Veredicto del analisis individual"),
  scorePromedio: z
    .number()
    .min(0)
    .max(10)
    .describe("Score promedio de los criterios de esta dimension"),
  hallazgoPrincipal: z
    .string()
    .describe("Hallazgo mas importante de esta dimension"),
});

const patronTransversalSchema = z.object({
  patron: z.string().describe("Descripcion del patron identificado"),
  dimensionesAfectadas: z
    .array(z.string())
    .describe("Dimensiones que participan en este patron"),
  impacto: z
    .enum(["ALTO", "MEDIO", "BAJO"])
    .describe("Nivel de impacto del patron"),
  explicacion: z
    .string()
    .describe("Explicacion de la conexion causal entre dimensiones"),
});

const itemMejoraSchema = z.object({
  prioridad: z.number().min(1).max(10).describe("Prioridad del 1 al 10"),
  area: z.string().describe("Area de mejora"),
  recomendacion: z.string().describe("Recomendacion especifica"),
  impactoEsperado: z
    .string()
    .describe("Que otras areas mejoran si se implementa esta recomendacion"),
});

const synthesisSchema = z.object({
  evaluacionGlobal: z.object({
    scoreGlobal: z
      .number()
      .min(0)
      .max(10)
      .describe("Score global ponderado inteligente"),
    categoria: z.string().describe("Categoria de la obra"),
    resumenEjecutivo: z
      .string()
      .describe("Resumen ejecutivo que captura la esencia del texto"),
  }),
  resumenPorDimension: z
    .array(resumenDimensionSchema)
    .describe("Resumen de cada una de las 7 dimensiones analizadas"),
  patronesTransversales: z
    .array(patronTransversalSchema)
    .min(2)
    .max(7)
    .describe("Patrones que conectan multiples dimensiones"),
  fortalezasPrincipales: z
    .array(z.string())
    .min(1)
    .max(5)
    .describe("Fortalezas principales de la obra"),
  debilidadesPrincipales: z
    .array(z.string())
    .min(1)
    .max(5)
    .describe("Debilidades principales de la obra"),
  planDeMejora: z
    .array(itemMejoraSchema)
    .min(3)
    .max(10)
    .describe("Plan de mejora priorizado por impacto"),
  veredictoEditorial: z
    .string()
    .describe("Veredicto editorial final, honesto y constructivo"),
});

export const outputConglomerateReportSchema = z.object({
  analisisIndividuales: z.object({
    engagementStoryAdvisor: outputEngamentStoryAdvisorSchema.optional(),
    narrativeStructureAnalyzer:
      outputNarrativeStructureAdvisorSchema.optional(),
    continuityErrorDetector: outputContinuityErrorDetectorSchema.optional(),
    emotionalResonanceAnalyzer:
      outputEmotionalResonanceAnalyzerSchema.optional(),
    characterDepthAnalyzer: outputCharacterDepthAnalyzerSchema.optional(),
    proseDisciplineAnalyzer: outputProseDisciplineAnalyzerSchema.optional(),
    pacingTensionAnalyzer: outputPacingTensionAnalyzerSchema.optional(),
  }),
  sintesis: synthesisSchema,
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
