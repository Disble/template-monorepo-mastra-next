import { PgVector } from "@mastra/pg";

export const pgVector = new PgVector({
  id: "mastra-pg-vector",
  connectionString: process.env.DATABASE_URL,
});
