import z from "zod";

export const typeSchema = z
  .enum(["reading", "podcast"])
  .describe("The type of video content");

export const captionsSchema = z.object({
  captions: z
    .array(
      z.object({
        start: z.string().describe("The start time of the caption"),
        dur: z.string().describe("The duration of the caption"),
        text: z.string().describe("The text of the caption"),
      }),
    )
    .describe("The captions of the video"),
  type: typeSchema,
});
