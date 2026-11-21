import { describe, expect, it } from "vitest";
import { compareRoutes, conflictKey, parseRoute } from "./route";

describe("parseRoute", () => {
	it.each([
		["index.tsx", "/"],
		["articles/index.ts", "/articles"],
		["articles/sample/index.tsx", "/articles/sample"],
		["articles/[id]/index.tsx", "/articles/:id"],
		["docs/[...slug]/index.tsx", "/docs/:slug{.+}"],
		["users/[userId]/posts/[postId]/index.tsx", "/users/:userId/posts/:postId"],
	])("%s → %s", (file, path) => {
		expect(parseRoute(file).path).toBe(path);
	});

	it("セグメントの種類を判定する", () => {
		expect(parseRoute("a/[b]/[...c]/index.tsx").segments).toEqual([
			{ kind: "static", name: "a" },
			{ kind: "param", name: "b" },
			{ kind: "catchAll", name: "c" },
		]);
	});
});

describe("compareRoutes", () => {
	const sorted = (files: string[]) =>
		files
			.map(parseRoute)
			.sort(compareRoutes)
			.map((route) => route.path);

	it("固定 → パラメータ → catch-all の順に並べる", () => {
		expect(
			sorted([
				"articles/[...rest]/index.tsx",
				"articles/[id]/index.tsx",
				"articles/sample/index.tsx",
			]),
		).toEqual(["/articles/sample", "/articles/:id", "/articles/:rest{.+}"]);
	});

	it("左のセグメントほど優先して比べる", () => {
		expect(sorted(["[id]/edit/index.tsx", "users/[id]/index.tsx"])).toEqual([
			"/users/:id",
			"/:id/edit",
		]);
	});
});

describe("conflictKey", () => {
	const key = (file: string) => conflictKey(parseRoute(file).segments);

	it("パラメータ名だけが違うルートは同じキーになる", () => {
		expect(key("articles/[id]/index.tsx")).toBe(
			key("articles/[slug]/index.tsx"),
		);
	});

	it("index.ts と index.tsx は同じキーになる", () => {
		expect(key("articles/index.ts")).toBe(key("articles/index.tsx"));
	});

	it("パラメータと catch-all は別のキーになる", () => {
		expect(key("docs/[id]/index.tsx")).not.toBe(
			key("docs/[...slug]/index.tsx"),
		);
	});

	it("固定セグメントとパラメータは別のキーになる", () => {
		expect(key("articles/sample/index.tsx")).not.toBe(
			key("articles/[id]/index.tsx"),
		);
	});
});
