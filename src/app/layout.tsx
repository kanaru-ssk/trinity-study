import { GoogleTagManager } from "@next/third-parties/google";
import type { Metadata } from "next";
import "./globals.css";
import { env } from "@/env";
import { addMonths, formatDate } from "@/lib/date";
import { loadChart } from "@/lib/load-chart";

export async function generateMetadata(): Promise<Metadata> {
  const latestLabel = await getLatestDataLabel();
  return {
    title: `日本版トリニティスタディ | ${latestLabel}最新`,
    description: `${latestLabel}のMSCI ACWIデータを日本円建てで取崩しシミュレーション。eMAXIS Slim 全世界株式（オール・カントリー）が連動する指数を使い、4%ルールが日本でも再現性のある投資方法なのか検証しました。`,
    openGraph: {
      type: "website",
      images: [`${env.NEXT_PUBLIC_BASE_URL}/ogp.png`],
      url: env.NEXT_PUBLIC_BASE_URL,
    },
  };
}

const FALLBACK_LABEL = formatDate(addMonths(new Date(), 1), "YYYY年M月");

async function getLatestDataLabel() {
  try {
    const chart = await loadChart();
    const lastDate = chart.at(-1)?.date;
    if (!lastDate) return FALLBACK_LABEL;
    return formatDate(addMonths(new Date(lastDate), 1), "YYYY年M月");
  } catch (error) {
    console.error("failed to load chart for metadata", error);
    return FALLBACK_LABEL;
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head>
        <GoogleTagManager gtmId={env.NEXT_PUBLIC_GTM_ID} />
      </head>

      <body>
        {children}
        <footer className="p-8 text-center text-neutral-500 text-xs">
          <p>
            &copy;
            <a
              href="https://kanaru.jp"
              target="_blank"
              rel="noreferrer"
              className="ml-1 underline"
            >
              Kanaru
            </a>
          </p>
        </footer>
      </body>
    </html>
  );
}
