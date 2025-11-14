import type { Metadata } from "next";
import { generateTitle } from "@/lib/generate-title";
import "./globals.css";
import { env } from "@/env";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: generateTitle(),
    description:
      "eMAXIS Slim 全世界株式（オール・カントリー）が連動する、MSCI ACWIを日本円建てで取崩しシミュレーション。4%ルールが日本でも再現性のある投資方法なのか検証しました。",
    openGraph: {
      type: "website",
      images: [`${env.NEXT_PUBLIC_BASE_URL}/ogp.png`],
      url: env.NEXT_PUBLIC_BASE_URL,
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
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
