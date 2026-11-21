import { defineConfig } from "cf/config";

export default defineConfig({
	worker: {
		name: "trinity-study",
		compatibilityDate: "2026-10-30",
		entrypoint: "./src/index.tsx",
	},
});
