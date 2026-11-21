/// <reference types="vitest/config" />
import { cloudflare } from "@cloudflare/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import ssrPlugin from "vite-ssr-components/plugin";

export default defineConfig({
	plugins: [cloudflare(), ssrPlugin(), tailwindcss()],
	test: {
		// ローカルタイムに依存した日付処理を検出するため、UTC より西のタイムゾーンでテストする
		env: { TZ: "America/New_York" },
	},
});
