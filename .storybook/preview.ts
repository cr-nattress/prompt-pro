import type { Preview } from "@storybook/react-vite";
import "../app/globals.css";

const preview: Preview = {
	parameters: {
		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/i,
			},
		},
		a11y: {
			test: "todo",
		},
		backgrounds: {
			default: "dark",
			values: [
				{ name: "dark", value: "oklch(0.145 0 0)" },
				{ name: "light", value: "oklch(1 0 0)" },
			],
		},
	},
	decorators: [
		(Story) => {
			document.documentElement.classList.add("dark");
			return Story();
		},
	],
};

export default preview;
