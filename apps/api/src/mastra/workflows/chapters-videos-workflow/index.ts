import { createWorkflow } from "@mastra/core/workflows";
import {
  inputYoutubeWorkflow,
  outputChapters,
} from "@repo/shared-types/mastra/validations/youtube/youtube-workflow.schema";
import { downloadCaptionsStep } from "./steps/downloadCaptions.step";
import { generateVideoChaptersStep } from "./steps/generateVideoChapters.step";

const chaptersVideosWorkflow = createWorkflow({
  id: "chapters-videos-workflow",
  inputSchema: inputYoutubeWorkflow,
  outputSchema: outputChapters,
})
  .then(downloadCaptionsStep)
  .then(generateVideoChaptersStep);

chaptersVideosWorkflow.commit();

export { chaptersVideosWorkflow };
