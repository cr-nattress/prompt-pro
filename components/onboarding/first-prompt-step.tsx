"use client";

import { Loader2 } from "lucide-react";
import PromptEditor from "@/components/prompt/editor/prompt-editor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ChipSelector } from "@/components/wizard/chip-selector";
import { useOnboardingStore } from "@/stores/onboarding-store";

const ROLE_PRESETS = [
	"Expert Developer",
	"Technical Writer",
	"Data Analyst",
	"Creative Writer",
];

const TASK_PRESETS = ["Write", "Analyze", "Summarize", "Review", "Explain"];

const OUTPUT_PRESETS = ["Markdown", "JSON", "Bullet points", "Step-by-step"];

interface FirstPromptStepProps {
	onContinue: () => void;
	isCreating: boolean;
}

export function FirstPromptStep({
	onContinue,
	isCreating,
}: FirstPromptStepProps) {
	const {
		promptRole,
		setPromptRole,
		promptTask,
		setPromptTask,
		promptOutput,
		setPromptOutput,
	} = useOnboardingStore();

	const previewSections: string[] = [];
	if (promptRole) previewSections.push(`# Role\nYou are a ${promptRole}.`);
	if (promptTask) previewSections.push(`# Task\n${promptTask}`);
	if (promptOutput) previewSections.push(`# Output Format\n${promptOutput}`);
	const previewText = previewSections.join("\n\n");

	return (
		<div className="flex flex-col gap-6">
			<div className="text-center">
				<h2 className="font-semibold text-xl">Create your first prompt</h2>
				<p className="mt-1 text-muted-foreground text-sm">
					Build a quick prompt in 3 easy fields.
				</p>
			</div>

			<div className="flex flex-col gap-4">
				<div className="flex flex-col gap-2">
					<Label htmlFor="onboard-role">Role</Label>
					<Input
						id="onboard-role"
						placeholder="e.g. Senior Software Engineer"
						value={promptRole}
						onChange={(e) => setPromptRole(e.target.value)}
					/>
					<ChipSelector
						options={ROLE_PRESETS}
						selected={promptRole}
						onSelect={setPromptRole}
					/>
				</div>

				<div className="flex flex-col gap-2">
					<Label htmlFor="onboard-task">Task</Label>
					<Textarea
						id="onboard-task"
						placeholder="e.g. Review code for bugs and style issues"
						value={promptTask}
						onChange={(e) => setPromptTask(e.target.value)}
						rows={2}
					/>
					<ChipSelector
						options={TASK_PRESETS}
						selected={promptTask}
						onSelect={setPromptTask}
					/>
				</div>

				<div className="flex flex-col gap-2">
					<Label htmlFor="onboard-output">Output format</Label>
					<Input
						id="onboard-output"
						placeholder="e.g. Markdown with bullet points"
						value={promptOutput}
						onChange={(e) => setPromptOutput(e.target.value)}
					/>
					<ChipSelector
						options={OUTPUT_PRESETS}
						selected={promptOutput}
						onSelect={setPromptOutput}
					/>
				</div>
			</div>

			{previewText && (
				<div className="h-[200px] overflow-hidden rounded-lg border">
					<PromptEditor value={previewText} readOnly />
				</div>
			)}

			<Button
				onClick={onContinue}
				size="lg"
				disabled={!promptRole.trim() || !promptTask.trim() || isCreating}
				className="self-center"
			>
				{isCreating ? (
					<>
						<Loader2 className="mr-2 h-4 w-4 animate-spin" />
						Creating...
					</>
				) : (
					"Create & Continue"
				)}
			</Button>
		</div>
	);
}
