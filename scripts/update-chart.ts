import fs from "node:fs/promises";
import path from "node:path";
import { fetchAcwiChart } from "../src/lib/fetch-acwi-chart.ts";
import { fetchExchangeRate } from "../src/lib/fetch-exchange-rate.ts";
import { parseCsvToCart } from "../src/lib/parse-csv-to-cart.ts";
import type { Chart } from "../src/types/chart.ts";

const apiKey = process.env.EXCHANGE_RATE_API_KEY;
if (!apiKey) throw new Error("EXCHANGE_RATE_API_KEY is not set");

(async () => {
	// CSVからチャートデータ取得
	const filePath = path.join(process.cwd(), "src", "data", "chart.csv");
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
		const jpyPerUsd = await fetchExchangeRate(data.date, apiKey);
		if (!jpyPerUsd) continue;

		newChartWithJpy.push({
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
				`${data.date},${data.priceUsd},${data.priceJpy},${data.jpyPerUsd}`,
		)
		.join("\n");
	await fs.appendFile(filePath, `\n${rows}`, "utf8");
})();
