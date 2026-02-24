"use client";

import { ArrowLeft, Copy, GitFork, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { forkTemplateAction } from "@/app/(dashboard)/gallery/templates/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { PromptStarterTemplate } from "@/lib/data/prompt-templates";
import { showToast } from "@/lib/toast";

interface TemplateDetailProps {
	template: PromptStarterTemplate;
}

export function TemplateDetail({ template }: TemplateDetailProps) {
	const router = useRouter();
	const [isForking, startTransition] = useTransition();

	function handleFork() {
		startTransition(async () => {
			const result = await forkTemplateAction(template.slug);
			if (result.success) {
				showToast("success", "Template forked to your vault!");
				router.push(`/prompts/${result.data.slug}`);
			} else {
				showToast("error", result.error);
			}
		});
	}

	function handleCopy() {
		navigator.clipboard.writeText(template.templateText).then(() => {
			showToast("success", "Template copied to clipboard");
		});
	}

	return (
		<div className="space-y-6">
			{/* Back link */}
			<Link
				href="/gallery/templates"
				className="inline-flex items-center gap-1.5 text-muted-foreground text-sm hover:text-foreground"
			>
				<ArrowLeft className="h-4 w-4" />
				All Templates
			</Link>

			{/* Header */}
			<div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
				<div>
					<h1 className="font-semibold text-2xl tracking-tight">
						{template.name}
					</h1>
					<p className="mt-1 text-muted-foreground">{template.purpose}</p>
				</div>
				<div className="flex gap-2">
					<Button variant="outline" onClick={handleCopy}>
						<Copy className="mr-1.5 h-3.5 w-3.5" />
						Copy
					</Button>
					<Button onClick={handleFork} disabled={isForking}>
						{isForking ? (
							<Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
						) : (
							<GitFork className="mr-1.5 h-3.5 w-3.5" />
						)}
						Use This Template
					</Button>
				</div>
			</div>

			{/* Tags */}
			<div className="flex flex-wrap gap-1.5">
				<Badge variant="outline">
					{template.category.charAt(0).toUpperCase() +
						template.category.slice(1)}
				</Badge>
				<Badge variant="secondary">{template.targetLlm}</Badge>
				{template.tags.map((tag) => (
					<Badge key={tag} variant="secondary">
						{tag}
					</Badge>
				))}
			</div>

			{/* Description */}
			<Card>
				<CardContent className="p-4">
					<p className="text-sm">{template.description}</p>
				</CardContent>
			</Card>

			{/* Parameters */}
			{template.parameters.length > 0 && (
				<div>
					<h2 className="mb-2 font-medium text-sm">Parameters</h2>
					<div className="grid gap-2 sm:grid-cols-2">
						{template.parameters.map((param) => (
							<Card key={param.name}>
								<CardContent className="p-3">
									<p className="font-mono font-medium text-sm">
										{`{{${param.name}}}`}
									</p>
									<p className="text-muted-foreground text-xs">
										{param.description}
									</p>
									<p className="mt-1 text-muted-foreground text-xs italic">
										Example: {param.example}
									</p>
								</CardContent>
							</Card>
						))}
					</div>
				</div>
			)}

			{/* Template text */}
			<div>
				<h2 className="mb-2 font-medium text-sm">Template</h2>
				<pre className="whitespace-pre-wrap rounded-lg border bg-muted/30 p-4 font-mono text-sm">
					{template.templateText}
				</pre>
			</div>
		</div>
	);
}
