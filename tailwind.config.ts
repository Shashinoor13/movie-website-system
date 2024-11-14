import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./components/**/*.{js,ts,jsx,tsx,mdx}",
		"./app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			colors: {
				background: 'hsl(0, 0%, 0%)', // Black background
				foreground: 'hsl(0, 0%, 100%)', // White foreground
				card: {
					DEFAULT: 'hsl(0, 0%, 15%)', // Darker shade for cards
					foreground: 'hsl(0, 0%, 95%)', // Light foreground for cards
				},
				popover: {
					DEFAULT: 'hsl(0, 0%, 20%)', // Dark popover
					foreground: 'hsl(0, 0%, 95%)', // Light foreground
				},
				primary: {
					DEFAULT: 'hsl(0, 100%, 50%)', // Red primary color
					foreground: 'hsl(0, 0%, 100%)', // White text on red
				},
				secondary: {
					DEFAULT: 'hsl(0, 0%, 100%)', // White as secondary
					foreground: 'hsl(0, 0%, 0%)', // Black text on white
				},
				muted: {
					DEFAULT: 'hsl(0, 0%, 50%)', // Gray for muted elements
					foreground: 'hsl(0, 0%, 90%)', // Light gray foreground
				},
				accent: {
					DEFAULT: 'hsl(210, 100%, 50%)', // Blue accent
					foreground: 'hsl(0, 0%, 100%)', // White text on blue
				},
				destructive: {
					DEFAULT: 'hsl(0, 100%, 40%)', // Darker red for destructive actions
					foreground: 'hsl(0, 0%, 100%)', // White text
				},
				border: 'hsl(0, 0%, 80%)', // Light gray border
				input: 'hsl(0, 0%, 95%)', // Very light gray input
				ring: 'hsl(210, 100%, 50%)', // Blue ring color
				chart: {
					'1': 'hsl(0, 100%, 50%)', // Red
					'2': 'hsl(210, 100%, 50%)', // Blue
					'3': 'hsl(0, 0%, 0%)', // Black
					'4': 'hsl(0, 0%, 100%)', // White
					'5': 'hsl(0, 0%, 50%)', // Gray
				},
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)',
			},
		},
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
