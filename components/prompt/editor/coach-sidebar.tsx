"use client";

import {
	AlertTriangle,
	Brain,
	ChevronRight,
	Lightbulb,
	Loader2,
	Puzzle,
	Shield,
	Sparkles,
	Target,
	X,
	Zap,
} from "lucide-react";
import { useCallback, useEffect, useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	type CoachMode,
	type CoachSuggestion,
	useCoachStore,
} from "@/stores/coach-store";

interface CoachSidebarProps {
	promptText: string;
	targetModel?: string | undefined;
	onInsertSnippet?: (snippet: string) => void;
}

const SUGGESTION_ICONS: Record<CoachSuggestion["type"], typeof Brain> = {
	missing_element: Puzzle,
	technique: Lightbulb,
	complexity: AlertTriangle,
	anti_pattern: Shield,
	model_fit: Target,
	improvement: Sparkles,
};

const PRIORITY_COLORS: Record<CoachSuggestion["priority"], string> = {
	high: "bg-red-500/10 text-red-600 dark:text-red-400",
	medium: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
	low: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
};

export function CoachSidebar({
	promptText,
	targetModel,
	onInsertSnippet,
}: CoachSidebarProps) {
	const {
		mode,
		suggestions,
		dismissedIds,
		isLoading,
		error,
		setMode,
		setSuggestions,
		dismissSuggestion,
		setLoading,
		setError,
		reset,
	} = useCoachStore();
	const debounceRef = useRef<ReturnType<typeof setTimeout>>(null);
	const abortRef = useRef<AbortController>(null);
	const lastTextRef = useRef<string>("");

	const fetchSuggestions = useCallback(
		async (text: string) => {
			if (abortRef.current) abortRef.current.abort();

			const controller = new AbortController();
			abortRef.current = controller;
			setLoading(true);

			try {
				const response = await fetch("/api/coach", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						promptText: text,
						targetModel,
					}),
					signal: controller.signal,
				});

				if (!response.ok) {
					throw new Error("Coach analysis failed");
				}

				const data = await response.json();
				if (data.suggestions) {
					setSuggestions(data.suggestions);
				}
			} catch (err) {
				if (err instanceof Error && err.name !== "AbortError") {
					setError(err.message);
				}
			}
		},
		[targetModel, setSuggestions, setLoading, setError],
	);

	// Debounced fetch — 3s after text changes
	useEffect(() => {
		if (mode === "off" || !promptText.trim()) return;
		// Skip if text hasn't actually changed
		if (promptText === lastTextRef.current) return;
		lastTextRef.current = promptText;

		if (debounceRef.current) clearTimeout(debounceRef.current);
		debounceRef.current = setTimeout(() => {
			fetchSuggestions(promptText);
		}, 3000);

		return () => {
			if (debounceRef.current) clearTimeout(debounceRef.current);
		};
	}, [promptText, mode, fetchSuggestions]);

	// Reset on unmount
	useEffect(() => {
		return () => {
			reset();
			if (abortRef.current) abortRef.current.abort();
		};
	}, [reset]);

	if (mode === "off") {
		return (
			<div className="flex flex-col items-center gap-3 px-4 py-8 text-center">
				<Brain className="h-8 w-8 text-muted-foreground" />
				<p className="text-muted-foreground text-sm">Coach is off</p>
				<Button size="sm" variant="outline" onClick={() => setMode("active")}>
					Enable Coach
				</Button>
			</div>
		);
	}

	const visibleSuggestions = suggestions.filter((s) => !dismissedIds.has(s.id));

	return (
		<div className="flex h-full flex-col">
			<div className="flex items-center justify-between border-b px-4 py-2">
				<div className="flex items-center gap-2">
					<Brain className="h-4 w-4 text-primary" />
					<span className="font-medium text-sm">Coach</span>
				</div>
				<Select value={mode} onValueChange={(v) => setMode(v as CoachMode)}>
					<SelectTrigger className="h-7 w-24 text-xs">
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="active">Active</SelectItem>
						<SelectItem value="subtle">Subtle</SelectItem>
						<SelectItem value="off">Off</SelectItem>
					</SelectContent>
				</Select>
			</div>

			<div className="flex-1 overflow-auto">
				{isLoading && (
					<div className="flex items-center gap-2 px-4 py-3 text-muted-foreground text-sm">
						<Loader2 className="h-4 w-4 animate-spin" />
						Analyzing prompt...
					</div>
				)}

				{error && (
					<div className="px-4 py-3 text-destructive text-sm">{error}</div>
				)}

				{!isLoading && !error && visibleSuggestions.length === 0 && (
					<div className="px-4 py-6 text-center text-muted-foreground text-sm">
						{suggestions.length > 0
							? "All suggestions dismissed"
							: promptText.trim()
								? "Analyzing after you pause typing..."
								: "Start writing to get coaching suggestions"}
					</div>
				)}

				{mode === "active" && (
					<div className="flex flex-col gap-2 p-3">
						{visibleSuggestions.map((suggestion) => {
							const Icon = SUGGESTION_ICONS[suggestion.type];
							return (
								<div
									key={suggestion.id}
									className="rounded-lg border bg-card p-3"
								>
									<div className="flex items-start justify-between gap-2">
										<div className="flex items-start gap-2">
											<Icon className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
											<div className="flex flex-col gap-1">
												<div className="flex items-center gap-2">
													<span className="font-medium text-sm">
														{suggestion.title}
													</span>
													<Badge
														variant="outline"
														className={`text-xs ${PRIORITY_COLORS[suggestion.priority]}`}
													>
														{suggestion.priority}
													</Badge>
												</div>
												<p className="text-muted-foreground text-xs">
													{suggestion.description}
												</p>
											</div>
										</div>
										<Button
											variant="ghost"
											size="icon-sm"
											onClick={() => dismissSuggestion(suggestion.id)}
											className="shrink-0"
										>
											<X className="h-3 w-3" />
										</Button>
									</div>
									{suggestion.snippet && onInsertSnippet && (
										<Button
											variant="outline"
											size="sm"
											className="mt-2 w-full text-xs"
											onClick={() =>
												onInsertSnippet(suggestion.snippet as string)
											}
										>
											<ChevronRight className="mr-1 h-3 w-3" />
											Insert suggestion
										</Button>
									)}
								</div>
							);
						})}
					</div>
				)}

				{mode === "subtle" && (
					<div className="flex flex-col gap-1 p-3">
						{visibleSuggestions.map((suggestion) => {
							const Icon = SUGGESTION_ICONS[suggestion.type];
							return (
								<div
									key={suggestion.id}
									className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-muted/50"
								>
									<Icon className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
									<span className="flex-1 truncate text-xs">
										{suggestion.title}
									</span>
									<Zap
										className={`h-3 w-3 shrink-0 ${
											suggestion.priority === "high"
												? "text-red-500"
												: suggestion.priority === "medium"
													? "text-amber-500"
													: "text-blue-500"
										}`}
									/>
									<Button
										variant="ghost"
										size="icon-sm"
										onClick={() => dismissSuggestion(suggestion.id)}
										className="h-5 w-5 shrink-0"
									>
										<X className="h-2.5 w-2.5" />
									</Button>
								</div>
							);
						})}
					</div>
				)}
			</div>
		</div>
	);
}
