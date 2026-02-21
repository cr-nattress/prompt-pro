import {
	getBlueprintVersionByNumber,
	getBlueprintVersionByStatus,
	getBlueprintVersions,
} from "@/lib/db/queries/blueprint-versions";
import {
	getPromptBySlug,
	getPromptVersionByNumber,
	getPromptVersionByStatus,
} from "@/lib/db/queries/prompts";
import type { PromptVersion } from "@/lib/db/schema";
import type { VersionTag } from "./ref-parser";

/**
 * Resolve a prompt version based on the version tag.
 * Returns the version row or null.
 */
export async function resolvePromptVersion(
	appId: string,
	slug: string,
	versionTag: VersionTag,
) {
	// First get the prompt template
	const prompt = await getPromptBySlug(appId, slug);
	if (!prompt) return { prompt: null, version: null };

	let version: PromptVersion | null | undefined;
	switch (versionTag.type) {
		case "latest":
			version = prompt.latestVersion;
			break;
		case "status":
			version = await getPromptVersionByStatus(prompt.id, versionTag.status);
			break;
		case "pinned":
			version = await getPromptVersionByNumber(prompt.id, versionTag.version);
			break;
	}

	return { prompt, version: version ?? null };
}

/**
 * Resolve a blueprint version based on the version tag.
 * Returns the version row or null.
 */
export async function resolveBlueprintVersion(
	blueprintId: string,
	versionTag: VersionTag,
) {
	switch (versionTag.type) {
		case "latest": {
			const versions = await getBlueprintVersions(blueprintId);
			return versions[0] ?? null;
		}
		case "status":
			return getBlueprintVersionByStatus(blueprintId, versionTag.status);
		case "pinned":
			return getBlueprintVersionByNumber(blueprintId, versionTag.version);
	}
}
