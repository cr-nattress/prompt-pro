"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

const SEQUENCE_TIMEOUT = 500;

const GO_SEQUENCES: Record<string, string> = {
	d: "/dashboard",
	p: "/prompts",
	b: "/blueprints",
	l: "/learn",
};

function isInputTarget(target: EventTarget | null): boolean {
	if (!target || !(target instanceof HTMLElement)) return false;
	const tag = target.tagName;
	return (
		tag === "INPUT" ||
		tag === "TEXTAREA" ||
		tag === "SELECT" ||
		target.isContentEditable
	);
}

export function useKeyboardShortcuts() {
	const router = useRouter();
	const pendingKey = useRef<string | null>(null);
	const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	useEffect(() => {
		function handleKeyDown(e: KeyboardEvent) {
			if (isInputTarget(e.target)) return;

			// Cmd/Ctrl shortcuts
			if (e.metaKey || e.ctrlKey) {
				if (e.key === "n" && !e.shiftKey) {
					e.preventDefault();
					router.push("/prompts/new");
					return;
				}
				if (e.key === "N" && e.shiftKey) {
					e.preventDefault();
					router.push("/blueprints/new");
					return;
				}
				if (e.key === ",") {
					e.preventDefault();
					router.push("/settings");
					return;
				}
				// Cmd+K and Cmd+\ handled by their own components
				return;
			}

			// Two-key "G then letter" sequences
			const key = e.key.toLowerCase();

			if (pendingKey.current === "g") {
				pendingKey.current = null;
				if (timeoutRef.current) {
					clearTimeout(timeoutRef.current);
					timeoutRef.current = null;
				}
				const route = GO_SEQUENCES[key];
				if (route) {
					e.preventDefault();
					router.push(route);
				}
				return;
			}

			if (key === "g") {
				pendingKey.current = "g";
				timeoutRef.current = setTimeout(() => {
					pendingKey.current = null;
					timeoutRef.current = null;
				}, SEQUENCE_TIMEOUT);
			}
		}

		window.addEventListener("keydown", handleKeyDown);
		return () => {
			window.removeEventListener("keydown", handleKeyDown);
			if (timeoutRef.current) clearTimeout(timeoutRef.current);
		};
	}, [router]);
}
