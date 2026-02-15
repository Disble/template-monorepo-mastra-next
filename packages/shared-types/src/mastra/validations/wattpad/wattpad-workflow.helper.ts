import { createWorkflowSchema } from "#mastra/validations/workflows/workflow-validation.helper";
import type { WorkflowSteps } from "#mastra/validations/workflows/workflow-validation.type";
import {
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
} from "./wattpad-workflow.schema";

export const wattpadWorkflowSteps = {
  "download-wattpad-chapter": {
    input: inputDownloadWattpadChapterSchema,
    output: outputDownloadWattpadChapterSchema,
  },
  "engagement-story-advisor": {
    input: outputDownloadWattpadChapterSchema,
    output: outputEngamentStoryAdvisorSchema,
  },
  "narrative-structure-advisor": {
    input: outputDownloadWattpadChapterSchema,
    output: outputNarrativeStructureAdvisorSchema,
  },
  "continuity-error-detector": {
    input: outputDownloadWattpadChapterSchema,
    output: outputContinuityErrorDetectorSchema,
  },
  "emotional-resonance-analyzer": {
    input: outputDownloadWattpadChapterSchema,
    output: outputEmotionalResonanceAnalyzerSchema,
  },
  "character-depth-analyzer": {
    input: outputDownloadWattpadChapterSchema,
    output: outputCharacterDepthAnalyzerSchema,
  },
  "prose-discipline-analyzer": {
    input: outputDownloadWattpadChapterSchema,
    output: outputProseDisciplineAnalyzerSchema,
  },
  "pacing-tension-analyzer": {
    input: outputDownloadWattpadChapterSchema,
    output: outputPacingTensionAnalyzerSchema,
  },
  "conglomerate-report": {
    output: outputConglomerateReportSchema,
  },
} as const satisfies WorkflowSteps;

export const wattpadWorkflowSchema = createWorkflowSchema(
  wattpadWorkflowSteps,
  "conglomerate-report",
);
