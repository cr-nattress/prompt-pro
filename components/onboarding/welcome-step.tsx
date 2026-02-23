"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChipSelector } from "@/components/wizard/chip-selector";
import { useOnboardingStore } from "@/stores/onboarding-store";

const USE_CASE_OPTIONS = [
	"AI Chatbots",
	"Content Creation",
	"Code Generation",
	"Data Analysis",
	"Customer Support",
	"Education",
	"Research",
];

interface WelcomeStepProps {
	onContinue: () => void;
}

export function WelcomeStep({ onContinue }: WelcomeStepProps) {
	const { workspaceName, setWorkspaceName, useCases, setUseCases } =
		useOnboardingStore();

	return (
		<div className="flex flex-col gap-8">
			<div className="text-center">
				<h1 className="font-bold text-3xl">Welcome to PromptVault!</h1>
				<p className="mt-2 text-muted-foreground">
					Let&apos;s set up your workspace and create your first prompt.
				</p>
			</div>

			<div className="flex flex-col gap-2">
				<Label htmlFor="workspace-name">Workspace name</Label>
				<Input
					id="workspace-name"
					placeholder="My Workspace"
					value={workspaceName}
					onChange={(e) => setWorkspaceName(e.target.value)}
				/>
			</div>

			<div className="flex flex-col gap-2">
				<Label>What will you use PromptVault for?</Label>
				<ChipSelector
					options={USE_CASE_OPTIONS}
					selected={useCases}
					onSelect={setUseCases}
					multiple
				/>
			</div>

			<Button
				onClick={onContinue}
				size="lg"
				disabled={!workspaceName.trim()}
				className="self-center"
			>
				Continue
			</Button>
		</div>
	);
}
