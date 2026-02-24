"use client";

import { Bell, Check, Loader2, Plus, Trash2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import {
	createWebhookAction,
	deleteWebhookAction,
	updateWebhookAction,
} from "@/app/(dashboard)/settings/webhooks/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import type { Webhook } from "@/lib/db/schema";
import { showToast } from "@/lib/toast";

const ALL_EVENTS = [
	{ value: "prompt.created", label: "Prompt Created" },
	{ value: "prompt.deleted", label: "Prompt Deleted" },
	{ value: "prompt.version.promoted", label: "Prompt Version Promoted" },
	{ value: "blueprint.created", label: "Blueprint Created" },
	{ value: "blueprint.deleted", label: "Blueprint Deleted" },
	{
		value: "blueprint.version.promoted",
		label: "Blueprint Version Promoted",
	},
] as const;

interface WebhookManagerProps {
	webhooks: Webhook[];
}

export function WebhookManager({ webhooks }: WebhookManagerProps) {
	const router = useRouter();
	const [dialogOpen, setDialogOpen] = useState(false);
	const [url, setUrl] = useState("");
	const [description, setDescription] = useState("");
	const [selectedEvents, setSelectedEvents] = useState<string[]>([]);
	const [isPending, startTransition] = useTransition();

	function resetForm() {
		setUrl("");
		setDescription("");
		setSelectedEvents([]);
	}

	function toggleEvent(event: string) {
		setSelectedEvents((prev) =>
			prev.includes(event) ? prev.filter((e) => e !== event) : [...prev, event],
		);
	}

	function handleCreate() {
		startTransition(async () => {
			const result = await createWebhookAction({
				url,
				events: selectedEvents as (typeof ALL_EVENTS)[number]["value"][],
				description: description || undefined,
			});
			if (result.success) {
				showToast("success", "Webhook created");
				setDialogOpen(false);
				resetForm();
				router.refresh();
			} else {
				showToast("error", result.error);
			}
		});
	}

	function handleToggleActive(webhook: Webhook) {
		startTransition(async () => {
			const result = await updateWebhookAction(webhook.id, {
				active: !webhook.active,
			});
			if (result.success) {
				showToast(
					"success",
					result.data.active ? "Webhook enabled" : "Webhook disabled",
				);
				router.refresh();
			} else {
				showToast("error", result.error);
			}
		});
	}

	function handleDelete(id: string) {
		startTransition(async () => {
			const result = await deleteWebhookAction(id);
			if (result.success) {
				showToast("success", "Webhook deleted");
				router.refresh();
			} else {
				showToast("error", result.error);
			}
		});
	}

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h2 className="font-semibold text-lg">Webhooks</h2>
					<p className="text-muted-foreground text-sm">
						Receive notifications when prompts and blueprints change
					</p>
				</div>
				<Button size="sm" onClick={() => setDialogOpen(true)}>
					<Plus className="mr-1.5 h-3.5 w-3.5" />
					New Webhook
				</Button>
			</div>

			{webhooks.length === 0 ? (
				<Card>
					<CardContent className="flex flex-col items-center gap-3 p-8 text-center">
						<Bell className="h-8 w-8 text-muted-foreground" />
						<p className="text-muted-foreground text-sm">
							No webhooks configured. Create one to receive event notifications.
						</p>
					</CardContent>
				</Card>
			) : (
				<div className="space-y-2">
					{webhooks.map((webhook) => (
						<Card key={webhook.id}>
							<CardContent className="flex items-center justify-between p-3">
								<div className="min-w-0 flex-1">
									<div className="flex items-center gap-2">
										<p className="truncate font-medium text-sm">
											{webhook.url}
										</p>
										<Badge
											variant={webhook.active ? "default" : "secondary"}
											className="text-xs"
										>
											{webhook.active ? (
												<Check className="mr-1 h-3 w-3" />
											) : (
												<X className="mr-1 h-3 w-3" />
											)}
											{webhook.active ? "Active" : "Inactive"}
										</Badge>
									</div>
									{webhook.description && (
										<p className="text-muted-foreground text-xs">
											{webhook.description}
										</p>
									)}
									<div className="mt-1 flex flex-wrap gap-1">
										{webhook.events.map((event) => (
											<Badge key={event} variant="outline" className="text-xs">
												{event}
											</Badge>
										))}
									</div>
								</div>
								<div className="ml-3 flex items-center gap-2">
									<Switch
										checked={webhook.active}
										onCheckedChange={() => handleToggleActive(webhook)}
										disabled={isPending}
									/>
									<Button
										variant="ghost"
										size="sm"
										onClick={() => handleDelete(webhook.id)}
										disabled={isPending}
									>
										<Trash2 className="h-3.5 w-3.5" />
									</Button>
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			)}

			<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
				<DialogContent className="sm:max-w-md">
					<DialogHeader>
						<DialogTitle>New Webhook</DialogTitle>
					</DialogHeader>
					<div className="space-y-4">
						<div>
							<Label htmlFor="webhook-url">Endpoint URL</Label>
							<Input
								id="webhook-url"
								type="url"
								value={url}
								onChange={(e) => setUrl(e.target.value)}
								placeholder="https://example.com/webhook"
							/>
						</div>
						<div>
							<Label htmlFor="webhook-desc">Description (optional)</Label>
							<Input
								id="webhook-desc"
								value={description}
								onChange={(e) => setDescription(e.target.value)}
								placeholder="What this webhook is for..."
							/>
						</div>
						<div>
							<p className="mb-2 font-medium text-sm">Events</p>
							<div className="space-y-2">
								{ALL_EVENTS.map((event) => (
									// biome-ignore lint/a11y/noLabelWithoutControl: label wraps Checkbox which renders an input
									<label
										key={event.value}
										className="flex cursor-pointer items-center gap-2"
									>
										<Checkbox
											checked={selectedEvents.includes(event.value)}
											onCheckedChange={() => toggleEvent(event.value)}
										/>
										<span className="text-sm">{event.label}</span>
									</label>
								))}
							</div>
						</div>
						<Button
							className="w-full"
							onClick={handleCreate}
							disabled={isPending || !url.trim() || selectedEvents.length === 0}
						>
							{isPending && (
								<Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
							)}
							Create Webhook
						</Button>
						<p className="text-muted-foreground text-xs">
							A signing secret will be generated automatically. You can view it
							after creation.
						</p>
					</div>
				</DialogContent>
			</Dialog>
		</div>
	);
}
