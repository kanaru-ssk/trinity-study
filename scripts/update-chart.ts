import fs from "node:fs/promises";
import path from "node:path";
import { fetchAcwiChart } from "../src/lib/fetch-acwi-chart.ts";
import { fetchExchangeRate } from "../src/lib/fetch-exchange-rate.ts";
import { isStale } from "../src/lib/freshness.ts";
import { parseCsvToCart } from "../src/lib/parse-csv-to-cart.ts";
import { type Chart, chartSchema } from "../src/types/chart.ts";

// 失敗時は例外で非 0 終了させ、ワークフローを失敗として検知できるようにする
const apiKey = process.env.EXCHANGE_RATE_API_KEY;
if (!apiKey) throw new Error("EXCHANGE_RATE_API_KEY is not set");

// CSVからチャートデータ取得
const filePath = path.join(process.cwd(), "src", "data", "chart.csv");
const text = await fs.readFile(filePath, "utf8");

const parsed = parseCsvToCart(text);
if (!parsed.ok) {
	throw new Error(parsed.error);
}
const chart = parsed.data;
const lastDataDate = chart[chart.length - 1].date;

const newChart = await fetchAcwiChart(lastDataDate);
if (!newChart.ok) {
	throw new Error(newChart.error);
}

const newChartWithJpy: Chart = [];
for (const data of newChart.data) {
	const jpyPerUsd = await fetchExchangeRate(data.date, apiKey);
	// 1 か月でも欠けると「12 行 = 1 年」の前提が崩れるため、何も書き込まずに失敗させる
	if (!jpyPerUsd.ok) {
		throw new Error(jpyPerUsd.error);
	}

	newChartWithJpy.push({
		date: data.date,
		priceUsd: data.priceUsd,
		priceJpy: data.priceUsd * jpyPerUsd.data,
		jpyPerUsd: jpyPerUsd.data,
	});
	// 429: Too Many Requestsを回避するために1秒おきにリクエスト
	await new Promise((resolve) => setTimeout(resolve, 1000));
}

if (newChartWithJpy.length === 0) {
	console.log("there is no new chart data");
} else {
	// 追記後のデータ全体が月次で連続しているか検証してから書き込む
	const validated = chartSchema.safeParse([...chart, ...newChartWithJpy]);
	if (!validated.success) {
		throw new Error(validated.error.message);
	}

	const rows = newChartWithJpy
		.map(
			(data) =>
				`${data.date},${data.priceUsd},${data.priceJpy},${data.jpyPerUsd}`,
		)
		.join("\n");
	await fs.appendFile(filePath, `\n${rows}`, "utf8");
	console.log(`appended ${newChartWithJpy.length} rows`);
}

// 更新が長期間止まっていたら失敗させて気づけるようにする
const latestDate = newChartWithJpy.at(-1)?.date ?? lastDataDate;
if (isStale(latestDate, new Date())) {
	throw new Error(`chart data is stale: last data date is ${latestDate}`);
}
