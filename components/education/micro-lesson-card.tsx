"use client";

import { Lightbulb, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface MicroLessonCardProps {
	id: string;
	title: string;
	body: string;
	learnMoreSlug?: string | null | undefined;
	onDismiss?: ((lessonId: string) => void) | undefined;
	className?: string | undefined;
}

export function MicroLessonCard({
	id,
	title,
	body,
	learnMoreSlug,
	onDismiss,
	className,
}: MicroLessonCardProps) {
	const [dismissed, setDismissed] = useState(false);

	if (dismissed) return null;

	function handleDismiss() {
		setDismissed(true);
		onDismiss?.(id);
	}

	return (
		<div
			className={cn(
				"flex gap-3 rounded-lg border border-primary/20 bg-primary/5 p-4",
				className,
			)}
		>
			<Lightbulb className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
			<div className="flex-1">
				<p className="font-medium text-sm">{title}</p>
				<p className="mt-1 text-muted-foreground text-sm">{body}</p>
				{learnMoreSlug && (
					<Link
						href={`/learn/${learnMoreSlug}`}
						className="mt-2 inline-block text-primary text-xs hover:underline"
					>
						Learn more
					</Link>
				)}
			</div>
			<button
				type="button"
				onClick={handleDismiss}
				className="shrink-0 text-muted-foreground hover:text-foreground"
			>
				<X className="h-4 w-4" />
				<span className="sr-only">Dismiss tip</span>
			</button>
		</div>
	);
}
