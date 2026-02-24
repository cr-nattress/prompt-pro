import { Plus, Workflow } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { requireAuth } from "@/lib/auth";
import { getWorkspacePipelines } from "@/lib/db/queries/pipelines";
import type { PipelineStep } from "@/lib/pipelines/pipeline-types";

export const metadata: Metadata = { title: "Pipelines" };

export default async function PipelinesPage() {
	const { workspace } = await requireAuth();
	const pipelines = await getWorkspacePipelines(workspace.id);

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="font-semibold text-2xl">Pipelines</h1>
					<p className="text-muted-foreground text-sm">
						Chain prompts together for multi-step workflows.
					</p>
				</div>
				<Button asChild>
					<Link href="/pipelines/new">
						<Plus className="mr-2 h-4 w-4" />
						New Pipeline
					</Link>
				</Button>
			</div>

			{pipelines.length === 0 ? (
				<Card>
					<CardContent className="flex flex-col items-center gap-3 py-12">
						<Workflow className="h-10 w-10 text-muted-foreground" />
						<p className="text-muted-foreground text-sm">
							No pipelines yet. Create one to chain prompts together.
						</p>
						<Button asChild size="sm">
							<Link href="/pipelines/new">Create Pipeline</Link>
						</Button>
					</CardContent>
				</Card>
			) : (
				<div className="grid gap-4">
					{pipelines.map((pipeline) => {
						const steps = (pipeline.steps ?? []) as PipelineStep[];
						return (
							<Link key={pipeline.id} href={`/pipelines/${pipeline.slug}`}>
								<Card className="transition-colors hover:border-primary/50">
									<CardHeader>
										<CardTitle className="text-base">{pipeline.name}</CardTitle>
										<CardDescription>
											{pipeline.description || "No description"}
											{" — "}
											{steps.length} step
											{steps.length === 1 ? "" : "s"}
										</CardDescription>
									</CardHeader>
								</Card>
							</Link>
						);
					})}
				</div>
			)}
		</div>
	);
}
