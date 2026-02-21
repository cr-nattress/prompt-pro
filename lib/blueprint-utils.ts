import { BookOpen, Clock, Cpu, ListChecks, Target, Wrench } from "lucide-react";

export const BLOCK_TYPE_CONFIG = {
	system: { label: "System", cssVar: "--block-system", icon: Cpu },
	knowledge: {
		label: "Knowledge",
		cssVar: "--block-knowledge",
		icon: BookOpen,
	},
	examples: { label: "Examples", cssVar: "--block-examples", icon: ListChecks },
	tools: { label: "Tools", cssVar: "--block-tools", icon: Wrench },
	history: { label: "History", cssVar: "--block-history", icon: Clock },
	task: { label: "Task", cssVar: "--block-task", icon: Target },
} as const;

export type BlockType = keyof typeof BLOCK_TYPE_CONFIG;

export const BLOCK_TYPES = Object.keys(BLOCK_TYPE_CONFIG) as BlockType[];

export function blockTypeStyle(type: string): React.CSSProperties {
	const config = BLOCK_TYPE_CONFIG[type as BlockType];
	if (!config) return {};
	return { borderLeftColor: `var(${config.cssVar})` };
}
