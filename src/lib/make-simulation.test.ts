import { describe, expect, it } from "vitest";
import type { Chart } from "../types/chart.ts";
import { makeSimulation } from "./make-simulation.ts";

// 毎月 rate 倍になるチャートを作る
const makeChart = (months: number, rate: number): Chart =>
	Array.from({ length: months }, (_, i) => ({
		date: "2000-01-01",
		priceUsd: 100 * rate ** i,
		priceJpy: 100 * rate ** i,
		jpyPerUsd: 1,
	}));

describe("makeSimulation", () => {
	it("データ年数から 15 年以上 5 年区切りの取り崩し期間を算出する", () => {
		const chart = makeChart(12 * 30, 1);
		const rows = makeSimulation(chart, [4]);
		expect(
			rows.map(({ payoutPeriod, numOfSimulation }) => ({
				payoutPeriod,
				numOfSimulation,
			})),
		).toEqual([
			{ payoutPeriod: 15, numOfSimulation: 12 * 30 - 12 * 14 },
			{ payoutPeriod: 20, numOfSimulation: 12 * 30 - 12 * 19 },
			{ payoutPeriod: 25, numOfSimulation: 12 * 30 - 12 * 24 },
			{ payoutPeriod: 30, numOfSimulation: 12 * 30 - 12 * 29 },
		]);
	});

	it("価格が横ばいなら取り崩し率 × 期間が 100 未満のときだけ成功する", () => {
		const chart = makeChart(12 * 20, 1);
		const [row] = makeSimulation(chart, [5, 7]);
		// 15 年: 5% は 75 で成功、7% は 105 で失敗
		expect(row.successRates).toEqual([1, 0]);
	});

	it("cpi を指定すると取り崩し額をインフレ調整する", () => {
		const chart = makeChart(12 * 20, 1);
		// 毎年 5% の物価上昇
		const cpi = chart.map((_, i) => 1.05 ** Math.floor(i / 12));
		// 名目なら 15 年 x 6 = 90 で成功するが、インフレ調整すると 100 を超えて失敗する
		expect(makeSimulation(chart, [6])[0].successRates).toEqual([1]);
		expect(makeSimulation(chart, [6], { cpi })[0].successRates).toEqual([0]);
	});

	it("物価が横ばいなら名目と同じ結果になる", () => {
		const chart = makeChart(12 * 20, 1.003);
		const cpi = chart.map(() => 100);
		expect(makeSimulation(chart, [4, 8], { cpi })).toEqual(
			makeSimulation(chart, [4, 8]),
		);
	});

	it("cpi の長さが chart と違えばエラーにする", () => {
		const chart = makeChart(12 * 20, 1);
		expect(() => makeSimulation(chart, [4], { cpi: [1] })).toThrow();
	});
});

describe("makeSimulation の境界", () => {
	it("15 年分に満たないデータでは結果が空になる", () => {
		expect(makeSimulation(makeChart(12 * 14, 1), [4])).toEqual([]);
	});

	it("取り崩し期間ぴったりのデータでは試行回数が 1 回になる", () => {
		// 15 年の取り崩しに必要なのは 12 * 14 + 1 か月
		const [row] = makeSimulation(makeChart(12 * 15, 1), [4]);
		expect(row.numOfSimulation).toBe(12 * 15 - 12 * 14);
	});

	it("最終年に残高がちょうど 0 になる場合は成功とする", () => {
		// 横ばいで 15 年 x 6.25 = 93.75、20 年 x 5 = 100
		const chart = makeChart(12 * 20, 1);
		const rows = makeSimulation(chart, [5]);
		expect(rows.find((r) => r.payoutPeriod === 20)?.successRates).toEqual([1]);
	});
});
