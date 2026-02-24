/**
 * Authentication and workspace types.
 *
 * These types represent the auth contract used across the app.
 * Currently backed by Clerk-only data; will be enriched with
 * database fields in Epic 03.
 */

export interface AuthUser {
	id: string;
	clerkId: string;
	email: string;
	name: string;
	firstName: string;
	lastName: string;
	imageUrl: string;
	dismissedLessons: string[];
	onboardingComplete: boolean;
	leaderboardOptIn: boolean;
	createdAt: Date;
}

export type WorkspacePlan = "free" | "pro" | "team";

export interface Workspace {
	id: string;
	slug: string;
	name: string;
	ownerId: string;
	plan: WorkspacePlan;
	createdAt: Date;
}

export type WorkspaceRole = "admin" | "editor" | "viewer";

export interface AuthContext {
	user: AuthUser;
	workspace: Workspace;
	role: WorkspaceRole;
}
