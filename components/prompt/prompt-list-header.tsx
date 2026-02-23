import { Plus, Wand2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface PromptListHeaderProps {
	count: number;
}

export function PromptListHeader({ count }: PromptListHeaderProps) {
	return (
		<>
			<div className="flex items-center justify-between">
				<h1 className="font-bold text-2xl">
					Prompts{" "}
					<span className="font-normal text-muted-foreground">({count})</span>
				</h1>
				<div className="hidden items-center gap-2 md:flex">
					<Button asChild variant="outline">
						<Link href="/prompts/new?mode=guided">
							<Wand2 className="mr-2 h-4 w-4" />
							Guided Builder
						</Link>
					</Button>
					<Button asChild>
						<Link href="/prompts/new">
							<Plus className="mr-2 h-4 w-4" />
							New Prompt
						</Link>
					</Button>
				</div>
			</div>

			{/* Mobile FAB */}
			<Button
				asChild
				size="icon-lg"
				className="fixed bottom-20 right-4 z-40 shadow-lg md:hidden"
			>
				<Link href="/prompts/new">
					<Plus className="h-5 w-5" />
					<span className="sr-only">New Prompt</span>
				</Link>
			</Button>
		</>
	);
}
