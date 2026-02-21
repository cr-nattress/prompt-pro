import type { ContextBlock } from "@/lib/db/schema";
import { countTokens } from "@/lib/token-utils";
import { interpolateTemplate } from "./template-interpolator";

export interface AssembledBlock {
	id: string;
	slug: string;
	name: string;
	type: string;
	resolvedContent: string;
	unresolvedParams: string[];
	tokenCount: number;
}

export interface AssembledBlueprint {
	blocks: AssembledBlock[];
	totalTokenCount: number;
	allUnresolvedParams: string[];
}

/**
 * Assemble a blueprint by interpolating each block's content with parameters.
 * Only includes blocks that are required OR non-conditional.
 */
export function assembleBlueprint(
	blocks: ContextBlock[],
	params: Record<string, string>,
): AssembledBlueprint {
	const assembled: AssembledBlock[] = [];
	const allUnresolved = new Set<string>();
	let totalTokens = 0;

	for (const block of blocks) {
		// Include block if it's required OR not conditional
		if (!block.isRequired && block.isConditional) continue;

		const content = block.content ?? "";
		const { resolved, unresolvedParams } = interpolateTemplate(content, params);
		const tokenCount = countTokens(resolved);

		for (const p of unresolvedParams) {
			allUnresolved.add(p);
		}

		totalTokens += tokenCount;

		assembled.push({
			id: block.id,
			slug: block.slug,
			name: block.name,
			type: block.type,
			resolvedContent: resolved,
			unresolvedParams,
			tokenCount,
		});
	}

	return {
		blocks: assembled,
		totalTokenCount: totalTokens,
		allUnresolvedParams: [...allUnresolved],
	};
}
