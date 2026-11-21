import fs from "node:fs/promises";
import path from "node:path";
import { fetchAcwiChart } from "../src/lib/fetch-acwi-chart.ts";
import {
	fetchExchangeRate,
	isPlausibleRate,
} from "../src/lib/fetch-exchange-rate.ts";
import { isStale } from "../src/lib/freshness.ts";
import { indexMetaSchema } from "../src/lib/index-variant.ts";
import { parseCsvToChart } from "../src/lib/parse-csv-to-chart.ts";
import { type Chart, chartSchema } from "../src/types/chart.ts";

// 失敗時は例外で非 0 終了させ、ワークフローを失敗として検知できるようにする

// CSVからチャートデータ取得
const filePath = path.join(process.cwd(), "src", "data", "chart.csv");
const text = await fs.readFile(filePath, "utf8");

const parsed = parseCsvToChart(text);
if (!parsed.ok) {
	throw new Error(parsed.error);
}
const chart = parsed.data;
const lastDataDate = chart[chart.length - 1].date;

// 既存データと同じ種類の指数を取得する
const { indexVariant } = indexMetaSchema.parse(
	JSON.parse(
		await fs.readFile(
			path.join(process.cwd(), "src", "data", "index.json"),
			"utf8",
		),
	),
);

const newChart = await fetchAcwiChart(lastDataDate, indexVariant);
if (!newChart.ok) {
	throw new Error(newChart.error);
}

const newChartWithJpy: Chart = [];
for (const data of newChart.data) {
	const jpyPerUsd = await fetchExchangeRate(data.date);
	// 1 か月でも欠けると「12 行 = 1 年」の前提が崩れるため、何も書き込まずに失敗させる
	if (!jpyPerUsd.ok) {
		throw new Error(jpyPerUsd.error);
	}
	const previousRate = (newChartWithJpy.at(-1) ?? chart.at(-1))?.jpyPerUsd;
	if (previousRate && !isPlausibleRate(previousRate, jpyPerUsd.data)) {
		throw new Error(
			`implausible exchange rate on ${data.date}: ${previousRate} -> ${jpyPerUsd.data}`,
		);
	}

	newChartWithJpy.push({
		date: data.date,
		priceUsd: data.priceUsd,
		priceJpy: data.priceUsd * jpyPerUsd.data,
		jpyPerUsd: jpyPerUsd.data,
	});
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
