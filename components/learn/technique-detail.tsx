import { ArrowLeft, Check, X } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Technique } from "@/lib/data/techniques";

interface TechniqueDetailProps {
	technique: Technique;
}

export function TechniqueDetail({ technique }: TechniqueDetailProps) {
	return (
		<div className="flex flex-col gap-6">
			<div>
				<Button variant="ghost" size="sm" asChild className="mb-2">
					<Link href="/learn">
						<ArrowLeft className="mr-1.5 h-4 w-4" />
						Back to Techniques
					</Link>
				</Button>
				<h2 className="font-bold text-2xl">{technique.title}</h2>
				<p className="mt-1 text-muted-foreground">{technique.summary}</p>
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
							{technique.whenToUse.map((item) => (
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
							{technique.whenNotToUse.map((item) => (
								<li key={item} className="flex gap-2">
									<span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-red-500" />
									{item}
								</li>
							))}
						</ul>
					</CardContent>
				</Card>
			</div>

			<Card>
				<CardHeader className="pb-3">
					<CardTitle className="text-base">Basic Example</CardTitle>
				</CardHeader>
				<CardContent className="flex flex-col gap-4">
					<div>
						<Badge variant="outline" className="mb-2">
							Before
						</Badge>
						<pre className="overflow-x-auto whitespace-pre-wrap rounded-md bg-muted p-4 font-mono text-sm">
							{technique.basicExample.before}
						</pre>
					</div>
					<div>
						<Badge className="mb-2">After</Badge>
						<pre className="overflow-x-auto whitespace-pre-wrap rounded-md bg-muted p-4 font-mono text-sm">
							{technique.basicExample.after}
						</pre>
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardHeader className="pb-3">
					<CardTitle className="text-base">Advanced Example</CardTitle>
				</CardHeader>
				<CardContent>
					<pre className="overflow-x-auto whitespace-pre-wrap rounded-md bg-muted p-4 font-mono text-sm">
						{technique.advancedExample}
					</pre>
				</CardContent>
			</Card>

			<Card>
				<CardHeader className="pb-3">
					<CardTitle className="text-base">Model Compatibility Notes</CardTitle>
				</CardHeader>
				<CardContent>
					<p className="text-sm">{technique.modelNotes}</p>
				</CardContent>
			</Card>
		</div>
	);
}
