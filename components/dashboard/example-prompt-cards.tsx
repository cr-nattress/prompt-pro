"use client";

import { GitFork, Plus, Wand2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { forkExamplePromptAction } from "@/app/(dashboard)/dashboard/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	EXAMPLE_PROMPTS,
	type ExamplePrompt,
} from "@/lib/data/example-prompts";

export function ExamplePromptCards() {
	const router = useRouter();
	const [forkingIndex, setForkingIndex] = useState<number | null>(null);

	async function handleFork(example: ExamplePrompt, index: number) {
		setForkingIndex(index);
		try {
			const result = await forkExamplePromptAction(example);
			if (result.success) {
				toast.success(`"${example.name}" created!`);
				router.push(`/prompts/${result.data.slug}`);
			} else {
				toast.error(result.error);
			}
		} catch {
			toast.error("Failed to fork example");
		} finally {
			setForkingIndex(null);
		}
	}

	return (
		<div className="flex flex-col gap-6">
			<div>
				<h2 className="font-semibold text-lg">Get started with an example</h2>
				<p className="text-muted-foreground text-sm">
					Fork one of these prompts to see how PromptVault works, or create your
					own.
				</p>
			</div>

			<div className="grid gap-4 md:grid-cols-3">
				{EXAMPLE_PROMPTS.map((example, i) => (
					<Card key={example.name}>
						<CardHeader className="pb-2">
							<CardTitle className="text-base">{example.name}</CardTitle>
						</CardHeader>
						<CardContent className="flex flex-col gap-3">
							<p className="text-muted-foreground text-sm">
								{example.description}
							</p>
							<div className="flex flex-wrap gap-1">
								{example.tags.map((tag) => (
									<Badge key={tag} variant="secondary" className="text-xs">
										{tag}
									</Badge>
								))}
							</div>
							<Button
								variant="outline"
								size="sm"
								onClick={() => handleFork(example, i)}
								disabled={forkingIndex !== null}
							>
								<GitFork className="mr-2 h-3.5 w-3.5" />
								{forkingIndex === i ? "Forking..." : "Fork"}
							</Button>
						</CardContent>
					</Card>
				))}
			</div>

			<div className="flex flex-wrap items-center gap-3">
				<Button asChild>
					<Link href="/prompts/new?mode=guided">
						<Wand2 className="mr-2 h-4 w-4" />
						Create with Guided Builder
					</Link>
				</Button>
				<Button asChild variant="outline">
					<Link href="/prompts/new">
						<Plus className="mr-2 h-4 w-4" />
						Create from Scratch
					</Link>
				</Button>
			</div>
		</div>
	);
}
