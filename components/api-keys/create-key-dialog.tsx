"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createApiKeyAction } from "@/app/(dashboard)/settings/api-keys/actions";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import type { App } from "@/lib/db/schema";
import { showToast } from "@/lib/toast";

const ALL_SCOPES = [
	{
		value: "read",
		label: "Read",
		description: "List and view prompts/blueprints",
	},
	{
		value: "resolve",
		label: "Resolve",
		description: "Resolve prompts via API",
	},
	{
		value: "write",
		label: "Write",
		description: "Create and update prompts/blueprints",
	},
	{
		value: "admin",
		label: "Admin",
		description: "Manage API keys and settings",
	},
] as const;

interface CreateKeyDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	apps: App[];
	onCreated: (data: { id: string; label: string; token: string }) => void;
}

export function CreateKeyDialog({
	open,
	onOpenChange,
	apps,
	onCreated,
}: CreateKeyDialogProps) {
	const router = useRouter();
	const [label, setLabel] = useState("");
	const [scopes, setScopes] = useState<string[]>(["read", "resolve"]);
	const [appId, setAppId] = useState<string>("");
	const [isSaving, setIsSaving] = useState(false);

	function toggleScope(scope: string) {
		setScopes((prev) =>
			prev.includes(scope) ? prev.filter((s) => s !== scope) : [...prev, scope],
		);
	}

	async function handleSubmit() {
		if (!label.trim()) {
			showToast("warning", "Label is required");
			return;
		}
		if (scopes.length === 0) {
			showToast("warning", "Select at least one scope");
			return;
		}

		setIsSaving(true);
		const actionData: Parameters<typeof createApiKeyAction>[0] = {
			label: label.trim(),
			scopes,
		};
		if (appId) actionData.appId = appId;

		const result = await createApiKeyAction(actionData);
		setIsSaving(false);

		if (result.success) {
			onCreated(result.data);
			onOpenChange(false);
			setLabel("");
			setScopes(["read", "resolve"]);
			setAppId("");
			router.refresh();
		} else {
			showToast("error", result.error);
		}
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Create API Key</DialogTitle>
					<DialogDescription>
						Generate a new API key for programmatic access.
					</DialogDescription>
				</DialogHeader>
				<div className="flex flex-col gap-4 py-2">
					<div className="flex flex-col gap-1.5">
						<Label htmlFor="key-label">Label</Label>
						<Input
							id="key-label"
							placeholder="e.g. Production backend"
							value={label}
							onChange={(e) => setLabel(e.target.value)}
						/>
					</div>

					<div className="flex flex-col gap-2">
						<Label>Scopes</Label>
						{ALL_SCOPES.map((scope) => (
							<div key={scope.value} className="flex items-center gap-2">
								<Checkbox
									id={`scope-${scope.value}`}
									checked={scopes.includes(scope.value)}
									onCheckedChange={() => toggleScope(scope.value)}
								/>
								<Label
									htmlFor={`scope-${scope.value}`}
									className="font-normal text-sm"
								>
									{scope.label}{" "}
									<span className="text-muted-foreground">
										&mdash; {scope.description}
									</span>
								</Label>
							</div>
						))}
					</div>

					{apps.length > 0 && (
						<div className="flex flex-col gap-1.5">
							<Label htmlFor="key-app">Restrict to app (optional)</Label>
							<Select value={appId} onValueChange={setAppId}>
								<SelectTrigger id="key-app">
									<SelectValue placeholder="All apps" />
								</SelectTrigger>
								<SelectContent>
									{apps.map((app) => (
										<SelectItem key={app.id} value={app.id}>
											{app.name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					)}
				</div>
				<DialogFooter>
					<Button variant="outline" onClick={() => onOpenChange(false)}>
						Cancel
					</Button>
					<Button onClick={handleSubmit} disabled={isSaving}>
						{isSaving ? "Creating..." : "Create Key"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
