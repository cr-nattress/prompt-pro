import { beforeEach, describe, expect, it, vi } from "vitest";

const mockSelect = vi.fn();
const mockInsert = vi.fn();
const mockUpdate = vi.fn();
const mockDelete = vi.fn();

const mockFrom = vi.fn();
const mockWhere = vi.fn();
const mockLimit = vi.fn();
const mockValues = vi.fn();
const mockSet = vi.fn();
const mockReturning = vi.fn();

// Chain mock setup
mockSelect.mockReturnValue({ from: mockFrom });
mockFrom.mockReturnValue({ where: mockWhere });
mockWhere.mockReturnValue({ limit: mockLimit, returning: mockReturning });
mockLimit.mockReturnValue([]);
mockInsert.mockReturnValue({ values: mockValues });
mockValues.mockReturnValue({ returning: mockReturning });
mockUpdate.mockReturnValue({ set: mockSet });
mockSet.mockReturnValue({ where: mockWhere });
mockDelete.mockReturnValue({ where: mockWhere });

vi.mock("@/lib/db", () => ({
	db: {
		select: (...args: unknown[]) => mockSelect(...args),
		insert: (...args: unknown[]) => mockInsert(...args),
		update: (...args: unknown[]) => mockUpdate(...args),
		delete: (...args: unknown[]) => mockDelete(...args),
	},
}));

vi.mock("@/lib/db/schema", () => ({
	users: {
		id: "id",
		clerkId: "clerk_id",
		email: "email",
		name: "name",
		firstName: "first_name",
		lastName: "last_name",
		imageUrl: "image_url",
		plan: "plan",
		skillProfile: "skill_profile",
		createdAt: "created_at",
		updatedAt: "updated_at",
	},
}));

const mockUser = {
	id: "uuid-123",
	clerkId: "clerk_abc",
	email: "jane@example.com",
	name: "Jane Doe",
	firstName: "Jane",
	lastName: "Doe",
	imageUrl: "https://img.clerk.com/jane.jpg",
	plan: "free",
	skillProfile: null,
	createdAt: new Date("2024-01-01"),
	updatedAt: new Date("2024-01-01"),
};

describe("getUserByClerkId", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockSelect.mockReturnValue({ from: mockFrom });
		mockFrom.mockReturnValue({ where: mockWhere });
		mockWhere.mockReturnValue({ limit: mockLimit });
	});

	it("returns user when found", async () => {
		mockLimit.mockResolvedValue([mockUser]);

		const { getUserByClerkId } = await import("@/lib/db/queries/users");
		const result = await getUserByClerkId("clerk_abc");

		expect(result).toEqual(mockUser);
		expect(mockSelect).toHaveBeenCalled();
	});

	it("returns null when not found", async () => {
		mockLimit.mockResolvedValue([]);

		const { getUserByClerkId } = await import("@/lib/db/queries/users");
		const result = await getUserByClerkId("nonexistent");

		expect(result).toBeNull();
	});
});

describe("createUser", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockInsert.mockReturnValue({ values: mockValues });
		mockValues.mockReturnValue({ returning: mockReturning });
	});

	it("inserts and returns the new user", async () => {
		mockReturning.mockResolvedValue([mockUser]);

		const { createUser } = await import("@/lib/db/queries/users");
		const result = await createUser({
			clerkId: "clerk_abc",
			email: "jane@example.com",
			name: "Jane Doe",
		});

		expect(result).toEqual(mockUser);
		expect(mockInsert).toHaveBeenCalled();
	});
});

describe("updateUser", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockUpdate.mockReturnValue({ set: mockSet });
		mockSet.mockReturnValue({ where: mockWhere });
		mockWhere.mockReturnValue({ returning: mockReturning });
	});

	it("updates and returns the user", async () => {
		mockReturning.mockResolvedValue([{ ...mockUser, name: "Jane Smith" }]);

		const { updateUser } = await import("@/lib/db/queries/users");
		const result = await updateUser("clerk_abc", { name: "Jane Smith" });

		expect(result?.name).toBe("Jane Smith");
		expect(mockUpdate).toHaveBeenCalled();
	});

	it("returns null when user not found", async () => {
		mockReturning.mockResolvedValue([]);

		const { updateUser } = await import("@/lib/db/queries/users");
		const result = await updateUser("nonexistent", { name: "Nobody" });

		expect(result).toBeNull();
	});
});

describe("deleteUser", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockDelete.mockReturnValue({ where: mockWhere });
		mockWhere.mockReturnValue({ returning: mockReturning });
	});

	it("deletes and returns the user", async () => {
		mockReturning.mockResolvedValue([mockUser]);

		const { deleteUser } = await import("@/lib/db/queries/users");
		const result = await deleteUser("clerk_abc");

		expect(result).toEqual(mockUser);
		expect(mockDelete).toHaveBeenCalled();
	});

	it("returns null when user not found", async () => {
		mockReturning.mockResolvedValue([]);

		const { deleteUser } = await import("@/lib/db/queries/users");
		const result = await deleteUser("nonexistent");

		expect(result).toBeNull();
	});
});
