import { beforeEach, describe, expect, it, vi } from "vitest";

const mockCurrentUser = vi.fn();
const mockAuth = vi.fn();
const mockGetUserByClerkId = vi.fn();
const mockGetWorkspacesByUserId = vi.fn();

vi.mock("@clerk/nextjs/server", () => ({
	currentUser: (...args: unknown[]) => mockCurrentUser(...args),
	auth: (...args: unknown[]) => mockAuth(...args),
}));

vi.mock("@/lib/db/queries/users", () => ({
	getUserByClerkId: (...args: unknown[]) => mockGetUserByClerkId(...args),
}));

vi.mock("@/lib/db/queries/workspaces", () => ({
	getWorkspacesByUserId: (...args: unknown[]) =>
		mockGetWorkspacesByUserId(...args),
}));

const clerkUserFixture = {
	id: "user_abc123",
	emailAddresses: [{ emailAddress: "jane@example.com" }],
	firstName: "Jane",
	lastName: "Doe",
	imageUrl: "https://img.clerk.com/jane.jpg",
	createdAt: 1700000000000,
};

describe("getCurrentUser", () => {
	beforeEach(() => {
		vi.resetModules();
		mockCurrentUser.mockReset();
		mockAuth.mockReset();
		mockGetUserByClerkId.mockReset();
		mockGetWorkspacesByUserId.mockReset();
		// Default: DB returns null (no user found)
		mockGetUserByClerkId.mockResolvedValue(null);
	});

	it("returns null when unauthenticated", async () => {
		mockCurrentUser.mockResolvedValue(null);
		const { getCurrentUser } = await import("@/lib/auth");
		const user = await getCurrentUser();
		expect(user).toBeNull();
	});

	it("returns mapped AuthUser when authenticated (Clerk fallback)", async () => {
		mockCurrentUser.mockResolvedValue(clerkUserFixture);
		const { getCurrentUser } = await import("@/lib/auth");
		const user = await getCurrentUser();

		expect(user).toEqual({
			id: "user_abc123",
			clerkId: "user_abc123",
			email: "jane@example.com",
			name: "Jane Doe",
			firstName: "Jane",
			lastName: "Doe",
			imageUrl: "https://img.clerk.com/jane.jpg",
			createdAt: new Date(1700000000000),
		});
	});

	it("returns DB-enriched user when DB record exists", async () => {
		mockCurrentUser.mockResolvedValue(clerkUserFixture);
		mockGetUserByClerkId.mockResolvedValue({
			id: "db-uuid-123",
			clerkId: "user_abc123",
			email: "jane@example.com",
			name: "Jane Doe",
			firstName: "Jane",
			lastName: "Doe",
			imageUrl: "https://img.clerk.com/jane.jpg",
			createdAt: new Date("2024-01-01"),
		});

		const { getCurrentUser } = await import("@/lib/auth");
		const user = await getCurrentUser();

		expect(user?.id).toBe("db-uuid-123");
		expect(user?.clerkId).toBe("user_abc123");
	});

	it("falls back to email for name when firstName/lastName are null", async () => {
		mockCurrentUser.mockResolvedValue({
			...clerkUserFixture,
			firstName: null,
			lastName: null,
		});
		const { getCurrentUser } = await import("@/lib/auth");
		const user = await getCurrentUser();
		expect(user?.name).toBe("jane@example.com");
	});

	it("falls back to Clerk data when DB throws", async () => {
		mockCurrentUser.mockResolvedValue(clerkUserFixture);
		mockGetUserByClerkId.mockRejectedValue(new Error("DB unavailable"));

		const { getCurrentUser } = await import("@/lib/auth");
		const user = await getCurrentUser();

		expect(user?.id).toBe("user_abc123");
		expect(user?.name).toBe("Jane Doe");
	});
});

describe("getCurrentWorkspace", () => {
	beforeEach(() => {
		vi.resetModules();
		mockCurrentUser.mockReset();
		mockAuth.mockReset();
		mockGetUserByClerkId.mockReset();
		mockGetWorkspacesByUserId.mockReset();
		mockGetUserByClerkId.mockResolvedValue(null);
		mockGetWorkspacesByUserId.mockResolvedValue([]);
	});

	it("returns null when unauthenticated", async () => {
		mockCurrentUser.mockResolvedValue(null);
		const { getCurrentWorkspace } = await import("@/lib/auth");
		const workspace = await getCurrentWorkspace();
		expect(workspace).toBeNull();
	});

	it("returns stub workspace when DB has no workspaces", async () => {
		mockCurrentUser.mockResolvedValue(clerkUserFixture);
		const { getCurrentWorkspace } = await import("@/lib/auth");
		const workspace = await getCurrentWorkspace();

		expect(workspace).toEqual({
			id: "ws_user_abc123",
			slug: "jane",
			name: "Jane's Workspace",
			ownerId: "user_abc123",
			plan: "free",
			createdAt: new Date(1700000000000),
		});
	});

	it("returns DB workspace when available", async () => {
		mockCurrentUser.mockResolvedValue(clerkUserFixture);
		mockGetWorkspacesByUserId.mockResolvedValue([
			{
				id: "ws-db-uuid",
				slug: "jane-workspace",
				name: "Jane's Workspace",
				ownerId: "user_abc123",
				plan: "pro",
				createdAt: new Date("2024-01-01"),
			},
		]);

		const { getCurrentWorkspace } = await import("@/lib/auth");
		const workspace = await getCurrentWorkspace();

		expect(workspace?.id).toBe("ws-db-uuid");
		expect(workspace?.plan).toBe("pro");
	});
});

describe("requireAuth", () => {
	beforeEach(() => {
		vi.resetModules();
		mockCurrentUser.mockReset();
		mockAuth.mockReset();
		mockGetUserByClerkId.mockReset();
		mockGetWorkspacesByUserId.mockReset();
		mockGetUserByClerkId.mockResolvedValue(null);
		mockGetWorkspacesByUserId.mockResolvedValue([]);
	});

	it("calls redirectToSignIn when unauthenticated", async () => {
		const mockRedirect = vi.fn(() => {
			throw new Error("REDIRECT");
		});
		mockAuth.mockResolvedValue({
			userId: null,
			redirectToSignIn: mockRedirect,
		});

		const { requireAuth } = await import("@/lib/auth");

		await expect(requireAuth()).rejects.toThrow("REDIRECT");
		expect(mockRedirect).toHaveBeenCalled();
	});

	it("returns AuthContext when authenticated", async () => {
		mockAuth.mockResolvedValue({
			userId: "user_abc123",
			redirectToSignIn: vi.fn(),
		});
		mockCurrentUser.mockResolvedValue(clerkUserFixture);

		const { requireAuth } = await import("@/lib/auth");
		const ctx = await requireAuth();

		expect(ctx.user.clerkId).toBe("user_abc123");
		expect(ctx.workspace.slug).toBe("jane");
		expect(ctx.workspace.plan).toBe("free");
	});
});
