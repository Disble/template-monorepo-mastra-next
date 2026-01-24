import { createWorkflow } from "@mastra/core/workflows";
import {
  downloadWattpadChapterStep,
  inputDownloadWattpadChapterSchema,
  outputDownloadWattpadChapterSchema,
} from "./steps/download-chapter-wattpad.step";

const wattpadChapterDownloadWorkflow = createWorkflow({
  id: "wattpad-chapter-download-workflow",
  inputSchema: inputDownloadWattpadChapterSchema,
  outputSchema: outputDownloadWattpadChapterSchema,
}).then(downloadWattpadChapterStep);

wattpadChapterDownloadWorkflow.commit();

export { wattpadChapterDownloadWorkflow };
