import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const stories = pgTable("stories", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  text: text("text").notNull(),
  authorName: text("author_name").notNull(),
  url: text("url").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
