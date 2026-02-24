"use client";

import { ArrowLeft, Check, ClipboardCopy, X } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { PromptPattern } from "@/lib/data/prompt-patterns";
import { showToast } from "@/lib/toast";

const CATEGORY_COLORS: Record<string, string> = {
	reasoning: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
	structure: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
	output: "bg-green-500/10 text-green-600 dark:text-green-400",
	meta: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
};

interface PatternDetailProps {
	pattern: PromptPattern;
}

export function PatternDetail({ pattern }: PatternDetailProps) {
	function handleCopy(text: string, label: string) {
		navigator.clipboard.writeText(text).then(() => {
			showToast("success", `${label} copied to clipboard`);
		});
	}

	return (
		<div className="flex flex-col gap-6">
			<div>
				<Button variant="ghost" size="sm" asChild className="mb-2">
					<Link href="/learn/patterns">
						<ArrowLeft className="mr-1.5 h-4 w-4" />
						Back to Patterns
					</Link>
				</Button>
				<div className="flex items-center gap-2">
					<h2 className="font-bold text-2xl">{pattern.title}</h2>
					<Badge
						variant="outline"
						className={CATEGORY_COLORS[pattern.category] ?? ""}
					>
						{pattern.category}
					</Badge>
				</div>
				<p className="mt-1 text-muted-foreground">{pattern.description}</p>
			</div>

			<div className="grid gap-4 md:grid-cols-2">
				<Card>
					<CardHeader className="pb-3">
						<CardTitle className="flex items-center gap-2 text-base">
							<Check className="h-4 w-4 text-green-500" />
							When to Use
						</CardTitle>
					</CardHeader>
					<CardContent>
						<ul className="flex flex-col gap-2 text-sm">
							{pattern.whenToUse.map((item) => (
								<li key={item} className="flex gap-2">
									<span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-green-500" />
									{item}
								</li>
							))}
						</ul>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="pb-3">
						<CardTitle className="flex items-center gap-2 text-base">
							<X className="h-4 w-4 text-red-500" />
							When NOT to Use
						</CardTitle>
					</CardHeader>
					<CardContent>
						<ul className="flex flex-col gap-2 text-sm">
							{pattern.whenNotToUse.map((item) => (
								<li key={item} className="flex gap-2">
									<span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-red-500" />
									{item}
								</li>
							))}
						</ul>
					</CardContent>
				</Card>
			</div>

			{/* Template */}
			<Card>
				<CardHeader className="pb-3">
					<div className="flex items-center justify-between">
						<CardTitle className="text-base">Template</CardTitle>
						<Button
							variant="outline"
							size="sm"
							onClick={() => handleCopy(pattern.template, "Template")}
						>
							<ClipboardCopy className="mr-1.5 h-3.5 w-3.5" />
							Copy
						</Button>
					</div>
				</CardHeader>
				<CardContent>
					<pre className="whitespace-pre-wrap rounded-md bg-muted p-4 font-mono text-sm leading-relaxed">
						{pattern.template}
					</pre>
				</CardContent>
			</Card>

			{/* Example */}
			<Card>
				<CardHeader className="pb-3">
					<div className="flex items-center justify-between">
						<CardTitle className="text-base">Filled Example</CardTitle>
						<Button
							variant="outline"
							size="sm"
							onClick={() => handleCopy(pattern.example, "Example")}
						>
							<ClipboardCopy className="mr-1.5 h-3.5 w-3.5" />
							Copy
						</Button>
					</div>
				</CardHeader>
				<CardContent>
					<pre className="whitespace-pre-wrap rounded-md bg-muted p-4 font-mono text-sm leading-relaxed">
						{pattern.example}
					</pre>
				</CardContent>
			</Card>
		</div>
	);
}
