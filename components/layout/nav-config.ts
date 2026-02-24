import {
	BarChart3,
	BookOpen,
	Boxes,
	FlaskConical,
	Globe,
	LayoutDashboard,
	type LucideIcon,
	ScrollText,
	Settings,
	Workflow,
} from "lucide-react";

export interface NavItem {
	title: string;
	href: string;
	icon: LucideIcon;
	shortcutKeys?: string[];
	disabled?: boolean;
}

export const mainNavItems: NavItem[] = [
	{
		title: "Dashboard",
		href: "/dashboard",
		icon: LayoutDashboard,
		shortcutKeys: ["G", "D"],
	},
	{
		title: "Prompts",
		href: "/prompts",
		icon: ScrollText,
		shortcutKeys: ["G", "P"],
	},
	{
		title: "Blueprints",
		href: "/blueprints",
		icon: Boxes,
		shortcutKeys: ["G", "B"],
	},
	{
		title: "Playground",
		href: "/playground",
		icon: FlaskConical,
		shortcutKeys: ["G", "G"],
	},
	{
		title: "Gallery",
		href: "/gallery",
		icon: Globe,
		shortcutKeys: ["G", "A"],
	},
	{
		title: "Analytics",
		href: "/analytics",
		icon: BarChart3,
		shortcutKeys: ["G", "N"],
	},
	{
		title: "Pipelines",
		href: "/pipelines",
		icon: Workflow,
		shortcutKeys: ["G", "I"],
	},
	{
		title: "Learn",
		href: "/learn",
		icon: BookOpen,
		shortcutKeys: ["G", "L"],
	},
];

export const bottomNavItems: NavItem[] = [
	{
		title: "Settings",
		href: "/settings",
		icon: Settings,
	},
];

export const mobileTabItems: NavItem[] = [
	{
		title: "Dashboard",
		href: "/dashboard",
		icon: LayoutDashboard,
	},
	{
		title: "Prompts",
		href: "/prompts",
		icon: ScrollText,
	},
	{
		title: "Blueprints",
		href: "/blueprints",
		icon: Boxes,
	},
	{
		title: "Learn",
		href: "/learn",
		icon: BookOpen,
	},
	{
		title: "Settings",
		href: "/settings",
		icon: Settings,
	},
];
