import { Stagehand } from "@browserbasehq/stagehand";

export async function getContentPage(url: string, pages: number) {
  try {
    console.log("👋👋👋 Reset mastra tool 👋👋👋");
    const stagehand = new Stagehand({
      env: "LOCAL",
      model: {
        // modelName: "google/gemini-2.0-flash",
        // apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
        modelName: "ollama/qwen3:14b",
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

    for (let i = 0; i < pages; i += 3) {
      await stagehand.act("scroll to bottom of the page");
    }

    const contentPage = await stagehand.extract(
      `Extract the post content from the page in markdown format. It can have ${pages} parts o until data-page-number="${pages}".`,
      {
        model: {
          modelName: "ollama/qwen3:8b",
          // modelName: "ollama/qwen3:14b",
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
