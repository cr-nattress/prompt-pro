import { requireAuth } from "@/lib/auth";

export default async function DashboardPage() {
	const { user, workspace } = await requireAuth();

	return (
		<div className="flex min-h-screen flex-col items-center justify-center gap-4 p-8">
			<h1 className="font-bold text-2xl">Dashboard</h1>
			<p className="text-muted-foreground">
				Welcome, {user.name}! You are in the{" "}
				<span className="font-medium text-foreground">{workspace.name}</span>{" "}
				workspace.
			</p>
		</div>
	);
}
