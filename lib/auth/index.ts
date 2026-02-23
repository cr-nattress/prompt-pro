import { auth, currentUser } from "@clerk/nextjs/server";
import { getUserByClerkId } from "@/lib/db/queries/users";
import { getWorkspacesByUserId } from "@/lib/db/queries/workspaces";
import type { AuthContext, AuthUser, Workspace } from "@/types/auth";

const MOCK_USER: AuthUser = {
	id: "00000000-0000-0000-0000-000000000001",
	clerkId: "dev_clerk_001",
	email: "dev@localhost",
	name: "Dev User",
	firstName: "Dev",
	lastName: "User",
	imageUrl: "",
	dismissedLessons: [],
	onboardingComplete: true,
	createdAt: new Date("2025-01-01"),
};

const MOCK_WORKSPACE: Workspace = {
	id: "00000000-0000-0000-0000-000000000010",
	slug: "dev",
	name: "Dev Workspace",
	ownerId: "00000000-0000-0000-0000-000000000001",
	plan: "free",
	createdAt: new Date("2025-01-01"),
};

/**
 * Get the current authenticated user mapped to our AuthUser type.
 * Returns `null` if unauthenticated.
 *
 * Enriches with database user record when available,
 * falls back to Clerk-only data otherwise.
 */
export async function getCurrentUser(): Promise<AuthUser | null> {
	const clerkUser = await currentUser();
	if (!clerkUser) return null;

	const email = clerkUser.emailAddresses[0]?.emailAddress ?? "";

	// Try to enrich with DB record
	try {
		const dbUser = await getUserByClerkId(clerkUser.id);
		if (dbUser) {
			return {
				id: dbUser.id,
				clerkId: dbUser.clerkId,
				email: dbUser.email,
				name: dbUser.name,
				firstName: dbUser.firstName ?? "",
				lastName: dbUser.lastName ?? "",
				imageUrl: dbUser.imageUrl ?? "",
				dismissedLessons: dbUser.dismissedLessons,
				onboardingComplete: dbUser.onboardingComplete,
				createdAt: dbUser.createdAt,
			};
		}
	} catch {
		// DB unavailable — fall back to Clerk-only data
	}

	return {
		id: clerkUser.id,
		clerkId: clerkUser.id,
		email,
		name:
			[clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ") ||
			email,
		firstName: clerkUser.firstName ?? "",
		lastName: clerkUser.lastName ?? "",
		imageUrl: clerkUser.imageUrl,
		dismissedLessons: [],
		onboardingComplete: false,
		createdAt: new Date(clerkUser.createdAt),
	};
}

/**
 * Get the current user's workspace.
 * Queries the database for workspaces, falls back to stub if none found.
 */
export async function getCurrentWorkspace(): Promise<Workspace | null> {
	const user = await getCurrentUser();
	if (!user) return null;

	// Try to get workspace from DB
	try {
		const workspaces = await getWorkspacesByUserId(user.id);
		const workspace = workspaces[0];
		if (workspace) {
			return {
				id: workspace.id,
				slug: workspace.slug,
				name: workspace.name,
				ownerId: workspace.ownerId,
				plan: workspace.plan,
				createdAt: workspace.createdAt,
			};
		}
	} catch {
		// DB unavailable — fall back to stub
	}

	// Stub workspace when DB is empty or unavailable
	const slug = user.email.split("@")[0] ?? "default";

	return {
		id: `ws_${user.clerkId}`,
		slug,
		name: user.firstName ? `${user.firstName}'s Workspace` : "My Workspace",
		ownerId: user.id,
		plan: "free",
		createdAt: user.createdAt,
	};
}

/**
 * Require authentication. Redirects to sign-in if unauthenticated.
 * Returns the full AuthContext (user + workspace).
 *
 * Use in Server Components, Server Actions, and Route Handlers.
 */
export async function requireAuth(): Promise<AuthContext> {
	if (process.env.BYPASS_AUTH === "true") {
		return { user: MOCK_USER, workspace: MOCK_WORKSPACE };
	}

	const { userId, redirectToSignIn } = await auth();

	if (!userId) {
		redirectToSignIn();
	}

	const user = await getCurrentUser();
	if (!user) {
		redirectToSignIn();
	}

	// At this point user is guaranteed non-null (redirectToSignIn throws)
	const workspace = await getCurrentWorkspace();

	return {
		user: user as AuthUser,
		workspace: workspace as Workspace,
	};
}
