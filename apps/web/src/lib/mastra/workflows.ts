import { mastraClient } from "./mastra-client";

export const chaptersVideosWorkflow: ReturnType<
  typeof mastraClient.getWorkflow
> = mastraClient.getWorkflow("chaptersVideosWorkflow");
