import { VERSION_STATUS_CONFIG, type VersionStatus } from "@/lib/version-utils";

interface StatusBadgeProps {
	status: VersionStatus;
	className?: string | undefined;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
	const config = VERSION_STATUS_CONFIG[status];
	if (!config) return null;

	return (
		<span
			className={`inline-flex items-center rounded-md px-1.5 py-0.5 font-medium text-xs ${className ?? ""}`}
			style={{
				backgroundColor: `color-mix(in oklch, var(${config.cssVar}) 15%, transparent)`,
				color: `var(${config.cssVar})`,
			}}
		>
			{config.label}
		</span>
	);
}
