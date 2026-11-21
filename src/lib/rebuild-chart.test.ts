import { describe, expect, it } from "vitest";
import type { Chart } from "../types/chart.ts";
import { parseCsvToChart } from "./parse-csv-to-chart.ts";
import { rebuildChart, toCsv } from "./rebuild-chart.ts";

const chart: Chart = [
	{ date: "1987-12-31", priceUsd: 100, priceJpy: 12100, jpyPerUsd: 121 },
	{ date: "1988-01-29", priceUsd: 102, priceJpy: 13035.6, jpyPerUsd: 127.8 },
];

describe("rebuildChart", () => {
	it("priceUsd を置き換え、既存の為替で priceJpy を計算し直す", () => {
		const result = rebuildChart(chart, [
			{ date: "1987-12-31", priceUsd: 200 },
			{ date: "1988-01-29", priceUsd: 210 },
			{ date: "1988-02-29", priceUsd: 220 }, // 既存にない月は無視する
		]);
		expect(result).toEqual({
			ok: true,
			data: [
				{ date: "1987-12-31", priceUsd: 200, priceJpy: 24200, jpyPerUsd: 121 },
				{
					date: "1988-01-29",
					priceUsd: 210,
					priceJpy: 26838,
					jpyPerUsd: 127.8,
				},
			],
		});
	});

	it("月末日がずれていても同じ月として扱う", () => {
		const result = rebuildChart(chart, [
			{ date: "1987-12-30", priceUsd: 200 },
			{ date: "1988-01-28", priceUsd: 210 },
		]);
		expect(result.ok && result.data.map((d) => d.date)).toEqual([
			"1987-12-30",
			"1988-01-28",
		]);
	});

	it("指数データの期間が短ければエラーを返す", () => {
		const result = rebuildChart(chart, [{ date: "1988-01-29", priceUsd: 210 }]);
		expect(result).toEqual({
			ok: false,
			error: expect.stringContaining("1987-12-31"),
		});
	});
});

describe("toCsv", () => {
	it("parseCsvToChart で読み戻せる", () => {
		expect(parseCsvToChart(toCsv(chart))).toEqual({ ok: true, data: chart });
	});
});
