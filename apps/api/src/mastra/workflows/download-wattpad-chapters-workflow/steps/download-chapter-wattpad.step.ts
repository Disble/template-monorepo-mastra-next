import { createStep } from "@mastra/core/workflows";
import * as z from "zod";
import { getContentPage } from "../../../tools/get-content-page/get-content-page-wattpad";

export const inputDownloadWattpadChapterSchema = z.object({
  url: z.url(),
  pages: z.number().min(1).max(100).default(1),
});

export const outputDownloadWattpadChapterSchema = z.object({
  content: z.string(),
});

export const downloadWattpadChapterStep = createStep({
  id: "download-wattpad-chapter",
  inputSchema: inputDownloadWattpadChapterSchema,
  outputSchema: outputDownloadWattpadChapterSchema,
  execute: async ({ inputData }) => {
    if (!inputData) {
      throw new Error("Input data not found");
    }
    const { url, pages } = inputData;
    const responseContentPage = await getContentPage(url, pages);
    return responseContentPage;
  },
});
