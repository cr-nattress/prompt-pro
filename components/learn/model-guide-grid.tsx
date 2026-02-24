"use client";

import { Brain, Check, X, Zap } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ModelGuide } from "@/lib/data/model-guides";

interface ModelGuideGridProps {
	models: ModelGuide[];
}

const CATEGORY_COLORS: Record<string, string> = {
	frontier: "bg-primary/10 text-primary",
	balanced: "bg-chart-2/10 text-chart-2",
	fast: "bg-chart-3/10 text-chart-3",
};

export function ModelGuideGrid({ models }: ModelGuideGridProps) {
	return (
		<div className="space-y-8">
			<div>
				<h1 className="font-semibold text-2xl">Model Guides</h1>
				<p className="text-muted-foreground text-sm">
					Compare LLMs and learn how to optimize your prompts for each model
				</p>
			</div>

			{/* Comparison table */}
			<Card>
				<CardHeader className="pb-2">
					<CardTitle className="text-base">Quick Comparison</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="overflow-x-auto">
						<table className="w-full text-sm">
							<thead>
								<tr className="border-b">
									<th className="py-2 pr-4 text-left font-medium">Model</th>
									<th className="px-4 py-2 text-left font-medium">Context</th>
									<th className="px-4 py-2 text-left font-medium">Output</th>
									<th className="px-4 py-2 text-left font-medium">
										Input Price
									</th>
									<th className="px-4 py-2 text-left font-medium">Functions</th>
									<th className="px-4 py-2 text-left font-medium">Vision</th>
								</tr>
							</thead>
							<tbody>
								{models.map((m) => (
									<tr key={m.slug} className="border-b last:border-0">
										<td className="py-2 pr-4">
											<Link
												href={`/learn/models/${m.slug}`}
												className="font-medium hover:underline"
											>
												{m.name}
											</Link>
											<span className="ml-1.5 text-muted-foreground text-xs">
												{m.provider}
											</span>
										</td>
										<td className="px-4 py-2 text-muted-foreground">
											{m.tokenLimits.context}
										</td>
										<td className="px-4 py-2 text-muted-foreground">
											{m.tokenLimits.output}
										</td>
										<td className="px-4 py-2 text-muted-foreground">
											{m.pricing.input}
										</td>
										<td className="px-4 py-2">
											{m.features.functionCalling ? (
												<Check className="h-4 w-4 text-primary" />
											) : (
												<X className="h-4 w-4 text-muted-foreground" />
											)}
										</td>
										<td className="px-4 py-2">
											{m.features.vision ? (
												<Check className="h-4 w-4 text-primary" />
											) : (
												<X className="h-4 w-4 text-muted-foreground" />
											)}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</CardContent>
			</Card>

			{/* Model cards */}
			<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{models.map((model) => (
					<Link key={model.slug} href={`/learn/models/${model.slug}`}>
						<Card className="h-full transition-colors hover:border-primary/50">
							<CardContent className="space-y-3 p-4">
								<div className="flex items-start justify-between">
									<div className="flex items-center gap-2">
										{model.category === "fast" ? (
											<Zap className="h-5 w-5 text-chart-3" />
										) : (
											<Brain className="h-5 w-5 text-primary" />
										)}
										<div>
											<p className="font-semibold text-sm">{model.name}</p>
											<p className="text-muted-foreground text-xs">
												{model.provider}
											</p>
										</div>
									</div>
									<Badge
										variant="secondary"
										className={`text-xs ${CATEGORY_COLORS[model.category] ?? ""}`}
									>
										{model.category}
									</Badge>
								</div>
								<p className="line-clamp-2 text-muted-foreground text-xs">
									{model.description}
								</p>
								<div className="flex flex-wrap gap-1">
									{model.strengths.slice(0, 3).map((s) => (
										<Badge
											key={s}
											variant="outline"
											className="text-xs font-normal"
										>
											{s.length > 30 ? `${s.slice(0, 30)}...` : s}
										</Badge>
									))}
								</div>
								<div className="flex justify-between text-muted-foreground text-xs">
									<span>Context: {model.tokenLimits.context}</span>
									<span>In: {model.pricing.input}</span>
								</div>
							</CardContent>
						</Card>
					</Link>
				))}
			</div>
		</div>
	);
}
