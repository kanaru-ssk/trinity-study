// src/data/chart.csv の priceUsd を、指定した種類の指数で全期間取り直す。
// 為替レートは既存の値を使う。
// 使い方: node scripts/rebuild-chart.ts NETR
import fs from "node:fs/promises";
import path from "node:path";
import { fetchAcwiLevels } from "../src/lib/fetch-acwi-chart.ts";
import {
	type IndexMeta,
	indexMetaSchema,
	indexVariantLabels,
} from "../src/lib/index-variant.ts";
import { parseCsvToChart } from "../src/lib/parse-csv-to-chart.ts";
import { rebuildChart, toCsv } from "../src/lib/rebuild-chart.ts";

const variant = indexMetaSchema.shape.indexVariant.parse(process.argv[2]);

const csvPath = path.join(process.cwd(), "src", "data", "chart.csv");
const metaPath = path.join(process.cwd(), "src", "data", "index.json");

const parsed = parseCsvToChart(await fs.readFile(csvPath, "utf8"));
if (!parsed.ok) throw new Error(parsed.error);
const chart = parsed.data;

const levels = await fetchAcwiLevels(chart[0].date, variant);
if (!levels.ok) throw new Error(levels.error);

const rebuilt = rebuildChart(chart, levels.data);
if (!rebuilt.ok) {
	throw new Error(
		`${indexVariantLabels[variant]} では既存と同じ期間のデータを用意できません: ${rebuilt.error}`,
	);
}

const meta: IndexMeta = { indexVariant: variant };
await fs.writeFile(csvPath, toCsv(rebuilt.data), "utf8");
await fs.writeFile(metaPath, `${JSON.stringify(meta, null, "\t")}\n`, "utf8");
console.log(
	`rebuilt ${rebuilt.data.length} rows with ${indexVariantLabels[variant]}`,
);
