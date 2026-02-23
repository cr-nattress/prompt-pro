import { LearnNav } from "@/components/learn/learn-nav";

export default function LearnLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="flex flex-col gap-6">
			<h1 className="font-bold text-2xl">Learn</h1>
			<div className="flex flex-col gap-8 md:flex-row">
				<LearnNav />
				<div className="min-w-0 flex-1">{children}</div>
			</div>
		</div>
	);
}
