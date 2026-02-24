import { text, timestamp, uuid } from "drizzle-orm/pg-core";
import { promptSchema } from "./enums";
import { users } from "./users";

export const learningProgress = promptSchema.table("learning_progress", {
	id: uuid().defaultRandom().primaryKey(),
	userId: uuid("user_id")
		.notNull()
		.references(() => users.id),
	pathSlug: text("path_slug").notNull(),
	lessonSlug: text("lesson_slug").notNull(),
	completedAt: timestamp("completed_at", { withTimezone: true })
		.defaultNow()
		.notNull(),
});

export type LearningProgress = typeof learningProgress.$inferSelect;
export type NewLearningProgress = typeof learningProgress.$inferInsert;
