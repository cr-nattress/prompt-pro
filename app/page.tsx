import { SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";

export default function Home() {
	return (
		<div className="flex min-h-screen items-center justify-center">
			<div className="text-center">
				<h1 className="text-4xl font-bold tracking-tight">PromptVault</h1>
				<p className="mt-2 text-muted-foreground">
					Build better prompts, faster.
				</p>
				<div className="mt-6 flex items-center justify-center gap-3">
					<SignedOut>
						<Link
							href="/login"
							className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-6 font-medium text-primary-foreground text-sm transition-colors hover:bg-primary/90"
						>
							Sign In
						</Link>
						<Link
							href="/signup"
							className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-6 font-medium text-sm transition-colors hover:bg-accent hover:text-accent-foreground"
						>
							Sign Up
						</Link>
					</SignedOut>
					<SignedIn>
						<Link
							href="/dashboard"
							className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-6 font-medium text-primary-foreground text-sm transition-colors hover:bg-primary/90"
						>
							Go to Dashboard
						</Link>
					</SignedIn>
				</div>
			</div>
		</div>
	);
}
