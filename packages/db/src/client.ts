import { env } from "@repo/envs/node";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

export const createDbClient = (connectionString: string) => {
  const pool = new Pool({
    connectionString,
  });
  return drizzle(pool, { schema });
};

export type DbClient = ReturnType<typeof createDbClient>;

// Export a singleton db instance
export const db = createDbClient(env.DATABASE_URL);
