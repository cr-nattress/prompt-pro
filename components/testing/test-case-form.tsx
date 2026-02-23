"use client";

import { Save } from "lucide-react";
import { useState } from "react";
import { AssertionBuilder } from "@/components/testing/assertion-builder";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { TestAssertion } from "@/lib/testing/assertions";

interface TestCaseFormProps {
	initialName?: string | undefined;
	initialDescription?: string | undefined;
	initialParameters?: Record<string, string> | undefined;
	initialAssertions?: TestAssertion[] | undefined;
	detectedParams: string[];
	onSave: (data: {
		name: string;
		description: string;
		parameters: Record<string, string>;
		assertions: TestAssertion[];
	}) => void;
	onCancel: () => void;
	saving?: boolean | undefined;
}

export function TestCaseForm({
	initialName = "",
	initialDescription = "",
	initialParameters = {},
	initialAssertions = [],
	detectedParams,
	onSave,
	onCancel,
	saving,
}: TestCaseFormProps) {
	const [name, setName] = useState(initialName);
	const [description, setDescription] = useState(initialDescription);
	const [parameters, setParameters] =
		useState<Record<string, string>>(initialParameters);
	const [assertions, setAssertions] =
		useState<TestAssertion[]>(initialAssertions);

	function handleSave() {
		if (!name.trim()) return;
		onSave({ name, description, parameters, assertions });
	}

	return (
		<div className="flex flex-col gap-4 rounded-lg border p-4">
			<div className="flex flex-col gap-1.5">
				<Label htmlFor="test-name" className="text-sm">
					Test name
				</Label>
				<Input
					id="test-name"
					value={name}
					onChange={(e) => setName(e.target.value)}
					placeholder="e.g. Returns valid JSON"
				/>
			</div>

			<div className="flex flex-col gap-1.5">
				<Label htmlFor="test-desc" className="text-sm">
					Description
				</Label>
				<Textarea
					id="test-desc"
					value={description}
					onChange={(e) => setDescription(e.target.value)}
					placeholder="What this test verifies"
					className="min-h-[60px]"
				/>
			</div>

			{detectedParams.length > 0 && (
				<div className="flex flex-col gap-2">
					<Label className="text-sm">Parameter values</Label>
					{detectedParams.map((param) => (
						<div key={param} className="flex items-center gap-2">
							<span className="w-24 truncate font-mono text-xs">{`{{${param}}}`}</span>
							<Input
								value={parameters[param] ?? ""}
								onChange={(e) =>
									setParameters((prev) => ({
										...prev,
										[param]: e.target.value,
									}))
								}
								placeholder={`Value for ${param}`}
								className="flex-1"
							/>
						</div>
					))}
				</div>
			)}

			<div className="flex flex-col gap-2">
				<Label className="text-sm">Assertions</Label>
				<AssertionBuilder assertions={assertions} onChange={setAssertions} />
			</div>

			<div className="flex justify-end gap-2">
				<Button variant="ghost" size="sm" onClick={onCancel}>
					Cancel
				</Button>
				<Button
					size="sm"
					onClick={handleSave}
					disabled={!name.trim() || saving}
				>
					<Save className="mr-1.5 h-3.5 w-3.5" />
					Save
				</Button>
			</div>
		</div>
	);
}
