import type { z } from "zod";
import type {
  inputDownloadWattpadChapterSchema,
  outputCharacterDepthAnalyzerSchema,
  outputConglomerateReportSchema,
  outputContinuityErrorDetectorSchema,
  outputDownloadWattpadChapterSchema,
  outputEmotionalResonanceAnalyzerSchema,
  outputEngamentStoryAdvisorSchema,
  outputNarrativeStructureAdvisorSchema,
  outputPacingTensionAnalyzerSchema,
  outputProseDisciplineAnalyzerSchema,
  synthesisSchema,
} from "./wattpad-workflow.schema";

export type InputDownloadWattpadChapter = z.infer<
  typeof inputDownloadWattpadChapterSchema
>;
export type OutputDownloadWattpadChapter = z.infer<
  typeof outputDownloadWattpadChapterSchema
>;
export type OutputEngamentStoryAdvisor = z.infer<
  typeof outputEngamentStoryAdvisorSchema
>;
export type OutputNarrativeStructureAdvisor = z.infer<
  typeof outputNarrativeStructureAdvisorSchema
>;
export type OutputContinuityErrorDetector = z.infer<
  typeof outputContinuityErrorDetectorSchema
>;
export type OutputEmotionalResonanceAnalyzer = z.infer<
  typeof outputEmotionalResonanceAnalyzerSchema
>;
export type OutputCharacterDepthAnalyzer = z.infer<
  typeof outputCharacterDepthAnalyzerSchema
>;
export type OutputProseDisciplineAnalyzer = z.infer<
  typeof outputProseDisciplineAnalyzerSchema
>;
export type OutputPacingTensionAnalyzer = z.infer<
  typeof outputPacingTensionAnalyzerSchema
>;
export type OutputConglomerateReport = z.infer<
  typeof outputConglomerateReportSchema
>;
export type Synthesis = z.infer<typeof synthesisSchema>;
