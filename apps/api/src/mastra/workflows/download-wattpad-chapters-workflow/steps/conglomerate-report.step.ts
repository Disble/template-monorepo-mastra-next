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
  engagementStoryAdvisor: outputEngamentStoryAdvisorSchema.optional(),
  narrativeStructureAnalyzer: outputNarrativeStructureAdvisorSchema.optional(),
  continuityErrorDetector: outputContinuityErrorDetectorSchema.optional(),
  emotionalResonanceAnalyzer: outputEmotionalResonanceAnalyzerSchema.optional(),
  characterDepthAnalyzer: outputCharacterDepthAnalyzerSchema.optional(),
  proseDisciplineAnalyzer: outputProseDisciplineAnalyzerSchema.optional(),
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
      engagementStoryAdvisor: engagement,
      narrativeStructureAnalyzer: narrativeStructure,
      continuityErrorDetector: continuityErrors,
      emotionalResonanceAnalyzer: emotionalResonance,
      characterDepthAnalyzer: characterDepth,
      proseDisciplineAnalyzer: proseDiscipline,
    };
  },
});
