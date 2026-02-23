"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { TECHNIQUES } from "@/lib/data/techniques";
import { LearnSearch } from "./learn-search";

export function TechniqueGrid() {
	const [search, setSearch] = useState("");

	const filtered = TECHNIQUES.filter(
		(t) =>
			t.title.toLowerCase().includes(search.toLowerCase()) ||
			t.summary.toLowerCase().includes(search.toLowerCase()),
	);

	return (
		<div className="flex flex-col gap-6">
			<LearnSearch
				placeholder="Search techniques..."
				basePath="/learn"
				onSearch={setSearch}
			/>
			<div className="grid gap-4 sm:grid-cols-2">
				{filtered.map((technique) => (
					<Link key={technique.slug} href={`/learn/${technique.slug}`}>
						<Card className="h-full transition-colors hover:border-primary/50">
							<CardHeader className="pb-2">
								<CardTitle className="text-base">{technique.title}</CardTitle>
							</CardHeader>
							<CardContent>
								<CardDescription className="line-clamp-2">
									{technique.summary}
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
						No techniques match your search.
					</p>
				)}
			</div>
		</div>
	);
}
