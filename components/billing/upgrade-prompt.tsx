"use client";

import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

interface UpgradePromptProps {
	resource: string;
	current: number;
	limit: number;
}

export function UpgradePrompt({
	resource,
	current,
	limit,
}: UpgradePromptProps) {
	return (
		<Card className="border-amber-500/50 bg-amber-500/5">
			<CardHeader className="pb-3">
				<CardTitle className="text-base">{resource} limit reached</CardTitle>
				<CardDescription>
					You&apos;ve used {current} of {limit} {resource.toLowerCase()} on your
					current plan.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<Button asChild size="sm">
					<Link href="/settings/billing">
						Upgrade Plan
						<ArrowUpRight className="ml-1.5 h-3.5 w-3.5" />
					</Link>
				</Button>
			</CardContent>
		</Card>
	);
}
