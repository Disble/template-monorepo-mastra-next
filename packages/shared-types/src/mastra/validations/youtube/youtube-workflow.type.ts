import type { z } from "zod";
import type {
  chapterDataSchema,
  inputYoutubeWorkflow,
  levelModelSchema,
  outputChapters,
  youtubeCaptionsSchema,
  youtubeWorkflowType,
} from "./youtube-workflow.schema";

/**
 * Chapter data structure (inferred from schema)
 */
export type ChapterData = z.infer<typeof chapterDataSchema>;
export type InputYoutubeWorkflow = z.infer<typeof inputYoutubeWorkflow>;
export type YoutubeCaptionsSchema = z.infer<typeof youtubeCaptionsSchema>;
export type OutputChapters = z.infer<typeof outputChapters>;
export type YoutubeWorkflowType = z.infer<typeof youtubeWorkflowType>;
export type YoutubeLevelModel = z.infer<typeof levelModelSchema>;
