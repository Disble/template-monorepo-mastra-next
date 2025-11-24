import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    NODE_ENV: z.enum(["development", "production"]),
  },
  client: {
    NEXT_PUBLIC_MASTRA_BASE_URL: z.string().min(1),
  },
  runtimeEnv: {
    NEXT_PUBLIC_MASTRA_BASE_URL: process.env.NEXT_PUBLIC_MASTRA_BASE_URL,
    NODE_ENV: process.env.NODE_ENV,
  },
});
