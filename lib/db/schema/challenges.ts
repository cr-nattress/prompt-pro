import { index, integer, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { promptSchema } from "./enums";
import { users } from "./users";

export const challengeSubmissions = promptSchema.table(
	"challenge_submissions",
	{
		id: uuid().defaultRandom().primaryKey(),
		userId: uuid("user_id")
			.notNull()
			.references(() => users.id),
		challengeSlug: text("challenge_slug").notNull(),
		promptText: text("prompt_text").notNull(),
		score: integer(),
		strengths: text().array(),
		gaps: text().array(),
		feedback: text(),
		submittedAt: timestamp("submitted_at", { withTimezone: true })
			.defaultNow()
			.notNull(),
	},
	(table) => [
		index("challenge_submissions_user_id_idx").on(table.userId),
		index("challenge_submissions_challenge_slug_idx").on(table.challengeSlug),
	],
);

export type ChallengeSubmission = typeof challengeSubmissions.$inferSelect;
export type NewChallengeSubmission = typeof challengeSubmissions.$inferInsert;
