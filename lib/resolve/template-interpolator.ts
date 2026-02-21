const PARAM_REGEX = /\{\{([^}]+)\}\}/g;

export interface InterpolationResult {
	resolved: string;
	unresolvedParams: string[];
}

/**
 * Interpolate `{{var}}` placeholders in a template with provided parameter values.
 * Unmatched placeholders are left as-is and listed in `unresolvedParams`.
 */
export function interpolateTemplate(
	template: string,
	params: Record<string, string>,
): InterpolationResult {
	const unresolved = new Set<string>();

	const resolved = template.replace(PARAM_REGEX, (match, rawName: string) => {
		const name = rawName.trim();
		if (name in params) {
			return params[name] as string;
		}
		unresolved.add(name);
		return match;
	});

	return {
		resolved,
		unresolvedParams: [...unresolved],
	};
}
