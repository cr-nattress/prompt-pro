import { beforeEach, describe, expect, it, vi } from "vitest";

const mockSelect = vi.fn();
const mockInsert = vi.fn();
const mockUpdate = vi.fn();

const mockFrom = vi.fn();
const mockWhere = vi.fn();
const mockLimit = vi.fn();
const mockValues = vi.fn();
const mockSet = vi.fn();
const mockReturning = vi.fn();

mockSelect.mockReturnValue({ from: mockFrom });
mockFrom.mockReturnValue({ where: mockWhere });
mockWhere.mockReturnValue({ limit: mockLimit, returning: mockReturning });
mockLimit.mockReturnValue([]);
mockInsert.mockReturnValue({ values: mockValues });
mockValues.mockReturnValue({ returning: mockReturning });
mockUpdate.mockReturnValue({ set: mockSet });
mockSet.mockReturnValue({ where: mockWhere });

vi.mock("@/lib/db", () => ({
	db: {
		select: (...args: unknown[]) => mockSelect(...args),
		insert: (...args: unknown[]) => mockInsert(...args),
		update: (...args: unknown[]) => mockUpdate(...args),
	},
}));

vi.mock("@/lib/db/schema", () => ({
	workspaces: {
		id: "id",
		slug: "slug",
		name: "name",
		ownerId: "owner_id",
		plan: "plan",
		createdAt: "created_at",
		updatedAt: "updated_at",
	},
}));

const mockWorkspace = {
	id: "ws-uuid-123",
	slug: "jane-workspace",
	name: "Jane's Workspace",
	ownerId: "user-uuid-123",
	plan: "free",
	createdAt: new Date("2024-01-01"),
	updatedAt: new Date("2024-01-01"),
};

describe("getWorkspaceBySlug", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockSelect.mockReturnValue({ from: mockFrom });
		mockFrom.mockReturnValue({ where: mockWhere });
		mockWhere.mockReturnValue({ limit: mockLimit });
	});

	it("returns workspace when found", async () => {
		mockLimit.mockResolvedValue([mockWorkspace]);

		const { getWorkspaceBySlug } = await import("@/lib/db/queries/workspaces");
		const result = await getWorkspaceBySlug("jane-workspace");

		expect(result).toEqual(mockWorkspace);
		expect(mockSelect).toHaveBeenCalled();
	});

	it("returns null when not found", async () => {
		mockLimit.mockResolvedValue([]);

		const { getWorkspaceBySlug } = await import("@/lib/db/queries/workspaces");
		const result = await getWorkspaceBySlug("nonexistent");

		expect(result).toBeNull();
	});
});

describe("getWorkspacesByUserId", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockSelect.mockReturnValue({ from: mockFrom });
		mockFrom.mockReturnValue({ where: mockWhere });
	});

	it("returns workspaces for user", async () => {
		mockWhere.mockResolvedValue([mockWorkspace]);

		const { getWorkspacesByUserId } = await import(
			"@/lib/db/queries/workspaces"
		);
		const result = await getWorkspacesByUserId("user-uuid-123");

		expect(result).toEqual([mockWorkspace]);
	});

	it("returns empty array when no workspaces", async () => {
		mockWhere.mockResolvedValue([]);

		const { getWorkspacesByUserId } = await import(
			"@/lib/db/queries/workspaces"
		);
		const result = await getWorkspacesByUserId("user-with-no-ws");

		expect(result).toEqual([]);
	});
});

describe("createWorkspace", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockInsert.mockReturnValue({ values: mockValues });
		mockValues.mockReturnValue({ returning: mockReturning });
	});

	it("inserts and returns the new workspace", async () => {
		mockReturning.mockResolvedValue([mockWorkspace]);

		const { createWorkspace } = await import("@/lib/db/queries/workspaces");
		const result = await createWorkspace({
			slug: "jane-workspace",
			name: "Jane's Workspace",
			ownerId: "user-uuid-123",
		});

		expect(result).toEqual(mockWorkspace);
		expect(mockInsert).toHaveBeenCalled();
	});
});

describe("updateWorkspace", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockUpdate.mockReturnValue({ set: mockSet });
		mockSet.mockReturnValue({ where: mockWhere });
		mockWhere.mockReturnValue({ returning: mockReturning });
	});

	it("updates and returns the workspace", async () => {
		mockReturning.mockResolvedValue([
			{ ...mockWorkspace, name: "Updated Workspace" },
		]);

		const { updateWorkspace } = await import("@/lib/db/queries/workspaces");
		const result = await updateWorkspace("ws-uuid-123", {
			name: "Updated Workspace",
		});

		expect(result?.name).toBe("Updated Workspace");
		expect(mockUpdate).toHaveBeenCalled();
	});

	it("returns null when workspace not found", async () => {
		mockReturning.mockResolvedValue([]);

		const { updateWorkspace } = await import("@/lib/db/queries/workspaces");
		const result = await updateWorkspace("nonexistent", { name: "Nope" });

		expect(result).toBeNull();
	});
});
