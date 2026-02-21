import { generateObject } from "ai";
import {
	BLUEPRINT_ANALYSIS_SYSTEM,
	buildBlueprintAnalysisUserMessage,
} from "./prompts";
import { getModel } from "./provider";
import {
	type BlueprintAnalysisResult,
	blueprintAnalysisSchema,
} from "./schemas";

export async function analyzeBlueprint(
	blocks: Array<{
		slug: string;
		name: string;
		type: string;
		content: string | null;
		position: number;
		isRequired: boolean;
		isConditional: boolean;
		condition: string | null;
	}>,
	metadata?: {
		name?: string;
		description?: string;
		targetLlm?: string;
		totalTokenBudget?: number;
	},
): Promise<BlueprintAnalysisResult> {
	const { object } = await generateObject({
		model: getModel(),
		schema: blueprintAnalysisSchema,
		system: BLUEPRINT_ANALYSIS_SYSTEM,
		prompt: buildBlueprintAnalysisUserMessage(blocks, metadata),
	});

	return object;
}
