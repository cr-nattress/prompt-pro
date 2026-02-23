"use client";

interface StepIndicatorProps {
	currentStep: number;
	totalSteps: number;
	labels: string[];
}

export function StepIndicator({
	currentStep,
	totalSteps,
	labels,
}: StepIndicatorProps) {
	return (
		<div className="flex items-center gap-1">
			{Array.from({ length: totalSteps }, (_, i) => (
				<div key={labels[i]} className="flex items-center gap-1">
					{i > 0 && (
						<div
							className={`h-0.5 w-6 rounded-full transition-colors ${
								i <= currentStep ? "bg-primary" : "bg-muted"
							}`}
						/>
					)}
					<div className="flex flex-col items-center gap-1">
						<div
							className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-medium transition-colors ${
								i < currentStep
									? "bg-primary text-primary-foreground"
									: i === currentStep
										? "bg-primary text-primary-foreground"
										: "bg-muted text-muted-foreground"
							}`}
						>
							{i + 1}
						</div>
						<span
							className={`hidden text-xs md:block ${
								i === currentStep
									? "font-medium text-foreground"
									: "text-muted-foreground"
							}`}
						>
							{labels[i]}
						</span>
					</div>
				</div>
			))}
		</div>
	);
}
