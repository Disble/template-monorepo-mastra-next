import { Mastra } from "@mastra/core/mastra";
import { PinoLogger } from "@mastra/loggers";
import { PostgresStore } from "@mastra/pg";
import { env } from "@repo/envs/node";
import {
  characterDepthAnalyzerAgent,
  continuityErrorDetectorAgent,
  emotionalResonanceAnalyzerAgent,
  narrativeStructureAnalyzerAgent,
  openingHookAnalyzerAgent,
  proseDisciplineAnalyzerAgent,
  youtubeVideoChaptersAgent,
} from "./agents";
import { weatherAgent } from "./agents/weather-agent";
import { VECTOR_STORE } from "./constants/memory.constant";
import { disbleMcpServer } from "./mcp/claude-mcp";
import { pgVector } from "./memory/vector";
import { getContentPageTool } from "./tools/get-content-page/get-content-page-tool";
import { chaptersVideosWorkflow } from "./workflows/chapters-videos-workflow";
import { wattpadChapterDownloadWorkflow } from "./workflows/download-wattpad-chapters-workflow";

export const mastra = new Mastra({
  agents: {
    weatherAgent,
    youtubeVideoChaptersAgent,
    openingHookAnalyzerAgent,
    narrativeStructureAnalyzerAgent,
    continuityErrorDetectorAgent,
    emotionalResonanceAnalyzerAgent,
    characterDepthAnalyzerAgent,
    proseDisciplineAnalyzerAgent,
  },
  mcpServers: {
    disbleMcpServer,
  },
  workflows: {
    chaptersVideosWorkflow,
    wattpadChapterDownloadWorkflow,
  },
  storage: new PostgresStore({
    id: "mastra_pg_store",
    connectionString: env.DATABASE_URL,
  }),
  vectors: {
    [VECTOR_STORE.VECTOR_NAME]: pgVector,
  },
  logger: new PinoLogger({
    name: "Mastra",
    level: "info",
  }),
  tools: {
    getContentPageTool,
  },
  bundler: {
    sourcemap: true,
    externals: true,
  },
});
