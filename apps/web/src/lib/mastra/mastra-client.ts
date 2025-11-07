import { MastraClient } from "@mastra/client-js";
import { env } from "#env";

export const mastraClient = new MastraClient({
  baseUrl: env.NEXT_PUBLIC_MASTRA_BASE_URL,
});
