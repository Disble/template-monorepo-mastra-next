import { Stagehand } from "@browserbasehq/stagehand";

/**
 * Extracts the page number from a Wattpad URL
 * @param url URL to analyze
 * @returns Page number or null if invalid
 */
function extractPageNumber(url: string): number | null {
  const regex = /\/page\/(\d+)$/;
  const match = url.match(regex);
  return match?.[1] ? parseInt(match[1], 10) : null;
}

/**
 * Retrieves and extracts content from a Wattpad story page
 *
 * This function uses Stagehand to navigate to a Wattpad URL, scroll to the specified page,
 * and extract the post content in markdown format using an AI model.
 *
 * @param url - The Wattpad story URL to fetch content from
 * @param pages - The target page number to scroll to and extract content from
 * @returns Promise resolving to an object containing the extracted content string
 * @throws Logs errors to console if extraction or navigation fails
 *
 * @example
 * const result = await getContentPage('https://www.wattpad.com/story/123456/page/1', 5);
 * console.log(result.content); // Extracted markdown content
 */
export async function getContentPage(url: string, pages: number) {
  try {
    console.log("👋👋👋 Reset mastra tool 👋👋👋");
    const stagehand = new Stagehand({
      env: "LOCAL",
      model: {
        // modelName: "google/gemini-2.0-flash",
        // apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
        modelName: "ollama/maternion/fara:latest",
      },
    });

    await stagehand.init();

    console.log(`👑Stagehand Session Started👑`);

    const page = stagehand.context.pages()[0];

    if (!page) {
      return { content: "" };
    }

    await page.goto(url);

    console.log(`🧡 Navigated to ${url}`);

    let currentPage = extractPageNumber(url) ?? 1;

    let scrollAttempts = 0;
    const maxScrollAttempts = 50;

    while (currentPage !== pages && scrollAttempts < maxScrollAttempts) {
      await page.evaluate("window.scrollTo(0, document.body.scrollHeight)");
      await page.waitForTimeout(500);

      const currentUrl = page.url();
      currentPage = extractPageNumber(currentUrl) ?? 1;

      console.log(
        `📍 Intento ${scrollAttempts + 1}: Página actual = ${currentPage}, Página destino = ${pages}`,
      );

      scrollAttempts++;
    }

    const contentPage = await stagehand.extract(
      `Extract the post content from the page in markdown format. It can have ${pages} parts o until data-page-number="${pages}".`,
      {
        model: {
          modelName: "ollama/qwen3:8b",
        },
        // selector: "div.row.part-content",
        selector: `//*[@id="sticky-end"]/div`,
      },
    );

    await stagehand.close();

    if (!contentPage.extraction) {
      console.log("🔴 Content not found");
      return { content: "" };
    }

    const extraction = contentPage.extraction;
    const lines = extraction.split("\n");

    // Get first 5 and last 5 lines
    const firstLines = lines.slice(0, 5).join("\n");
    const lastLines = lines.slice(-5).join("\n");

    console.log("First 5 lines of extraction:");
    console.log(firstLines);

    console.log("\n\nLast 5 lines of extraction:");
    console.log(lastLines);

    return { content: extraction };
  } catch (error) {
    console.error("🔴 Error in getContentPage 🔴:", error);
    return { content: "" };
  }
}
