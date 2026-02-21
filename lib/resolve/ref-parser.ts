export type VersionTag =
	| { type: "latest" }
	| { type: "status"; status: "active" | "stable" | "deprecated" }
	| { type: "pinned"; version: number };

export interface ParsedRef {
	appSlug: string;
	entitySlug: string;
	versionTag: VersionTag;
}

export type ParseRefResult =
	| { ok: true; ref: ParsedRef }
	| { ok: false; reason: string };

const SLUG_PATTERN = /^[a-z0-9-]+$/;
const STATUS_VALUES = new Set(["active", "stable", "deprecated"]);

/**
 * Parse a prompt/blueprint reference string.
 *
 * Format: `app-slug/entity-slug@version-tag`
 * - version-tag is optional; defaults to "latest"
 * - Supported tags: `latest`, `active`, `stable`, `deprecated`, `v{N}`
 */
export function parseRef(ref: string): ParseRefResult {
	if (!ref || typeof ref !== "string") {
		return { ok: false, reason: "Ref must be a non-empty string" };
	}

	// Split off version tag
	let path: string;
	let tagStr: string;

	const atIndex = ref.indexOf("@");
	if (atIndex === -1) {
		path = ref;
		tagStr = "latest";
	} else {
		path = ref.slice(0, atIndex);
		tagStr = ref.slice(atIndex + 1);
	}

	if (!tagStr) {
		return { ok: false, reason: "Version tag after @ cannot be empty" };
	}

	// Split path into app/entity
	const segments = path.split("/");
	if (segments.length !== 2) {
		return {
			ok: false,
			reason:
				"Ref must contain exactly one slash: app-slug/entity-slug[@version]",
		};
	}

	const [appSlug, entitySlug] = segments as [string, string];

	if (!SLUG_PATTERN.test(appSlug)) {
		return {
			ok: false,
			reason: `Invalid app slug "${appSlug}". Must contain only lowercase letters, numbers, and hyphens.`,
		};
	}

	if (!SLUG_PATTERN.test(entitySlug)) {
		return {
			ok: false,
			reason: `Invalid entity slug "${entitySlug}". Must contain only lowercase letters, numbers, and hyphens.`,
		};
	}

	// Parse version tag
	let versionTag: VersionTag;

	if (tagStr === "latest") {
		versionTag = { type: "latest" };
	} else if (STATUS_VALUES.has(tagStr)) {
		versionTag = {
			type: "status",
			status: tagStr as "active" | "stable" | "deprecated",
		};
	} else if (tagStr.startsWith("v")) {
		const num = Number.parseInt(tagStr.slice(1), 10);
		if (Number.isNaN(num) || num < 1) {
			return {
				ok: false,
				reason: `Invalid version number "${tagStr}". Use v1, v2, etc.`,
			};
		}
		versionTag = { type: "pinned", version: num };
	} else {
		return {
			ok: false,
			reason: `Invalid version tag "${tagStr}". Use: latest, active, stable, deprecated, or v{N}`,
		};
	}

	return {
		ok: true,
		ref: { appSlug, entitySlug, versionTag },
	};
}
