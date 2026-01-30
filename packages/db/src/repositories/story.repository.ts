import { eq } from "drizzle-orm";
import type { DbClient } from "../client";
import { stories } from "../schema/stories";

export const findStoryById = async (db: DbClient, id: number) => {
  return db.query.stories.findFirst({
    where: eq(stories.id, id),
  });
};

export const findStoryByUrl = async (db: DbClient, url: string) => {
  return db.query.stories.findFirst({
    where: eq(stories.url, url),
  });
};

export const createStory = async (
  db: DbClient,
  newStory: typeof stories.$inferInsert,
) => {
  return db.insert(stories).values(newStory).returning();
};

export const updateStory = async (
  db: DbClient,
  id: number,
  data: Partial<Omit<typeof stories.$inferInsert, "id">>,
) => {
  return db
    .update(stories)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(stories.id, id))
    .returning();
};

export const deleteStory = async (db: DbClient, id: number) => {
  return db.delete(stories).where(eq(stories.id, id)).returning();
};
