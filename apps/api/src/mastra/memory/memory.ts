import { Memory } from "@mastra/memory";
import { PostgresStore } from "@mastra/pg";
import { env } from "@repo/envs/node";
import embedder from "./embedding";
import { pgVector } from "./vector";

export const memory = new Memory({
  storage: new PostgresStore({
    id: "mastra_memory_store",
    connectionString: env.DATABASE_URL,
  }),
  vector: pgVector,
  embedder,
  options: {
    lastMessages: 10,
    semanticRecall: {
      topK: 3,
      messageRange: 2,
    },
  },
});
