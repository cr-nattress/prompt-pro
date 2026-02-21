import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

export const PromptEditor = dynamic(() => import("./prompt-editor"), {
	ssr: false,
	loading: () => Skeleton({ className: "h-[400px] w-full rounded-md" }),
});
