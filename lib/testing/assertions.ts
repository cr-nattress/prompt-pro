export type AssertionType =
	| "contains"
	| "not_contains"
	| "matches_regex"
	| "max_length"
	| "json_valid"
	| "starts_with"
	| "ends_with";

export interface TestAssertion {
	type: AssertionType;
	value: string;
}

export interface TestCaseResult {
	testCaseId: string;
	testCaseName: string;
	passed: boolean;
	responseText: string;
	latencyMs: number;
	assertionResults: {
		assertion: TestAssertion;
		passed: boolean;
		message: string;
	}[];
}

export function evaluateAssertions(
	responseText: string,
	assertions: TestAssertion[],
): { passed: boolean; results: TestCaseResult["assertionResults"] } {
	const results = assertions.map((assertion) => {
		const result = evaluateSingle(responseText, assertion);
		return { assertion, ...result };
	});

	return {
		passed: results.every((r) => r.passed),
		results,
	};
}

function evaluateSingle(
	text: string,
	assertion: TestAssertion,
): { passed: boolean; message: string } {
	switch (assertion.type) {
		case "contains":
			return {
				passed: text.includes(assertion.value),
				message: text.includes(assertion.value)
					? `Contains "${assertion.value}"`
					: `Does not contain "${assertion.value}"`,
			};
		case "not_contains":
			return {
				passed: !text.includes(assertion.value),
				message: !text.includes(assertion.value)
					? `Does not contain "${assertion.value}"`
					: `Unexpectedly contains "${assertion.value}"`,
			};
		case "matches_regex": {
			try {
				const regex = new RegExp(assertion.value);
				const matches = regex.test(text);
				return {
					passed: matches,
					message: matches
						? `Matches pattern /${assertion.value}/`
						: `Does not match pattern /${assertion.value}/`,
				};
			} catch {
				return { passed: false, message: `Invalid regex: ${assertion.value}` };
			}
		}
		case "max_length": {
			const max = Number.parseInt(assertion.value, 10);
			if (Number.isNaN(max)) {
				return {
					passed: false,
					message: `Invalid max length: ${assertion.value}`,
				};
			}
			return {
				passed: text.length <= max,
				message:
					text.length <= max
						? `Length ${text.length} <= ${max}`
						: `Length ${text.length} exceeds max ${max}`,
			};
		}
		case "json_valid": {
			try {
				JSON.parse(text);
				return { passed: true, message: "Valid JSON" };
			} catch {
				return { passed: false, message: "Invalid JSON" };
			}
		}
		case "starts_with":
			return {
				passed: text.startsWith(assertion.value),
				message: text.startsWith(assertion.value)
					? `Starts with "${assertion.value}"`
					: `Does not start with "${assertion.value}"`,
			};
		case "ends_with":
			return {
				passed: text.trimEnd().endsWith(assertion.value),
				message: text.trimEnd().endsWith(assertion.value)
					? `Ends with "${assertion.value}"`
					: `Does not end with "${assertion.value}"`,
			};
	}
}
