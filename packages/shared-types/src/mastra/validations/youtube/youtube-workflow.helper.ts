import { createWorkflowSchema } from "#mastra/validations/workflows/workflow-validation.helper";
import type { WorkflowSteps } from "#mastra/validations/workflows/workflow-validation.type";
import {
  inputYoutubeWorkflow,
  outputChapters,
  youtubeCaptionsSchema,
} from "./youtube-workflow.schema";

/**
 * Step schemas configuration for YouTube workflow
 */
export const youtubeWorkflowSteps = {
  "download-captions": {
    input: inputYoutubeWorkflow,
    output: youtubeCaptionsSchema,
  },
  "generate-video-chapters": {
    input: youtubeCaptionsSchema,
    output: outputChapters,
  },
} as const satisfies WorkflowSteps;

/**
 * YouTube workflow schema with step validation.
 */
export const youtubeWorkflowSchema = createWorkflowSchema(
  youtubeWorkflowSteps,
  "generate-video-chapters",
);
