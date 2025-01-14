import { tailwindCustomTheme } from "./src/theme/theme";


export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			colors:{
				primary: tailwindCustomTheme.colorPrimary
			},
			fontFamily: {
				montserrat: ["Montserrat", "sans-serif"],
			},
		},
	},
	plugins: [],
	important: true,
};
