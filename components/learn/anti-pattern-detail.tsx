import { AlertTriangle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { AntiPattern } from "@/lib/data/anti-patterns";
import { getTechnique } from "@/lib/data/techniques";

interface AntiPatternDetailProps {
	antiPattern: AntiPattern;
}

export function AntiPatternDetail({ antiPattern }: AntiPatternDetailProps) {
	return (
		<div className="flex flex-col gap-6">
			<div>
				<Button variant="ghost" size="sm" asChild className="mb-2">
					<Link href="/learn/anti-patterns">
						<ArrowLeft className="mr-1.5 h-4 w-4" />
						Back to Anti-Patterns
					</Link>
				</Button>
				<h2 className="flex items-center gap-2 font-bold text-2xl">
					<AlertTriangle className="h-6 w-6 text-destructive" />
					{antiPattern.title}
				</h2>
				<p className="mt-1 text-muted-foreground">{antiPattern.summary}</p>
			</div>

			<Card>
				<CardHeader className="pb-3">
					<CardTitle className="text-base">What it looks like</CardTitle>
				</CardHeader>
				<CardContent>
					<p className="text-sm">{antiPattern.whatItLooksLike}</p>
				</CardContent>
			</Card>

			<Card>
				<CardHeader className="pb-3">
					<CardTitle className="text-base">Why it&apos;s a problem</CardTitle>
				</CardHeader>
				<CardContent>
					<p className="text-sm">{antiPattern.whyItsProblem}</p>
				</CardContent>
			</Card>

			<Card>
				<CardHeader className="pb-3">
					<CardTitle className="text-base">How to fix it</CardTitle>
				</CardHeader>
				<CardContent>
					<p className="text-sm">{antiPattern.howToFix}</p>
				</CardContent>
			</Card>

			<div className="grid gap-4 md:grid-cols-2">
				<Card className="border-destructive/30">
					<CardHeader className="pb-3">
						<CardTitle className="text-base">
							<Badge variant="destructive" className="mr-2">
								Bad
							</Badge>
							Example
						</CardTitle>
					</CardHeader>
					<CardContent>
						<pre className="overflow-x-auto whitespace-pre-wrap rounded-md bg-muted p-4 font-mono text-sm">
							{antiPattern.badExample}
						</pre>
					</CardContent>
				</Card>

				<Card className="border-green-500/30">
					<CardHeader className="pb-3">
						<CardTitle className="text-base">
							<Badge className="mr-2 bg-green-600 hover:bg-green-700">
								Good
							</Badge>
							Example
						</CardTitle>
					</CardHeader>
					<CardContent>
						<pre className="overflow-x-auto whitespace-pre-wrap rounded-md bg-muted p-4 font-mono text-sm">
							{antiPattern.goodExample}
						</pre>
					</CardContent>
				</Card>
			</div>

			{antiPattern.relatedTechniques.length > 0 && (
				<Card>
					<CardHeader className="pb-3">
						<CardTitle className="text-base">Related Techniques</CardTitle>
					</CardHeader>
					<CardContent className="flex flex-wrap gap-2">
						{antiPattern.relatedTechniques.map((slug) => {
							const technique = getTechnique(slug);
							if (!technique) return null;
							return (
								<Link key={slug} href={`/learn/${slug}`}>
									<Badge variant="outline" className="cursor-pointer">
										{technique.title}
									</Badge>
								</Link>
							);
						})}
					</CardContent>
				</Card>
			)}
		</div>
	);
}
