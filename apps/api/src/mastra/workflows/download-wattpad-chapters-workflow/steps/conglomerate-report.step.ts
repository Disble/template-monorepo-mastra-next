import { createStep } from "@mastra/core/workflows";
import * as z from "zod";
import { outputCharacterDepthAnalyzerSchema } from "./character-depth-analyzer.step";
import { outputContinuityErrorDetectorSchema } from "./continuity-error-detector.step";
import { outputEmotionalResonanceAnalyzerSchema } from "./emotional-resonance-analyzer.step";
import { outputEngamentStoryAdvisorSchema } from "./engagement-story-advisor.step";
import { outputNarrativeStructureAdvisorSchema } from "./narrative-structure-advisor.step";
import { outputProseDisciplineAnalyzerSchema } from "./prose-discipline-analyzer.step";

const parallelOutputSchema = z.object({
  "engagement-story-advisor": outputEngamentStoryAdvisorSchema,
  "narrative-structure-advisor": outputNarrativeStructureAdvisorSchema,
  "continuity-error-detector": outputContinuityErrorDetectorSchema,
  "emotional-resonance-analyzer": outputEmotionalResonanceAnalyzerSchema,
  "character-depth-analyzer": outputCharacterDepthAnalyzerSchema,
  "prose-discipline-analyzer": outputProseDisciplineAnalyzerSchema,
});

export const outputConglomerateReportSchema = z.object({
  engagementStoryAdvisor: z.string().optional(),
  narrativeStructureAnalyzer: z.string().optional(),
  continuityErrorDetector: z.string().optional(),
  emotionalResonanceAnalyzer: z.string().optional(),
  characterDepthAnalyzer: z.string().optional(),
  proseDisciplineAnalyzer: z.string().optional(),
});

export const sendReportToUserStep = createStep({
  id: "conglomerate-report",
  inputSchema: parallelOutputSchema,
  outputSchema: outputConglomerateReportSchema,
  execute: async ({ inputData }) => {
    const engagement = inputData["engagement-story-advisor"];
    const narrativeStructure = inputData["narrative-structure-advisor"];
    const continuityErrors = inputData["continuity-error-detector"];
    const emotionalResonance = inputData["emotional-resonance-analyzer"];
    const characterDepth = inputData["character-depth-analyzer"];
    const proseDiscipline = inputData["prose-discipline-analyzer"];

    return {
      engagementStoryAdvisor: engagement?.report,
      narrativeStructureAnalyzer: narrativeStructure?.report,
      continuityErrorDetector: continuityErrors?.report,
      emotionalResonanceAnalyzer: emotionalResonance?.report,
      characterDepthAnalyzer: characterDepth?.report,
      proseDisciplineAnalyzer: proseDiscipline?.report,
    };
  },
});
