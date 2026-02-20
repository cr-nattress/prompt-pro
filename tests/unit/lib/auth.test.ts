import { beforeEach, describe, expect, it, vi } from "vitest";

const mockCurrentUser = vi.fn();
const mockAuth = vi.fn();

vi.mock("@clerk/nextjs/server", () => ({
	currentUser: (...args: unknown[]) => mockCurrentUser(...args),
	auth: (...args: unknown[]) => mockAuth(...args),
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
	});

	it("returns null when unauthenticated", async () => {
		mockCurrentUser.mockResolvedValue(null);
		const { getCurrentUser } = await import("@/lib/auth");
		const user = await getCurrentUser();
		expect(user).toBeNull();
	});

	it("returns mapped AuthUser when authenticated", async () => {
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
});

describe("getCurrentWorkspace", () => {
	beforeEach(() => {
		vi.resetModules();
		mockCurrentUser.mockReset();
		mockAuth.mockReset();
	});

	it("returns null when unauthenticated", async () => {
		mockCurrentUser.mockResolvedValue(null);
		const { getCurrentWorkspace } = await import("@/lib/auth");
		const workspace = await getCurrentWorkspace();
		expect(workspace).toBeNull();
	});

	it("returns stub workspace with correct slug and name", async () => {
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
});

describe("requireAuth", () => {
	beforeEach(() => {
		vi.resetModules();
		mockCurrentUser.mockReset();
		mockAuth.mockReset();
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
