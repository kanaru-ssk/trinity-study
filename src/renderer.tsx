import { jsxRenderer } from "hono/jsx-renderer";
import { Link, ViteClient } from "vite-ssr-components/hono";
import { ADSENSE_ACCOUNT, BASE_URL, GTM_ID } from "./constants.ts";

export type Meta = {
	title: string;
	description: string;
	noindex?: boolean;
	/** ページのパス。canonical と og:url に使う（404 などの noindex ページでは省略する） */
	path?: string;
};

type Render = (content: string | Promise<string>, meta: Meta) => Response;

declare module "hono" {
	interface ContextRenderer extends Render {}
}

const gtmScript = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');`;

export const renderer = jsxRenderer(
	({ children, title, description, noindex, path }) => {
		const url = path === undefined ? undefined : new URL(path, BASE_URL).href;
		return (
			<html lang="ja" class="font-sans">
				<head>
					<meta charset="utf-8" />
					<meta name="viewport" content="width=device-width, initial-scale=1" />
					<title>{title}</title>
					<meta name="description" content={description} />
					<meta property="og:type" content="website" />
					<meta property="og:title" content={title} />
					<meta property="og:description" content={description} />
					{url && <link rel="canonical" href={url} />}
					{url && <meta property="og:url" content={url} />}
					<meta property="og:image" content={`${BASE_URL}/ogp.png`} />
					<meta name="google-adsense-account" content={ADSENSE_ACCOUNT} />
					{noindex && <meta name="robots" content="noindex, nofollow" />}
					<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
					<link rel="icon" type="image/x-icon" href="/favicon.ico" />
					<link rel="preconnect" href="https://fonts.googleapis.com" />
					<link
						rel="preconnect"
						href="https://fonts.gstatic.com"
						crossorigin=""
					/>
					<link
						rel="stylesheet"
						href="https://fonts.googleapis.com/css2?family=Inter:wght@400..700&display=swap"
					/>
					<Link href="/src/style.css" rel="stylesheet" />
					<ViteClient />
					<script dangerouslySetInnerHTML={{ __html: gtmScript }} />
				</head>
				<body>
					<noscript>
						<iframe
							title="Google Tag Manager"
							src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
							height="0"
							width="0"
							style={{ display: "none", visibility: "hidden" }}
						/>
					</noscript>
					{children}
					<footer class="space-y-2 p-8 text-center text-ink-muted text-xs">
						<p>
							<a
								href="/privacy"
								class="text-primary underline underline-offset-2 hover:text-primary-active"
							>
								プライバシーポリシー・免責事項
							</a>
						</p>
						<p>
							&copy;
							<a
								href="https://kanaru.jp"
								target="_blank"
								rel="noreferrer"
								class="ml-1 text-primary underline underline-offset-2 hover:text-primary-active"
							>
								Kanaru
							</a>
						</p>
					</footer>
				</body>
			</html>
		);
	},
);
