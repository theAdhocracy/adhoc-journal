import node from "@astrojs/node";
import { defineConfig } from "astro/config";
import { loadEnv } from "vite";

const mode = process.env.NODE_ENV || "development";
Object.assign(process.env, loadEnv(mode, process.cwd(), ""));

// https://astro.build/config
export default defineConfig({
	vite: {
		css: {
			transformer: "lightningcss",
		},
	},
	output: "server",
	adapter: node({ mode: "standalone" }),
	base: "/",
	security: {
		checkOrigin: false,
	},
});
