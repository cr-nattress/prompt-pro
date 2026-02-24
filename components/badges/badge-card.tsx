import {
	Award,
	Building,
	Flag,
	GraduationCap,
	Layers,
	type LucideIcon,
	Puzzle,
	Rocket,
	ScrollText,
	Star,
	Trophy,
	Zap,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface BadgeCardProps {
	title: string;
	description: string;
	icon: string;
	earnedAt?: string | null | undefined;
	isLocked?: boolean | undefined;
}

const ICON_MAP: Record<string, LucideIcon> = {
	"graduation-cap": GraduationCap,
	award: Award,
	layers: Layers,
	puzzle: Puzzle,
	rocket: Rocket,
	building: Building,
	zap: Zap,
	flag: Flag,
	star: Star,
	trophy: Trophy,
	"scroll-text": ScrollText,
};

export function BadgeCard({
	title,
	description,
	icon,
	earnedAt,
	isLocked = false,
}: BadgeCardProps) {
	const Icon = ICON_MAP[icon] ?? Award;

	return (
		<Card className={cn("transition-colors", isLocked && "opacity-40")}>
			<CardContent className="flex items-center gap-3 pt-4">
				<div
					className={cn(
						"flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
						isLocked
							? "bg-muted text-muted-foreground"
							: "bg-primary/10 text-primary",
					)}
				>
					<Icon className="h-5 w-5" />
				</div>
				<div className="min-w-0">
					<p className="font-medium text-sm">{title}</p>
					<p className="truncate text-muted-foreground text-xs">
						{isLocked
							? description
							: earnedAt
								? `Earned ${new Date(earnedAt).toLocaleDateString()}`
								: description}
					</p>
				</div>
			</CardContent>
		</Card>
	);
}
