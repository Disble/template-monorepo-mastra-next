import { createWorkflow } from "@mastra/core/workflows";
import { characterDepthAnalyzerStep } from "./steps/character-depth-analyzer.step";
import {
  outputConglomerateReportSchema,
  sendReportToUserStep,
} from "./steps/conglomerate-report.step";
import { continuityErrorDetectorStep } from "./steps/continuity-error-detector.step";
import {
  downloadWattpadChapterStep,
  inputDownloadWattpadChapterSchema,
} from "./steps/download-chapter-wattpad.step";
import { emotionalResonanceAnalyzerStep } from "./steps/emotional-resonance-analyzer.step";
import { engagementStoryAdvisorStep } from "./steps/engagement-story-advisor.step";
import { narrativeStructureAdvisorStep } from "./steps/narrative-structure-advisor.step";
import { pacingTensionAnalyzerStep } from "./steps/pacing-tension-analyzer.step";
import { proseDisciplineAnalyzerStep } from "./steps/prose-discipline-analyzer.step";

const wattpadChapterDownloadWorkflow = createWorkflow({
  id: "wattpad-chapter-download-workflow",
  inputSchema: inputDownloadWattpadChapterSchema,
  outputSchema: outputConglomerateReportSchema,
})
  .then(downloadWattpadChapterStep)
  .parallel([
    engagementStoryAdvisorStep,
    narrativeStructureAdvisorStep,
    continuityErrorDetectorStep,
    emotionalResonanceAnalyzerStep,
    characterDepthAnalyzerStep,
    proseDisciplineAnalyzerStep,
    pacingTensionAnalyzerStep,
  ])
  .then(sendReportToUserStep);

wattpadChapterDownloadWorkflow.commit();

export { wattpadChapterDownloadWorkflow };
