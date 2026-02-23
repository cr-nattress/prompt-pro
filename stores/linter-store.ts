import { create } from "zustand";
import { persist } from "zustand/middleware";

export type LinterPreset = "strict" | "relaxed" | "off";

interface LinterState {
	enabledRules: Set<string>;
	maxTokens: number;
	preset: LinterPreset;
	setEnabledRules: (rules: Set<string>) => void;
	toggleRule: (ruleId: string) => void;
	setMaxTokens: (tokens: number) => void;
	applyPreset: (preset: LinterPreset) => void;
	reset: () => void;
}

const STRICT_RULES = new Set([
	"has-role",
	"has-output-format",
	"has-constraints",
	"no-ambiguous-quantifiers",
	"max-token-limit",
	"has-examples",
]);

const RELAXED_RULES = new Set([
	"has-role",
	"has-output-format",
	"no-ambiguous-quantifiers",
	"max-token-limit",
]);

const DEFAULT_RULES = new Set([
	"has-role",
	"has-output-format",
	"has-constraints",
	"no-ambiguous-quantifiers",
	"max-token-limit",
]);

function presetFromRules(rules: Set<string>): LinterPreset {
	if (rules.size === 0) return "off";
	if (
		rules.size === STRICT_RULES.size &&
		[...STRICT_RULES].every((r) => rules.has(r))
	)
		return "strict";
	if (
		rules.size === RELAXED_RULES.size &&
		[...RELAXED_RULES].every((r) => rules.has(r))
	)
		return "relaxed";
	return "relaxed"; // custom config maps to relaxed as closest
}

export const useLinterStore = create<LinterState>()(
	persist(
		(set) => ({
			enabledRules: DEFAULT_RULES,
			maxTokens: 4000,
			preset: "relaxed",
			setEnabledRules: (enabledRules) =>
				set({ enabledRules, preset: presetFromRules(enabledRules) }),
			toggleRule: (ruleId) =>
				set((state) => {
					const next = new Set(state.enabledRules);
					if (next.has(ruleId)) {
						next.delete(ruleId);
					} else {
						next.add(ruleId);
					}
					return { enabledRules: next, preset: presetFromRules(next) };
				}),
			setMaxTokens: (maxTokens) => set({ maxTokens }),
			applyPreset: (preset) => {
				switch (preset) {
					case "strict":
						set({ enabledRules: new Set(STRICT_RULES), preset: "strict" });
						break;
					case "relaxed":
						set({ enabledRules: new Set(RELAXED_RULES), preset: "relaxed" });
						break;
					case "off":
						set({ enabledRules: new Set(), preset: "off" });
						break;
				}
			},
			reset: () =>
				set({
					enabledRules: DEFAULT_RULES,
					maxTokens: 4000,
					preset: "relaxed",
				}),
		}),
		{
			name: "promptvault-linter-settings",
			storage: {
				getItem: (name) => {
					const str = localStorage.getItem(name);
					if (!str) return null;
					const parsed = JSON.parse(str);
					// Restore Set from array
					if (parsed?.state?.enabledRules) {
						parsed.state.enabledRules = new Set(parsed.state.enabledRules);
					}
					return parsed;
				},
				setItem: (name, value) => {
					// Serialize Set to array
					const serialized = {
						...value,
						state: {
							...value.state,
							enabledRules: [...value.state.enabledRules],
						},
					};
					localStorage.setItem(name, JSON.stringify(serialized));
				},
				removeItem: (name) => localStorage.removeItem(name),
			},
		},
	),
);
