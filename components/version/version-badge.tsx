import { Badge } from "@/components/ui/badge";
import { formatVersionLabel } from "@/lib/version-utils";

interface VersionBadgeProps {
	version: number;
	className?: string | undefined;
}

export function VersionBadge({ version, className }: VersionBadgeProps) {
	return (
		<Badge variant="outline" className={className}>
			{formatVersionLabel(version)}
		</Badge>
	);
}
