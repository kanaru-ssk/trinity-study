// cf build の成果物から SSG し、assets に書き出す。
// Node で実行するため、`cloudflare:workers` の import や binding は使えない
import fs from "node:fs/promises";
import { fileURLToPath } from "node:url";
import type { Hono } from "hono";
import { defaultPlugin, redirectPlugin, toSSG } from "hono/ssg";

const output = new URL(
	"../.cloudflare/output/v1/workers/default/",
	import.meta.url,
);
const { default: app }: { default: Hono } = await import(
	new URL("bundle/index.js", output).href
);

const result = await toSSG(app, fs, {
	dir: fileURLToPath(new URL("assets/", output)),
	plugins: [redirectPlugin(), defaultPlugin()],
});
if (!result.success) throw result.error;
for (const file of result.files) console.log("ssg:", file);
