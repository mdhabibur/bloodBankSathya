import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import theme from "./src/theme/theme";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
	plugins: [react()],
	server: {
		proxy: {
			"/api": "http://localhost:5000", // Proxy API requests to backend
		},
	},
});
