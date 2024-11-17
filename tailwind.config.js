/** @type {import('tailwindcss').Config} */
export default {
	content: [
		"./index.html",
		"./src/*.mlx",
		"./src/components/**/*.{js,jsx,ts,tsx}",
		"./src/generated/src/**/*.{js,jsx,ts,tsx}",
		"./vendor/**/*.{js,jsx,ts,tsx}",
	],
  theme: {
    extend: {
      fontFamily: {
        geist: "Geist Mono, monospace",
      }
    },
  },
  plugins: [],
}

