import type { StorybookConfig } from "@storybook/react-vite";
import path from "node:path";

const config: StorybookConfig = {
	stories: ["../components/**/*.stories.@(ts|tsx)"],
	addons: [
		"@chromatic-com/storybook",
		"@storybook/addon-vitest",
		"@storybook/addon-a11y",
		"@storybook/addon-docs",
		"@storybook/addon-onboarding",
	],
	framework: "@storybook/react-vite",
	viteFinal: async (config) => {
		config.resolve = config.resolve || {};
		config.resolve.alias = {
			...config.resolve.alias,
			"@": path.resolve(__dirname, ".."),
		};
		return config;
	},
};
export default config;
