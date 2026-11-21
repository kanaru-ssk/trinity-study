import type { Handler } from "hono";
import { BASE_URL } from "../../constants";

const ssg = true;

const GET: Handler = (c) => {
	const lastmod = new Date().toISOString();
	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
<url>
<loc>${BASE_URL}</loc>
<lastmod>${lastmod}</lastmod>
</url>
</urlset>
`;
	return c.body(xml, 200, { "Content-Type": "application/xml" });
};

export { GET, ssg };
