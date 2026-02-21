export type VersionStatus = "draft" | "active" | "stable" | "deprecated";

export const VERSION_STATUS_CONFIG: Record<
	VersionStatus,
	{ label: string; cssVar: string; description: string }
> = {
	draft: {
		label: "Draft",
		cssVar: "--status-draft",
		description: "Work in progress, not yet reviewed",
	},
	active: {
		label: "Active",
		cssVar: "--status-active",
		description: "Currently in use",
	},
	stable: {
		label: "Stable",
		cssVar: "--status-stable",
		description: "Reviewed and approved for production",
	},
	deprecated: {
		label: "Deprecated",
		cssVar: "--status-deprecated",
		description: "No longer recommended for use",
	},
};

export function formatVersionLabel(version: number): string {
	return `v${version}`;
}

const ALLOWED_PROMOTIONS: Record<VersionStatus, VersionStatus[]> = {
	draft: ["active", "stable"],
	active: ["stable", "deprecated"],
	stable: ["deprecated"],
	deprecated: [],
};

export function getAllowedPromotions(current: VersionStatus): VersionStatus[] {
	return ALLOWED_PROMOTIONS[current] ?? [];
}
