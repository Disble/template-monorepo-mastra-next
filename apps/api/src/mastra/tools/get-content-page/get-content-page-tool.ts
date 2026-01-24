import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { getContentPage } from "./get-content-page-wattpad";

const contentSchema = z.object({
  content: z.string().describe("The content of the blog post"),
});

export const GET_CONTENT_WATTPAD_TOOL = "get-content-wattpad";

export const getContentPageTool = createTool({
  id: GET_CONTENT_WATTPAD_TOOL,
  description: "Get content from a web page",
  inputSchema: z.object({
    url: z.url().describe("URL of the web page to extract content from"),
    pages: z.number().describe("Number of pages to extract content from"),
  }),
  outputSchema: contentSchema,
  execute: async (inputData) => {
    const { url, pages } = inputData;
    return await getContentPage(url, pages);
  },
});
