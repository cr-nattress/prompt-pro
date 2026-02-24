"use client";

import { ArrowLeft, Check, X } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ModelGuide } from "@/lib/data/model-guides";

interface ModelGuideDetailProps {
	model: ModelGuide;
}

export function ModelGuideDetail({ model }: ModelGuideDetailProps) {
	return (
		<div className="space-y-6">
			<div className="flex items-center gap-3">
				<Button variant="ghost" size="sm" asChild>
					<Link href="/learn/models">
						<ArrowLeft className="mr-1 h-4 w-4" />
						Models
					</Link>
				</Button>
			</div>

			<div>
				<div className="flex items-center gap-3">
					<h1 className="font-semibold text-2xl">{model.name}</h1>
					<Badge variant="secondary">{model.provider}</Badge>
					<Badge variant="outline">{model.category}</Badge>
				</div>
				<p className="mt-1 text-muted-foreground text-sm">
					{model.description}
				</p>
			</div>

			{/* Key specs */}
			<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
				<Card>
					<CardContent className="p-4">
						<p className="text-muted-foreground text-xs">Context Window</p>
						<p className="font-semibold text-lg">{model.tokenLimits.context}</p>
					</CardContent>
				</Card>
				<Card>
					<CardContent className="p-4">
						<p className="text-muted-foreground text-xs">Max Output</p>
						<p className="font-semibold text-lg">{model.tokenLimits.output}</p>
					</CardContent>
				</Card>
				<Card>
					<CardContent className="p-4">
						<p className="text-muted-foreground text-xs">Input Pricing</p>
						<p className="font-semibold text-lg">{model.pricing.input}</p>
					</CardContent>
				</Card>
				<Card>
					<CardContent className="p-4">
						<p className="text-muted-foreground text-xs">Output Pricing</p>
						<p className="font-semibold text-lg">{model.pricing.output}</p>
					</CardContent>
				</Card>
			</div>

			<div className="grid gap-6 lg:grid-cols-2">
				{/* Strengths */}
				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="text-base text-primary">Strengths</CardTitle>
					</CardHeader>
					<CardContent>
						<ul className="space-y-1.5">
							{model.strengths.map((s) => (
								<li key={s} className="flex items-start gap-2 text-sm">
									<Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
									{s}
								</li>
							))}
						</ul>
					</CardContent>
				</Card>

				{/* Weaknesses */}
				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="text-base text-destructive">
							Weaknesses
						</CardTitle>
					</CardHeader>
					<CardContent>
						<ul className="space-y-1.5">
							{model.weaknesses.map((w) => (
								<li key={w} className="flex items-start gap-2 text-sm">
									<X className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
									{w}
								</li>
							))}
						</ul>
					</CardContent>
				</Card>
			</div>

			{/* Prompt Structure */}
			<Card>
				<CardHeader className="pb-2">
					<CardTitle className="text-base">
						Preferred Prompt Structure
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="whitespace-pre-wrap text-sm">
						{model.promptStructure}
					</div>
				</CardContent>
			</Card>

			{/* Features */}
			<Card>
				<CardHeader className="pb-2">
					<CardTitle className="text-base">Supported Features</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="grid gap-3 sm:grid-cols-3">
						{(
							Object.entries(model.features) as [
								keyof typeof model.features,
								boolean,
							][]
						).map(([feature, supported]) => (
							<div key={feature} className="flex items-center gap-2">
								{supported ? (
									<Check className="h-4 w-4 text-primary" />
								) : (
									<X className="h-4 w-4 text-muted-foreground" />
								)}
								<span className="text-sm capitalize">
									{feature.replace(/([A-Z])/g, " $1").trim()}
								</span>
							</div>
						))}
					</div>
				</CardContent>
			</Card>

			<div className="grid gap-6 lg:grid-cols-2">
				{/* Best Practices */}
				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="text-base">Best Practices</CardTitle>
					</CardHeader>
					<CardContent>
						<ul className="space-y-2">
							{model.bestPractices.map((bp) => (
								<li key={bp} className="flex items-start gap-2 text-sm">
									<span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
									{bp}
								</li>
							))}
						</ul>
					</CardContent>
				</Card>

				{/* Anti-Patterns */}
				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="text-base">Anti-Patterns to Avoid</CardTitle>
					</CardHeader>
					<CardContent>
						<ul className="space-y-2">
							{model.antiPatterns.map((ap) => (
								<li key={ap} className="flex items-start gap-2 text-sm">
									<span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-destructive" />
									{ap}
								</li>
							))}
						</ul>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
