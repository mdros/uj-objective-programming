import tailwindcss from "@tailwindcss/vite";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react-swc";
import path from "node:path";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./"),
		},
	},
	plugins: [
		tailwindcss(),
		TanStackRouterVite({ target: "react", autoCodeSplitting: true }),
		react(),
	],
});
