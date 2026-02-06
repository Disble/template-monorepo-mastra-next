import { eq } from "drizzle-orm";
import type { DbClient } from "../client";
import { user } from "../schema/users";

export const findUserById = async (db: DbClient, id: string) => {
  return db.query.user.findFirst({
    where: eq(user.id, id),
  });
};

export const createUser = async (
  db: DbClient,
  newUser: typeof user.$inferInsert,
) => {
  return db.insert(user).values(newUser).returning();
};
