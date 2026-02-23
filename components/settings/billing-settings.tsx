"use client";

import { Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatLimit, PLAN_LIMITS } from "@/lib/billing/limits";
import { cn } from "@/lib/utils";
import type { WorkspacePlan } from "@/types";

interface BillingSettingsProps {
	currentPlan: WorkspacePlan;
	analysisUsage: number;
}

const PLAN_FEATURES: Record<WorkspacePlan, string[]> = {
	free: [
		"25 prompts",
		"3 apps",
		"5 AI analyses / month",
		"500 API calls / month",
		"Community support",
	],
	pro: [
		"500 prompts",
		"25 apps",
		"100 AI analyses / month",
		"10,000 API calls / month",
		"5 team members",
		"Priority support",
	],
	team: [
		"Unlimited prompts",
		"Unlimited apps",
		"500 AI analyses / month",
		"100,000 API calls / month",
		"Unlimited team members",
		"Dedicated support",
		"SSO & audit logs",
	],
};

export function BillingSettings({
	currentPlan,
	analysisUsage,
}: BillingSettingsProps) {
	const limits = PLAN_LIMITS[currentPlan];

	return (
		<div className="flex flex-col gap-6">
			<Card>
				<CardHeader>
					<CardTitle>Current Plan</CardTitle>
					<CardDescription>
						You are on the <span className="font-semibold">{limits.label}</span>{" "}
						plan.
					</CardDescription>
				</CardHeader>
				<CardContent className="flex flex-col gap-4">
					<div className="flex items-center justify-between">
						<div>
							<p className="font-semibold text-2xl">
								${limits.priceMonthly}
								<span className="font-normal text-muted-foreground text-sm">
									/month
								</span>
							</p>
						</div>
						<Badge variant={currentPlan === "free" ? "secondary" : "default"}>
							{limits.label}
						</Badge>
					</div>
					<Separator />
					<div className="grid gap-3 text-sm sm:grid-cols-2">
						<div>
							<p className="text-muted-foreground">AI analyses used</p>
							<p className="font-medium">
								{analysisUsage} / {formatLimit(limits.analysesPerMonth)}
							</p>
						</div>
						<div>
							<p className="text-muted-foreground">Prompts limit</p>
							<p className="font-medium">{formatLimit(limits.maxPrompts)}</p>
						</div>
					</div>
				</CardContent>
			</Card>

			<div className="grid gap-4 md:grid-cols-3">
				{(Object.keys(PLAN_LIMITS) as WorkspacePlan[]).map((plan) => {
					const planLimits = PLAN_LIMITS[plan];
					const isCurrent = plan === currentPlan;
					const features = PLAN_FEATURES[plan];

					return (
						<Card key={plan} className={cn(isCurrent && "border-primary")}>
							<CardHeader>
								<div className="flex items-center justify-between">
									<CardTitle className="text-lg">{planLimits.label}</CardTitle>
									{isCurrent && <Badge variant="outline">Current</Badge>}
								</div>
								<CardDescription>
									<span className="font-semibold text-foreground text-2xl">
										${planLimits.priceMonthly}
									</span>
									<span className="text-muted-foreground">/month</span>
								</CardDescription>
							</CardHeader>
							<CardContent className="flex flex-col gap-4">
								<ul className="flex flex-col gap-2 text-sm">
									{features.map((feature) => (
										<li key={feature} className="flex items-center gap-2">
											<Check className="h-4 w-4 shrink-0 text-primary" />
											{feature}
										</li>
									))}
								</ul>
								{isCurrent ? (
									<Button variant="outline" disabled className="w-full">
										Current Plan
									</Button>
								) : (
									<Button
										variant={plan === "team" ? "default" : "outline"}
										className="w-full"
										disabled
									>
										{currentPlan === "free" ? "Upgrade" : "Change Plan"}
									</Button>
								)}
							</CardContent>
						</Card>
					);
				})}
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Billing History</CardTitle>
					<CardDescription>
						Stripe integration coming soon. You&apos;ll be able to manage your
						subscription and view invoices here.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<p className="text-muted-foreground text-sm">
						No billing history available.
					</p>
				</CardContent>
			</Card>
		</div>
	);
}
