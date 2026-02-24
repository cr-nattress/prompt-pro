import { boolean, jsonb, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { planEnum, promptSchema } from "./enums";

export const users = promptSchema.table("users", {
	id: uuid().defaultRandom().primaryKey(),
	clerkId: text("clerk_id").notNull().unique(),
	email: text().notNull().unique(),
	name: text().notNull(),
	firstName: text("first_name"),
	lastName: text("last_name"),
	imageUrl: text("image_url"),
	plan: planEnum().default("free").notNull(),
	skillProfile: jsonb("skill_profile"),
	dismissedLessons: text("dismissed_lessons").array().default([]).notNull(),
	leaderboardOptIn: boolean("leaderboard_opt_in").default(false).notNull(),
	onboardingComplete: boolean("onboarding_complete").default(false).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true })
		.defaultNow()
		.notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true })
		.defaultNow()
		.notNull()
		.$onUpdate(() => new Date()),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
