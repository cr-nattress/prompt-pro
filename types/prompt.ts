import type { PromptTemplate, PromptVersion } from "@/lib/db/schema";

export type PromptWithVersion = PromptTemplate & {
	latestVersion: PromptVersion | null;
};

export interface PromptListResult {
	items: PromptWithVersion[];
	total: number;
	page: number;
	pageSize: number;
}

export type ActionResult<T> =
	| { success: true; data: T }
	| { success: false; error: string };
