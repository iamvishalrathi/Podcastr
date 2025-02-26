import type { Config } from "tailwindcss";

const config = {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: "2rem",
			screens: {
				"2xl": "1400px",
			},
		},
		extend: {
			colors: {
				white: {
					1: "#FFFFFF",
					2: "rgba(255, 255, 255, 0.72)",
					3: "rgba(255, 255, 255, 0.4)",
					4: "rgba(255, 255, 255, 0.64)",
					5: "rgba(255, 255, 255, 0.80)",
				},
				black: {
					1: "#15171C",
					2: "#222429",
					3: "#101114",
					4: "#252525",
					5: "#2E3036",
					6: "#24272C",
				},
				orange: {
					1: "#F97535",
				},
				gray: {
					1: "#71788B",
				},
			},
			backgroundImage: {
				"nav-focus":
					"linear-gradient(270deg, rgba(255, 255, 255, 0.06) 0%, rgba(255, 255, 255, 0.00) 100%)",
			},
			keyframes: {
				"accordion-down": {
					from: { height: "0" },
					to: { height: "var(--radix-accordion-content-height)" },
				},
				"accordion-up": {
					from: { height: "var(--radix-accordion-content-height)" },
					to: { height: "0" },
				},
				'music-bar-1': {
					'0%, 100%': { height: '8px' },
					'50%': { height: '24px' },
				},
				'music-bar-2': {
					'0%, 100%': { height: '16px' },
					'50%': { height: '24px' },
				},
				'music-bar-3': {
					'0%, 100%': { height: '12px' },
					'50%': { height: '24px' },
				},
			},
			animation: {
				"accordion-down": "accordion-down 0.2s ease-out",
				"accordion-up": "accordion-up 0.2s ease-out",
				'music-bar-1': 'music-bar-1 0.8s ease-in-out infinite',
				'music-bar-2': 'music-bar-2 1s ease-in-out infinite',
				'music-bar-3': 'music-bar-3 1.2s ease-in-out infinite',
			},
		},
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
