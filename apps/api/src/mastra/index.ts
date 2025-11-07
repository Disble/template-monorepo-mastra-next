import { Mastra } from "@mastra/core/mastra";
import { PinoLogger } from "@mastra/loggers";
import { PostgresStore } from "@mastra/pg";
import { youtubeVideoChaptersAgent } from "./agents";
import { weatherAgent } from "./agents/weather-agent";
import { VECTOR_STORE } from "./constants/memory.constant";
import { pgVector } from "./memory/vector";
import { chaptersVideosWorkflow } from "./workflows/chapters-videos-workflow";

export const mastra = new Mastra({
  observability: {
    default: { enabled: true }, // Enables DefaultExporter and CloudExporter
  },
  agents: { weatherAgent, youtubeVideoChaptersAgent },
  workflows: {
    chaptersVideosWorkflow,
  },
  storage: new PostgresStore({
    connectionString: process.env.DATABASE_URL,
  }),
  vectors: {
    [VECTOR_STORE.VECTOR_NAME]: pgVector,
  },
  logger: new PinoLogger({
    name: "Mastra",
    level: "info",
  }),
  bundler: {
    sourcemap: true,
  },
});
