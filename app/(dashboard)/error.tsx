"use client";

import { AlertTriangle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

export default function DashboardError({
	error,
	reset,
}: {
	error: Error & { digest?: string | undefined };
	reset: () => void;
}) {
	return (
		<div className="flex flex-col items-center justify-center py-20">
			<Card className="max-w-md">
				<CardHeader className="text-center">
					<div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
						<AlertTriangle className="h-6 w-6 text-destructive" />
					</div>
					<CardTitle>Something went wrong</CardTitle>
					<CardDescription>
						An unexpected error occurred. Please try again.
					</CardDescription>
				</CardHeader>
				<CardContent className="flex flex-col items-center gap-3">
					{error.message && (
						<p
							className="rounded-md bg-muted px-3 py-2 text-center text-muted-foreground text-sm"
							role="alert"
						>
							{error.message}
						</p>
					)}
					<Button onClick={reset}>
						<RotateCcw className="mr-2 h-4 w-4" />
						Try Again
					</Button>
				</CardContent>
			</Card>
		</div>
	);
}
