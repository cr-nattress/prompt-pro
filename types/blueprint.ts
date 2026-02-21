import type { ContextBlock, ContextBlueprint } from "@/lib/db/schema";

export type BlueprintWithBlocks = ContextBlueprint & {
	blocks: ContextBlock[];
};

export type BlueprintWithBlockCount = ContextBlueprint & {
	blockCount: number;
};

export interface BlueprintListResult {
	items: BlueprintWithBlockCount[];
	total: number;
	page: number;
	pageSize: number;
}
