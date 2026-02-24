export default function OnboardingLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="flex min-h-screen flex-col items-center bg-background py-8 sm:justify-center">
			<div className="w-full max-w-2xl px-4">{children}</div>
		</div>
	);
}
