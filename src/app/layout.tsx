import { GoogleTagManager } from "@next/third-parties/google";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { env } from "@/env";
import { formatDate } from "@/lib/date";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `日本版トリニティスタディ | ${formatDate(new Date(), "YYYY年M月")}最新`,
    description:
      "eMAXIS Slim 全世界株式（オール・カントリー）が連動する、MSCI ACWIを日本円建てで取崩しシミュレーション。4%ルールが日本でも再現性のある投資方法なのか検証しました。",
    openGraph: {
      type: "website",
      images: [`${env.NEXT_PUBLIC_BASE_URL}/ogp.png`],
      url: env.NEXT_PUBLIC_BASE_URL,
    },
    other: {
      "google-adsense-account": "ca-pub-9191403506411578",
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className={`${inter.variable} font-sans`}>
      <head>
        <GoogleTagManager gtmId={env.NEXT_PUBLIC_GTM_ID} />
      </head>

      <body>
        {children}
        <footer className="p-8 text-center text-ink-muted text-xs">
          <p>
            &copy;
            <a
              href="https://kanaru.jp"
              target="_blank"
              rel="noreferrer"
              className="ml-1 text-primary underline underline-offset-2 hover:text-primary-active"
            >
              Kanaru
            </a>
          </p>
        </footer>
      </body>
    </html>
  );
}
