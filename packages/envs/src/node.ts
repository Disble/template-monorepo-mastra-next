import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    DATABASE_URL: z.url(),
    GOOGLE_GENERATIVE_AI_API_KEY: z.string().min(1).optional(),
    LMSTUDIO_API_KEY: z.string().min(1).optional(),
    NODE_ENV: z.enum(["development", "production"]).optional(),
  },
  client: {},
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    GOOGLE_GENERATIVE_AI_API_KEY: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
    LMSTUDIO_API_KEY: process.env.LMSTUDIO_API_KEY,
    NODE_ENV: process.env.NODE_ENV,
  },
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  emptyStringAsUndefined: true,
});
