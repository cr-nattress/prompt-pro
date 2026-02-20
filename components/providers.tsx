"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";

// Cast required due to exactOptionalPropertyTypes incompatibility with Clerk's theme types
const baseTheme = dark as Parameters<
	typeof ClerkProvider
>[0]["appearance"] extends { baseTheme?: infer T } | undefined
	? T
	: never;

export function Providers({ children }: { children: React.ReactNode }) {
	return (
		<ClerkProvider
			appearance={{
				baseTheme,
				variables: {
					colorPrimary: "oklch(0.922 0 0)",
					colorBackground: "oklch(0.205 0 0)",
					colorText: "oklch(0.985 0 0)",
					colorInputBackground: "oklch(0.269 0 0)",
					colorInputText: "oklch(0.985 0 0)",
					borderRadius: "0.625rem",
					fontFamily: "var(--font-sans)",
					fontFamilyButtons: "var(--font-sans)",
				},
				elements: {
					card: "bg-card border border-border shadow-lg",
					formButtonPrimary:
						"bg-primary text-primary-foreground hover:bg-primary/90",
					formFieldInput: "bg-secondary border-border text-foreground",
					socialButtonsBlockButton:
						"bg-secondary border-border text-foreground hover:bg-accent",
					footerActionLink: "text-primary hover:text-primary/80",
				},
			}}
		>
			<ThemeProvider
				attribute="class"
				defaultTheme="dark"
				disableTransitionOnChange
			>
				{children}
				<Toaster />
			</ThemeProvider>
		</ClerkProvider>
	);
}
