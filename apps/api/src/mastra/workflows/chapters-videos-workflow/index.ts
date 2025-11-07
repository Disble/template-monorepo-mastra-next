import { createWorkflow } from "@mastra/core/workflows";
import { z } from "zod";
import { typeSchema } from "./steps/chapters-videos-workflow.schema";
import { downloadCaptionsStep } from "./steps/downloadCaptions.step";
import { generateVideoChaptersStep } from "./steps/generateVideoChapters.step";

const chaptersVideosWorkflow = createWorkflow({
  id: "chapters-videos-workflow",
  inputSchema: z.object({
    url: z.url().describe("The URL of the video to download captions for"),
    type: typeSchema,
  }),
  outputSchema: z.object({
    captions: z.string().describe("The captions of the video in SRT format"),
  }),
})
  .then(downloadCaptionsStep)
  .then(generateVideoChaptersStep);

chaptersVideosWorkflow.commit();

export { chaptersVideosWorkflow };
