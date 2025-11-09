import { z } from "zod";

/**
 * YouTube Workflow Schemas
 * Zod schemas for YouTube video processing workflow
 */

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
  type: youtubeWorkflowType,
  levelModel: z
    .enum(["light", "heavy", "high"])
    .describe("The level of the model to use"),
});

export const youtubeCaptionsSchema = z.object({
  captions: z
    .array(
      z.object({
        start: z.string().describe("The start time of the caption"),
        dur: z.string().describe("The duration of the caption"),
        text: z.string().describe("The text of the caption"),
      }),
    )
    .describe("The captions of the video"),
});

export const outputChapters = z.object({
  chapters: z.array(chapterDataSchema),
});
