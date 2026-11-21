import { Hono } from "hono";
import { trimTrailingSlash } from "hono/trailing-slash";
import { type RouteModule, registerRoutes } from "./lib/router";
import { renderer } from "./renderer";

const app = new Hono();

app.use(trimTrailingSlash({ alwaysRedirect: true }));
app.use(renderer);

registerRoutes(
	app,
	import.meta.glob<RouteModule>("./routes/**/index.{ts,tsx}", { eager: true }),
);

app.notFound((c) => {
	c.status(404);
	return c.render(
		<main class="mx-auto max-w-5xl px-4 py-20">
			<h1 class="font-bold text-[40px]">404 Not Found</h1>
		</main>,
		{
			title: "404 Not Found",
			description: "ページが見つかりません",
			noindex: true,
		},
	);
});

app.onError((err, c) => {
	console.error(err);
	c.status(500);
	return c.render(
		<main class="mx-auto max-w-5xl px-4 py-20">
			<h1 class="font-bold text-[40px]">500 Internal Server Error</h1>
		</main>,
		{
			title: "500 Internal Server Error",
			description: "サーバーエラーが発生しました",
			noindex: true,
		},
	);
});

export default app;
