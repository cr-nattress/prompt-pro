"use client";

import { AlertTriangle, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { ANTI_PATTERNS } from "@/lib/data/anti-patterns";
import { LearnSearch } from "./learn-search";

export function AntiPatternGrid() {
	const [search, setSearch] = useState("");

	const filtered = ANTI_PATTERNS.filter(
		(p) =>
			p.title.toLowerCase().includes(search.toLowerCase()) ||
			p.summary.toLowerCase().includes(search.toLowerCase()),
	);

	return (
		<div className="flex flex-col gap-6">
			<LearnSearch
				placeholder="Search anti-patterns..."
				basePath="/learn/anti-patterns"
				onSearch={setSearch}
			/>
			<div className="grid gap-4 sm:grid-cols-2">
				{filtered.map((pattern) => (
					<Link
						key={pattern.slug}
						href={`/learn/anti-patterns/${pattern.slug}`}
					>
						<Card className="h-full transition-colors hover:border-destructive/50">
							<CardHeader className="pb-2">
								<CardTitle className="flex items-center gap-2 text-base">
									<AlertTriangle className="h-4 w-4 shrink-0 text-destructive" />
									{pattern.title}
								</CardTitle>
							</CardHeader>
							<CardContent>
								<CardDescription className="line-clamp-2">
									{pattern.summary}
								</CardDescription>
								<span className="mt-3 inline-flex items-center gap-1 text-primary text-xs">
									Learn more <ArrowRight className="h-3 w-3" />
								</span>
							</CardContent>
						</Card>
					</Link>
				))}
				{filtered.length === 0 && (
					<p className="col-span-2 py-8 text-center text-muted-foreground text-sm">
						No anti-patterns match your search.
					</p>
				)}
			</div>
		</div>
	);
}
