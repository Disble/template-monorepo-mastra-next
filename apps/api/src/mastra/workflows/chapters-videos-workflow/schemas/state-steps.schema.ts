import { youtubeWorkflowType } from "@repo/shared-types/mastra/validations/youtube/youtube-workflow.schema";
import * as z from "zod";

export const stateStepsSchema = z.object({
  type: youtubeWorkflowType,
});
