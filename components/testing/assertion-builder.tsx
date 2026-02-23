"use client";

import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import type { AssertionType, TestAssertion } from "@/lib/testing/assertions";

const ASSERTION_LABELS: Record<AssertionType, string> = {
	contains: "Contains",
	not_contains: "Does not contain",
	matches_regex: "Matches regex",
	max_length: "Max length",
	json_valid: "Valid JSON",
	starts_with: "Starts with",
	ends_with: "Ends with",
};

interface AssertionBuilderProps {
	assertions: TestAssertion[];
	onChange: (assertions: TestAssertion[]) => void;
}

export function AssertionBuilder({
	assertions,
	onChange,
}: AssertionBuilderProps) {
	function addAssertion() {
		onChange([...assertions, { type: "contains", value: "" }]);
	}

	function removeAssertion(index: number) {
		onChange(assertions.filter((_, i) => i !== index));
	}

	function updateAssertion(index: number, updates: Partial<TestAssertion>) {
		onChange(
			assertions.map((a, i) => (i === index ? { ...a, ...updates } : a)),
		);
	}

	return (
		<div className="flex flex-col gap-2">
			{assertions.map((assertion, index) => (
				<div
					key={`${assertion.type}-${assertion.value}-${index}`}
					className="flex items-center gap-2"
				>
					<Select
						value={assertion.type}
						onValueChange={(type) =>
							updateAssertion(index, { type: type as AssertionType })
						}
					>
						<SelectTrigger className="w-[160px]">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							{Object.entries(ASSERTION_LABELS).map(([type, label]) => (
								<SelectItem key={type} value={type}>
									{label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					{assertion.type !== "json_valid" && (
						<Input
							placeholder={
								assertion.type === "max_length"
									? "e.g. 500"
									: assertion.type === "matches_regex"
										? "e.g. \\d+"
										: "Value..."
							}
							value={assertion.value}
							onChange={(e) =>
								updateAssertion(index, { value: e.target.value })
							}
							className="flex-1"
						/>
					)}
					<Button
						variant="ghost"
						size="icon-sm"
						onClick={() => removeAssertion(index)}
					>
						<Trash2 className="h-3.5 w-3.5" />
					</Button>
				</div>
			))}
			<Button variant="outline" size="sm" onClick={addAssertion}>
				<Plus className="mr-1.5 h-3.5 w-3.5" />
				Add Assertion
			</Button>
		</div>
	);
}
