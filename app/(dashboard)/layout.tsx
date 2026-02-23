import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { CommandPalette } from "@/components/layout/command-palette";
import { Header } from "@/components/layout/header";
import { KeyboardShortcuts } from "@/components/layout/keyboard-shortcuts";
import { MobileTabBar } from "@/components/layout/mobile-tab-bar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { requireAuth } from "@/lib/auth";

export default async function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const { user, workspace } = await requireAuth();

	if (!user.onboardingComplete) {
		redirect("/onboarding");
	}

	const cookieStore = await cookies();
	const sidebarState = cookieStore.get("sidebar_state")?.value;
	const defaultOpen = sidebarState !== "false";

	return (
		<SidebarProvider defaultOpen={defaultOpen}>
			<AppSidebar />
			<SidebarInset>
				<Header workspaceName={workspace.name} />
				<main
					id="main-content"
					className="flex-1 overflow-auto p-4 pb-20 md:p-6 md:pb-0"
				>
					{children}
				</main>
			</SidebarInset>
			<MobileTabBar />
			<CommandPalette />
			<KeyboardShortcuts />
		</SidebarProvider>
	);
}
