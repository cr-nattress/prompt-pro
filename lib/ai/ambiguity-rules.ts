export interface AmbiguityRule {
	id: string;
	pattern: RegExp;
	message: string;
	severity: "warning" | "info";
	replacement?: string;
}

export interface AmbiguityMatch {
	ruleId: string;
	from: number;
	to: number;
	message: string;
	severity: "warning" | "info";
	replacement?: string | undefined;
}

const rules: AmbiguityRule[] = [
	{
		id: "some",
		pattern: /\bsome\b/gi,
		message: 'Vague quantifier "some" — specify an exact number or range',
		severity: "warning",
	},
	{
		id: "good",
		pattern: /\bgood\b/gi,
		message: '"Good" is subjective — define specific quality criteria instead',
		severity: "warning",
	},
	{
		id: "appropriate",
		pattern: /\bappropriate\b/gi,
		message: '"Appropriate" is ambiguous — specify exactly what is acceptable',
		severity: "warning",
	},
	{
		id: "etc",
		pattern: /\betc\.?\b/gi,
		message:
			'"etc." leaves scope undefined — list all items or specify the category',
		severity: "warning",
	},
	{
		id: "various",
		pattern: /\bvarious\b/gi,
		message:
			'"Various" is vague — enumerate the specific items or define the set',
		severity: "warning",
	},
	{
		id: "a-few",
		pattern: /\ba few\b/gi,
		message: '"A few" is imprecise — specify an exact number',
		severity: "info",
	},
	{
		id: "recently",
		pattern: /\brecently\b/gi,
		message:
			'"Recently" is relative — specify a timeframe (e.g., "within the last 7 days")',
		severity: "info",
	},
	{
		id: "proper",
		pattern: /\bproper\b/gi,
		message: '"Proper" is subjective — define the specific standard',
		severity: "info",
	},
	{
		id: "suitable",
		pattern: /\bsuitable\b/gi,
		message: '"Suitable" is vague — specify exact criteria for what qualifies',
		severity: "info",
	},
	{
		id: "nice",
		pattern: /\bnice\b/gi,
		message: '"Nice" is subjective — describe the desired qualities explicitly',
		severity: "warning",
	},
	{
		id: "things",
		pattern: /\bthings\b/gi,
		message: '"Things" is imprecise — name the specific items or concepts',
		severity: "warning",
	},
	{
		id: "stuff",
		pattern: /\bstuff\b/gi,
		message: '"Stuff" is vague — use a precise term for what you mean',
		severity: "warning",
	},
	{
		id: "maybe",
		pattern: /\bmaybe\b/gi,
		message: '"Maybe" creates ambiguity — be decisive or define the condition',
		severity: "warning",
	},
	{
		id: "probably",
		pattern: /\bprobably\b/gi,
		message:
			'"Probably" weakens instructions — be definitive or specify the threshold',
		severity: "info",
	},
	{
		id: "as-needed",
		pattern: /\bas needed\b/gi,
		message:
			'"As needed" is undefined — specify the trigger condition explicitly',
		severity: "info",
	},
	{
		id: "if-possible",
		pattern: /\bif possible\b/gi,
		message:
			'"If possible" weakens the instruction — either require it or omit it',
		severity: "info",
	},
	{
		id: "try-to",
		pattern: /\btry to\b/gi,
		message:
			'"Try to" is non-committal — use direct imperatives instead (e.g., "do" not "try to do")',
		severity: "warning",
		replacement: "",
	},
	{
		id: "relevant",
		pattern: /\brelevant\b/gi,
		message:
			'"Relevant" is contextual — specify exactly what qualifies as relevant',
		severity: "info",
	},
	{
		id: "important",
		pattern: /\bimportant\b/gi,
		message:
			'"Important" is relative — explain why or specify priority criteria',
		severity: "info",
	},
	{
		id: "adequate",
		pattern: /\badequate\b/gi,
		message: '"Adequate" is vague — define the minimum acceptable standard',
		severity: "info",
	},
];

export function detectAmbiguities(text: string): AmbiguityMatch[] {
	const matches: AmbiguityMatch[] = [];

	for (const rule of rules) {
		// Reset lastIndex for global regex
		rule.pattern.lastIndex = 0;
		let match = rule.pattern.exec(text);
		while (match !== null) {
			matches.push({
				ruleId: rule.id,
				from: match.index,
				to: match.index + match[0].length,
				message: rule.message,
				severity: rule.severity,
				replacement: rule.replacement,
			});
			match = rule.pattern.exec(text);
		}
	}

	// Sort by position
	matches.sort((a, b) => a.from - b.from);
	return matches;
}
