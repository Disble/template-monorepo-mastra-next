import { z } from "zod";

/**
 * YouTube Workflow Schemas
 * Zod schemas for YouTube video processing workflow
 */

/**
 * Processing intensity levels for YouTube workflow models.
 *
 * Defines the computational complexity and resource allocation
 * for video processing operations:
 *
 * - `light`: Minimal processing, fastest execution, lower accuracy
 * - `heavy`: Moderate processing, balanced performance and accuracy
 * - `high`: Maximum processing, highest accuracy, slower execution
 */
export const levelModel = ["light", "heavy", "high"] as const;

/**
 * Zod validation schema for model processing levels.
 *
 * Validates that the selected processing level is one of the
 * supported intensity levels defined in `levelModel`.
 *
 * @see levelModel - For available processing levels
 */
export const levelModelSchema = z
  .enum(levelModel)
  .describe("The level of the model to use");

/**
 * Chapter data structure
 */
export const chapterDataSchema = z.object({
  timestamp: z.string().describe("The timestamp of the chapter"),
  description: z.string().describe("The description of the chapter"),
});

/**
 * Enum schema for YouTube workflow content types.
 *
 * Defines the allowed types of video content that can be processed
 * in YouTube workflows. Currently supports reading and podcast formats.
 */
export const youtubeWorkflowType = z
  .enum(["reading", "podcast"])
  .describe("The type of video content");

/**
 * Download captions step schemas
 */
export const inputYoutubeWorkflow = z.object({
  url: z.url().describe("The URL of the video to download the captions for"),
  userId: z
    .string()
    .describe(
      "The ID of the user whose Google tokens will be used for API authentication",
    ),
  type: youtubeWorkflowType,
  levelModel: levelModelSchema,
});

export const youtubeCaptionsSchema = z.object({
  srt: z.string().describe("The SRT captions content as string"),
});

export const outputChapters = z.object({
  chapters: z.array(chapterDataSchema),
});
