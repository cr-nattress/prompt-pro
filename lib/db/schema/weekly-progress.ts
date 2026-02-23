import { date, integer, jsonb, timestamp, uuid } from "drizzle-orm/pg-core";
import { promptSchema } from "./enums";
import { users } from "./users";

export const weeklyProgress = promptSchema.table("weekly_progress", {
	id: uuid().defaultRandom().primaryKey(),
	userId: uuid("user_id")
		.notNull()
		.references(() => users.id),
	weekStart: date("week_start").notNull(),
	skillProfile: jsonb("skill_profile").notNull(),
	promptsCreated: integer("prompts_created").default(0).notNull(),
	promptsEdited: integer("prompts_edited").default(0).notNull(),
	analysesRun: integer("analyses_run").default(0).notNull(),
	promptsImproved: integer("prompts_improved").default(0).notNull(),
	averageScore: integer("average_score").default(0).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true })
		.defaultNow()
		.notNull(),
});

export type WeeklyProgress = typeof weeklyProgress.$inferSelect;
export type NewWeeklyProgress = typeof weeklyProgress.$inferInsert;
