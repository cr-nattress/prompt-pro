"use client";

import { Boxes } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { bottomNavItems, mainNavItems } from "@/components/layout/nav-config";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarRail,
} from "@/components/ui/sidebar";

export function AppSidebar() {
	const pathname = usePathname();

	return (
		<Sidebar collapsible="icon">
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton size="lg" asChild tooltip="PromptVault">
							<Link href="/dashboard">
								<div className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-md">
									<Boxes className="size-4" />
								</div>
								<span className="font-semibold">PromptVault</span>
							</Link>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>

			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupContent>
						<SidebarMenu>
							{mainNavItems.map((item) => (
								<SidebarMenuItem key={item.href}>
									<SidebarMenuButton
										asChild={!item.disabled}
										isActive={pathname.startsWith(item.href)}
										tooltip={
											item.disabled ? { children: "Coming soon" } : item.title
										}
										className={
											item.disabled ? "opacity-50 cursor-not-allowed" : ""
										}
									>
										{item.disabled ? (
											<span>
												<item.icon />
												<span>{item.title}</span>
											</span>
										) : (
											<Link href={item.href}>
												<item.icon />
												<span>{item.title}</span>
											</Link>
										)}
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>

			<SidebarFooter>
				<SidebarMenu>
					{bottomNavItems.map((item) => (
						<SidebarMenuItem key={item.href}>
							<SidebarMenuButton
								asChild
								isActive={pathname.startsWith(item.href)}
								tooltip={item.title}
							>
								<Link href={item.href}>
									<item.icon />
									<span>{item.title}</span>
								</Link>
							</SidebarMenuButton>
						</SidebarMenuItem>
					))}
				</SidebarMenu>
			</SidebarFooter>

			<SidebarRail />
		</Sidebar>
	);
}
