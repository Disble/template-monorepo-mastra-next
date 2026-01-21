import { Mastra } from "@mastra/core/mastra";
import { PinoLogger } from "@mastra/loggers";
import { PostgresStore } from "@mastra/pg";
import { env } from "@repo/envs/node";
import { youtubeVideoChaptersAgent } from "./agents";
import { weatherAgent } from "./agents/weather-agent";
import { VECTOR_STORE } from "./constants/memory.constant";
import { pgVector } from "./memory/vector";
import { chaptersVideosWorkflow } from "./workflows/chapters-videos-workflow";

export const mastra = new Mastra({
  agents: { weatherAgent, youtubeVideoChaptersAgent },
  workflows: {
    chaptersVideosWorkflow,
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
  bundler: {
    sourcemap: true,
  },
});
