import fs from "node:fs/promises";
import path from "node:path";
import { fetchAcwiChart } from "@/lib/fetch-acwi-chart";
import { fetchExchangeRate } from "@/lib/fetch-exchange-rate";
import { parseCsvToCart } from "@/lib/parse-csv-to-cart";
import type { Chart } from "@/types/chart";

(async () => {
  // CSVからチャートデータ取得
  const filePath = path.join(process.cwd(), "public", "chart.csv");
  const text = await fs.readFile(filePath, "utf8");

  const parsed = parseCsvToCart(text);
  if (!parsed.ok) {
    throw new Error(parsed.error);
  }
  const chart = parsed.data;
  const lastDataDate = chart[chart.length - 1].date;

  const newChart = await fetchAcwiChart(new Date(lastDataDate));
  if (!newChart) {
    console.log("there is no new chart data");
    return;
  }

  const newChartWithJpy: Chart = [];
  for (const data of newChart) {
    const jpyPerUsd = await fetchExchangeRate(data.date);
    if (!jpyPerUsd) continue;

    newChartWithJpy.push({
      id: crypto.randomUUID(),
      date: data.date,
      priceUsd: data.priceUsd,
      priceJpy: data.priceUsd * jpyPerUsd,
      jpyPerUsd,
    });
    // 429: Too Many Requestsを回避するために1秒おきにリクエスト
    await new Promise((resolve) => setTimeout(() => resolve(null), 1000));
  }
  if (newChartWithJpy.length === 0) {
    console.log("there is no new chart data with jpy");
    return;
  }

  const rows = newChartWithJpy
    .map(
      (data) =>
        `${data.id},${data.date},${data.priceUsd},${data.priceJpy},${data.jpyPerUsd}`,
    )
    .join("\n");
  fs.appendFile(filePath, `\n${rows}`, "utf8");
})();
