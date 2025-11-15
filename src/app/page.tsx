import fs from "node:fs/promises";
import path from "node:path";
import { formatDate } from "@/lib/date";
import { makeSimulation } from "@/lib/make-simulation";
import { parseCsvToCart } from "@/lib/parse-csv-to-cart";
import { View } from "./view";

const withdrawalRates = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

export default async function Home() {
  // CSVからチャートデータ取得
  const filePath = path.join(process.cwd(), "public", "chart.csv");
  const text = await fs.readFile(filePath, "utf8");
  const parsed = parseCsvToCart(text);
  if (!parsed.ok) {
    throw new Error(parsed.error);
  }
  const chart = parsed.data;

  // 取り崩しシミュレーション実行
  const { simulationMeta, simulationResults } = await makeSimulation(
    chart,
    withdrawalRates,
  );

  const firstDataDate = formatDate(new Date(chart[0].date), "YYYY/MM/DD");
  const lastDataDate = formatDate(
    new Date(chart[chart.length - 1].date),
    "YYYY/MM/DD",
  );

  return (
    <View
      chart={chart}
      withdrawalRates={withdrawalRates}
      simulationMeta={simulationMeta}
      simulationResults={simulationResults}
      firstDataDate={firstDataDate}
      lastDataDate={lastDataDate}
    />
  );
}
