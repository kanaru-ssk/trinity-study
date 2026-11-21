import { describe, expect, it } from "vitest";
import app from "./index.tsx";

// ルーティングとページ全体のレンダリングのスモークテスト
describe("app", () => {
	it("トップページにシミュレーション結果の表とチャートを表示する", async () => {
		const res = await app.request("/");
		expect(res.status).toBe(200);
		const html = await res.text();
		expect(html).toContain("<h1");
		expect(html).toContain("日本版トリニティスタディ");
		expect(html).toContain("15年");
		expect(html).toContain("data-acwi-chart");
	});

	it("プライバシーポリシーを表示する", async () => {
		const res = await app.request("/privacy");
		expect(res.status).toBe(200);
		expect(await res.text()).toContain("免責事項");
	});

	it("sitemap.xml を返す", async () => {
		const res = await app.request("/sitemap.xml");
		expect(res.headers.get("Content-Type")).toContain("application/xml");
		expect(await res.text()).toContain("<urlset");
	});

	it("存在しないページは noindex の 404 を返す", async () => {
		const res = await app.request("/not-found");
		expect(res.status).toBe(404);
		expect(await res.text()).toContain("noindex");
	});

	it("末尾スラッシュ付きの URL はリダイレクトする", async () => {
		const res = await app.request("/privacy/");
		expect(res.status).toBe(301);
		expect(res.headers.get("Location")).toMatch(/\/privacy$/);
	});
});
