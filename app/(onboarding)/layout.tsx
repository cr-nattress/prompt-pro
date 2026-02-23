export default function OnboardingLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="flex min-h-screen flex-col items-center justify-center bg-background">
			<div className="w-full max-w-2xl px-4">{children}</div>
		</div>
	);
}
