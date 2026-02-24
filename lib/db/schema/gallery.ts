import { sql } from "drizzle-orm";
import {
	boolean,
	check,
	index,
	integer,
	numeric,
	text,
	timestamp,
	uniqueIndex,
	uuid,
} from "drizzle-orm/pg-core";
import { galleryCategoryEnum, promptSchema } from "./enums";
import { promptTemplates } from "./prompts";
import { users } from "./users";
import { workspaces } from "./workspaces";

export const galleryListings = promptSchema.table(
	"gallery_listings",
	{
		id: uuid().defaultRandom().primaryKey(),
		promptTemplateId: uuid("prompt_template_id")
			.notNull()
			.references(() => promptTemplates.id, { onDelete: "cascade" })
			.unique(),
		workspaceId: uuid("workspace_id")
			.notNull()
			.references(() => workspaces.id),
		authorId: uuid("author_id")
			.notNull()
			.references(() => users.id),
		category: galleryCategoryEnum().notNull(),
		description: text().notNull(),
		authorName: text("author_name").notNull(),
		isAnonymous: boolean("is_anonymous").default(false).notNull(),
		forkCount: integer("fork_count").default(0).notNull(),
		avgRating: numeric("avg_rating", { precision: 3, scale: 2 })
			.default("0")
			.notNull(),
		ratingCount: integer("rating_count").default(0).notNull(),
		publishedAt: timestamp("published_at", { withTimezone: true })
			.defaultNow()
			.notNull(),
		updatedAt: timestamp("updated_at", { withTimezone: true })
			.defaultNow()
			.notNull()
			.$onUpdate(() => new Date()),
	},
	(table) => [
		index("gallery_listings_category_idx").on(table.category),
		index("gallery_listings_published_at_idx").on(table.publishedAt),
		index("gallery_listings_avg_rating_idx").on(table.avgRating),
		index("gallery_listings_fork_count_idx").on(table.forkCount),
	],
);

export const galleryRatings = promptSchema.table(
	"gallery_ratings",
	{
		id: uuid().defaultRandom().primaryKey(),
		listingId: uuid("listing_id")
			.notNull()
			.references(() => galleryListings.id, { onDelete: "cascade" }),
		userId: uuid("user_id")
			.notNull()
			.references(() => users.id),
		rating: integer().notNull(),
		createdAt: timestamp("created_at", { withTimezone: true })
			.defaultNow()
			.notNull(),
		updatedAt: timestamp("updated_at", { withTimezone: true })
			.defaultNow()
			.notNull()
			.$onUpdate(() => new Date()),
	},
	(table) => [
		uniqueIndex("gallery_ratings_listing_user_unique").on(
			table.listingId,
			table.userId,
		),
		check(
			"gallery_ratings_rating_check",
			sql`${table.rating} >= 1 AND ${table.rating} <= 5`,
		),
	],
);

export type GalleryListing = typeof galleryListings.$inferSelect;
export type NewGalleryListing = typeof galleryListings.$inferInsert;
export type GalleryRating = typeof galleryRatings.$inferSelect;
export type NewGalleryRating = typeof galleryRatings.$inferInsert;
