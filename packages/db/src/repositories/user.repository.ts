import { eq } from "drizzle-orm";
import type { DbClient } from "../client";
import { users } from "../schema/users";

export const findUserById = async (db: DbClient, id: number) => {
  return db.query.users.findFirst({
    where: eq(users.id, id),
  });
};

export const createUser = async (
  db: DbClient,
  newUser: typeof users.$inferInsert,
) => {
  return db.insert(users).values(newUser).returning();
};
