"use client";

import { Badge } from "@/components/ui/badge";

interface ChipSelectorSingleProps {
	options: string[];
	selected: string;
	onSelect: (value: string) => void;
	multiple?: false | undefined;
}

interface ChipSelectorMultiProps {
	options: string[];
	selected: string[];
	onSelect: (value: string[]) => void;
	multiple: true;
}

type ChipSelectorProps = ChipSelectorSingleProps | ChipSelectorMultiProps;

export function ChipSelector(props: ChipSelectorProps) {
	const { options, multiple } = props;

	function handleClick(option: string) {
		if (multiple) {
			const { selected, onSelect } = props as ChipSelectorMultiProps;
			if (selected.includes(option)) {
				onSelect(selected.filter((s) => s !== option));
			} else {
				onSelect([...selected, option]);
			}
		} else {
			const { selected, onSelect } = props as ChipSelectorSingleProps;
			onSelect(selected === option ? "" : option);
		}
	}

	function isSelected(option: string): boolean {
		if (multiple) {
			return (props as ChipSelectorMultiProps).selected.includes(option);
		}
		return (props as ChipSelectorSingleProps).selected === option;
	}

	return (
		<div className="flex flex-wrap gap-2">
			{options.map((option) => (
				<Badge
					key={option}
					variant={isSelected(option) ? "default" : "outline"}
					className="cursor-pointer select-none transition-colors"
					onClick={() => handleClick(option)}
				>
					{option}
				</Badge>
			))}
		</div>
	);
}
