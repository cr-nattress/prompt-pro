export type LinterSeverity = "warning" | "info";

export interface LintRule {
	id: string;
	name: string;
	description: string;
	category: "structure" | "clarity" | "completeness" | "efficiency";
	defaultEnabled: boolean;
	check: (text: string, config?: RuleConfig) => LintViolation[];
}

export interface RuleConfig {
	maxTokens?: number | undefined;
}

export interface LintViolation {
	ruleId: string;
	ruleName: string;
	severity: LinterSeverity;
	message: string;
	/** Character offset in the text where the issue starts */
	from?: number | undefined;
	/** Character offset where the issue ends */
	to?: number | undefined;
	/** Suggested fix text (if applicable) */
	fix?: string | undefined;
}

const ROLE_PATTERNS =
	/\b(you are|act as|role|persona|behave as|pretend|imagine you|as a|your role)\b/i;
const OUTPUT_FORMAT_PATTERNS =
	/\b(format|output|respond in|reply in|json|markdown|bullet|table|csv|xml|html|structured|schema)\b/i;
const CONSTRAINT_PATTERNS =
	/\b(must not|do not|avoid|never|always|ensure|limit|constraint|rule|restriction|guideline|requirement)\b/i;
const AMBIGUOUS_QUANTIFIERS =
	/\b(a few|some|many|several|a lot|various|numerous|appropriate|relevant|suitable|good|nice|proper)\b/gi;
const EXAMPLE_PATTERNS =
	/\b(example|for instance|e\.g\.|such as|like this|sample|demonstration|here is)\b/i;

export const LINT_RULES: LintRule[] = [
	{
		id: "has-role",
		name: "Define a role",
		description: "Prompt should define a role or persona for the AI.",
		category: "structure",
		defaultEnabled: true,
		check: (text) => {
			if (ROLE_PATTERNS.test(text)) return [];
			return [
				{
					ruleId: "has-role",
					ruleName: "Define a role",
					severity: "warning",
					message:
						'No role or persona detected. Consider starting with "You are..." or "Act as...".',
				},
			];
		},
	},
	{
		id: "has-output-format",
		name: "Specify output format",
		description: "Prompt should specify the desired output format.",
		category: "structure",
		defaultEnabled: true,
		check: (text) => {
			if (OUTPUT_FORMAT_PATTERNS.test(text)) return [];
			return [
				{
					ruleId: "has-output-format",
					ruleName: "Specify output format",
					severity: "warning",
					message:
						"No output format specified. Consider adding format instructions (JSON, Markdown, etc.).",
				},
			];
		},
	},
	{
		id: "has-constraints",
		name: "Include constraints",
		description: "Prompt should include at least one constraint or guideline.",
		category: "completeness",
		defaultEnabled: true,
		check: (text) => {
			if (CONSTRAINT_PATTERNS.test(text)) return [];
			return [
				{
					ruleId: "has-constraints",
					ruleName: "Include constraints",
					severity: "info",
					message:
						"No constraints detected. Adding guidelines helps prevent unwanted behavior.",
				},
			];
		},
	},
	{
		id: "no-ambiguous-quantifiers",
		name: "Avoid ambiguous quantifiers",
		description:
			'Words like "some", "a few", "many" are vague. Use specific numbers.',
		category: "clarity",
		defaultEnabled: true,
		check: (text) => {
			const violations: LintViolation[] = [];
			let match = AMBIGUOUS_QUANTIFIERS.exec(text);
			while (match !== null) {
				violations.push({
					ruleId: "no-ambiguous-quantifiers",
					ruleName: "Avoid ambiguous quantifiers",
					severity: "warning",
					message: `"${match[0]}" is vague. Consider using a specific number instead.`,
					from: match.index,
					to: match.index + match[0].length,
				});
				match = AMBIGUOUS_QUANTIFIERS.exec(text);
			}
			return violations;
		},
	},
	{
		id: "max-token-limit",
		name: "Token limit",
		description: "Prompt should not exceed the configured token limit.",
		category: "efficiency",
		defaultEnabled: true,
		check: (text, config) => {
			const maxTokens = config?.maxTokens ?? 4000;
			// Rough estimate: 1 token ≈ 4 chars
			const estimatedTokens = Math.ceil(text.length / 4);
			if (estimatedTokens <= maxTokens) return [];
			return [
				{
					ruleId: "max-token-limit",
					ruleName: "Token limit",
					severity: "warning",
					message: `Estimated ~${estimatedTokens} tokens exceeds the ${maxTokens} token limit. Consider condensing.`,
				},
			];
		},
	},
	{
		id: "has-examples",
		name: "Include examples",
		description:
			"Prompts benefit from examples (especially few-shot techniques).",
		category: "completeness",
		defaultEnabled: false,
		check: (text) => {
			if (EXAMPLE_PATTERNS.test(text)) return [];
			return [
				{
					ruleId: "has-examples",
					ruleName: "Include examples",
					severity: "info",
					message:
						"No examples detected. Adding examples can significantly improve output quality.",
				},
			];
		},
	},
];

export function runLinter(
	text: string,
	enabledRules?: Set<string> | undefined,
	config?: RuleConfig | undefined,
): LintViolation[] {
	const violations: LintViolation[] = [];

	for (const rule of LINT_RULES) {
		const isEnabled = enabledRules
			? enabledRules.has(rule.id)
			: rule.defaultEnabled;
		if (!isEnabled) continue;
		violations.push(...rule.check(text, config));
	}

	return violations;
}
