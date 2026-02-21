import type {
	BlueprintVersion,
	ContextBlock,
	ContextBlueprint,
} from "@/lib/db/schema";

export type BlueprintWithBlocks = ContextBlueprint & {
	blocks: ContextBlock[];
};

export type BlueprintWithVersion = ContextBlueprint & {
	blocks: ContextBlock[];
	latestVersion: BlueprintVersion | null;
};

export type BlueprintWithBlockCount = ContextBlueprint & {
	blockCount: number;
	latestVersion?: { version: number; status: string } | null | undefined;
};

export interface BlueprintListResult {
	items: BlueprintWithBlockCount[];
	total: number;
	page: number;
	pageSize: number;
}
