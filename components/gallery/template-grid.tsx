"use client";

import { Filter } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
	PROMPT_STARTER_TEMPLATES,
	TEMPLATE_CATEGORIES,
} from "@/lib/data/prompt-templates";

export function TemplateGrid() {
	const [categoryFilter, setCategoryFilter] = useState<string>("all");

	const filtered =
		categoryFilter === "all"
			? PROMPT_STARTER_TEMPLATES
			: PROMPT_STARTER_TEMPLATES.filter((t) => t.category === categoryFilter);

	return (
		<div className="space-y-4">
			{/* Filters */}
			<div className="flex flex-wrap items-center gap-2">
				<Filter className="h-4 w-4 text-muted-foreground" />
				<Button
					size="sm"
					variant={categoryFilter === "all" ? "default" : "outline"}
					onClick={() => setCategoryFilter("all")}
				>
					All
				</Button>
				{TEMPLATE_CATEGORIES.map((cat) => (
					<Button
						key={cat.value}
						size="sm"
						variant={categoryFilter === cat.value ? "default" : "outline"}
						onClick={() => setCategoryFilter(cat.value)}
					>
						{cat.label}
					</Button>
				))}
			</div>

			{/* Template cards */}
			<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{filtered.map((template) => (
					<Link
						key={template.slug}
						href={`/gallery/templates/${template.slug}`}
					>
						<Card className="h-full transition-colors hover:bg-muted/50">
							<CardContent className="p-4">
								<h3 className="mb-1 font-medium text-sm">{template.name}</h3>
								<p className="mb-3 line-clamp-2 text-muted-foreground text-xs">
									{template.description}
								</p>
								<div className="flex flex-wrap gap-1">
									<Badge variant="outline" className="text-xs">
										{TEMPLATE_CATEGORIES.find(
											(c) => c.value === template.category,
										)?.label ?? template.category}
									</Badge>
									<Badge variant="secondary" className="text-xs">
										{template.targetLlm}
									</Badge>
									{template.tags.slice(0, 2).map((tag) => (
										<Badge key={tag} variant="secondary" className="text-xs">
											{tag}
										</Badge>
									))}
								</div>
							</CardContent>
						</Card>
					</Link>
				))}
			</div>
		</div>
	);
}
