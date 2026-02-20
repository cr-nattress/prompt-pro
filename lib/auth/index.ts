import { auth, currentUser } from "@clerk/nextjs/server";
import type { AuthContext, AuthUser, Workspace } from "@/types/auth";

/**
 * Get the current authenticated user mapped to our AuthUser type.
 * Returns `null` if unauthenticated.
 *
 * TODO: Epic 03 — Enrich with database user record.
 */
export async function getCurrentUser(): Promise<AuthUser | null> {
	const clerkUser = await currentUser();
	if (!clerkUser) return null;

	const email = clerkUser.emailAddresses[0]?.emailAddress ?? "";

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
		createdAt: new Date(clerkUser.createdAt),
	};
}

/**
 * Get the current user's workspace.
 * Returns a stub workspace derived from Clerk user data.
 *
 * TODO: Epic 03 — Replace with database workspace query.
 */
export async function getCurrentWorkspace(): Promise<Workspace | null> {
	const user = await getCurrentUser();
	if (!user) return null;

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
