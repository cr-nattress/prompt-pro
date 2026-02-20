import { describe, expect, it } from "vitest";

describe("example", () => {
	it("should pass a basic assertion", () => {
		expect(1 + 1).toBe(2);
	});

	it("should handle string operations", () => {
		expect("PromptVault".toLowerCase()).toBe("promptvault");
	});
});
