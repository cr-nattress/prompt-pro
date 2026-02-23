import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
	return (
		<div className="flex flex-col items-center justify-center gap-4 py-20">
			<h1 className="font-bold text-6xl text-muted-foreground">404</h1>
			<h2 className="font-semibold text-xl">Page not found</h2>
			<p className="max-w-md text-center text-muted-foreground">
				The page you&apos;re looking for doesn&apos;t exist or has been moved.
			</p>
			<Button asChild>
				<Link href="/dashboard">
					<ArrowLeft className="mr-2 h-4 w-4" />
					Back to Dashboard
				</Link>
			</Button>
		</div>
	);
}
