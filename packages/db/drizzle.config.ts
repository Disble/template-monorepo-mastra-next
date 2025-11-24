import { env } from "@repo/envs/node";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/schema",
  dialect: "postgresql",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
});
