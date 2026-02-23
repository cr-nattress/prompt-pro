"use client";

import Link from "next/link";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { GLOSSARY } from "@/lib/data/glossary";
import { LearnSearch } from "./learn-search";

export function GlossaryList() {
	const [search, setSearch] = useState("");

	const sorted = [...GLOSSARY].sort((a, b) => a.term.localeCompare(b.term));

	const filtered = sorted.filter(
		(g) =>
			g.term.toLowerCase().includes(search.toLowerCase()) ||
			g.definition.toLowerCase().includes(search.toLowerCase()),
	);

	return (
		<div className="flex flex-col gap-6">
			<LearnSearch
				placeholder="Search glossary..."
				basePath="/learn/glossary"
				onSearch={setSearch}
			/>
			<div className="flex flex-col gap-4">
				{filtered.map((term) => (
					<div
						key={term.slug}
						className="flex flex-col gap-1 rounded-lg border p-4"
					>
						<div className="flex items-center gap-2">
							<h3 className="font-semibold text-sm">{term.term}</h3>
							{term.relatedSlug && (
								<Link href={`/learn/${term.relatedSlug}`}>
									<Badge variant="outline" className="cursor-pointer text-xs">
										Related
									</Badge>
								</Link>
							)}
						</div>
						<p className="text-muted-foreground text-sm">{term.definition}</p>
					</div>
				))}
				{filtered.length === 0 && (
					<p className="py-8 text-center text-muted-foreground text-sm">
						No terms match your search.
					</p>
				)}
			</div>
		</div>
	);
}
