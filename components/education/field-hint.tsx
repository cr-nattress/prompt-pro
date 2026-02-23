"use client";

import { Info } from "lucide-react";
import Link from "next/link";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";

interface FieldHintProps {
	hint: string;
	learnMoreSlug?: string | null | undefined;
}

export function FieldHint({ hint, learnMoreSlug }: FieldHintProps) {
	return (
		<TooltipProvider delayDuration={200}>
			<Tooltip>
				<TooltipTrigger asChild>
					<button
						type="button"
						className="inline-flex h-4 w-4 shrink-0 items-center justify-center text-muted-foreground hover:text-foreground"
					>
						<Info className="h-3.5 w-3.5" />
						<span className="sr-only">Field hint</span>
					</button>
				</TooltipTrigger>
				<TooltipContent side="top" className="max-w-xs text-sm">
					<p>{hint}</p>
					{learnMoreSlug && (
						<Link
							href={`/learn/${learnMoreSlug}`}
							className="mt-1 block text-xs text-primary hover:underline"
						>
							Learn more
						</Link>
					)}
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
}
