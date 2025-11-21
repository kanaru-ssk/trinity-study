import fs from "node:fs/promises";
import path from "node:path";
import { parseCsvToCart } from "@/lib/parse-csv-to-cart";
import type { Chart } from "@/types/chart";

// chart.csv からチャートデータを読み込む共通ユーティリティ
export async function loadChart(): Promise<Chart> {
  const filePath = path.join(process.cwd(), "public", "chart.csv");
  const text = await fs.readFile(filePath, "utf8");
  const parsed = parseCsvToCart(text);
  if (!parsed.ok) {
    throw new Error(parsed.error);
  }

  return parsed.data;
}
