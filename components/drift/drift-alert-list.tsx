"use client";

import { DriftAlertBanner } from "@/components/drift/drift-alert-banner";

interface DriftAlert {
	alert: {
		id: string;
		similarityScore: string;
	};
	promptName: string;
	promptSlug: string;
}

interface DriftAlertListProps {
	alerts: DriftAlert[];
	onDismiss: (alertId: string) => Promise<boolean>;
}

export function DriftAlertList({ alerts, onDismiss }: DriftAlertListProps) {
	if (alerts.length === 0) return null;

	return (
		<div className="space-y-2">
			{alerts.map((item) => (
				<DriftAlertBanner
					key={item.alert.id}
					alertId={item.alert.id}
					promptName={item.promptName}
					promptSlug={item.promptSlug}
					similarityScore={Number(item.alert.similarityScore)}
					onDismiss={onDismiss}
				/>
			))}
		</div>
	);
}
