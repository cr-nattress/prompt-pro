"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { createPipelineAction } from "@/app/(dashboard)/pipelines/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { showToast } from "@/lib/toast";

export default function NewPipelinePage() {
	const router = useRouter();
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [isPending, startTransition] = useTransition();

	function handleCreate() {
		if (!name.trim()) return;
		startTransition(async () => {
			const result = await createPipelineAction(
				name.trim(),
				description.trim(),
			);
			if (result.success) {
				showToast("success", "Pipeline created");
				router.push(`/pipelines/${result.data.slug}`);
			} else {
				showToast("error", result.error);
			}
		});
	}

	return (
		<div className="space-y-6">
			<Button variant="ghost" size="sm" asChild>
				<Link href="/pipelines">
					<ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
					Pipelines
				</Link>
			</Button>

			<Card className="max-w-lg">
				<CardHeader>
					<CardTitle>New Pipeline</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<div>
						<Label htmlFor="pipeline-name">Name</Label>
						<Input
							id="pipeline-name"
							value={name}
							onChange={(e) => setName(e.target.value)}
							placeholder="My pipeline"
							className="mt-1"
						/>
					</div>
					<div>
						<Label htmlFor="pipeline-desc">Description</Label>
						<Textarea
							id="pipeline-desc"
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							placeholder="What does this pipeline do?"
							rows={3}
							className="mt-1"
						/>
					</div>
					<Button onClick={handleCreate} disabled={isPending || !name.trim()}>
						{isPending ? "Creating..." : "Create Pipeline"}
					</Button>
				</CardContent>
			</Card>
		</div>
	);
}
