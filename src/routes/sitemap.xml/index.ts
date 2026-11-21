import type { Handler } from "hono";
import { BASE_URL } from "../../constants.ts";
import { loadChart } from "../../lib/load-chart.ts";

const ssg = true;

const GET: Handler = (c) => {
	// ページの内容はデータの更新でしか変わらないため、ビルド日時ではなく最終データ日を使う
	const chart = loadChart();
	const lastmod = chart[chart.length - 1].date;
	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
<url>
<loc>${BASE_URL}/</loc>
<lastmod>${lastmod}</lastmod>
</url>
<url>
<loc>${BASE_URL}/privacy</loc>
</url>
</urlset>
`;
	return c.body(xml, 200, { "Content-Type": "application/xml" });
};

export { GET, ssg };
