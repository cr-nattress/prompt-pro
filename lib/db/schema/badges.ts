import { jsonb, text, timestamp, unique, uuid } from "drizzle-orm/pg-core";
import { promptSchema } from "./enums";
import { users } from "./users";

export const badges = promptSchema.table(
	"badges",
	{
		id: uuid().defaultRandom().primaryKey(),
		userId: uuid("user_id")
			.notNull()
			.references(() => users.id),
		badgeType: text("badge_type").notNull(),
		badgeSlug: text("badge_slug").notNull(),
		metadata: jsonb(),
		earnedAt: timestamp("earned_at", { withTimezone: true })
			.defaultNow()
			.notNull(),
	},
	(t) => [unique("badges_user_badge_unique").on(t.userId, t.badgeSlug)],
);

export type Badge = typeof badges.$inferSelect;
export type NewBadge = typeof badges.$inferInsert;
