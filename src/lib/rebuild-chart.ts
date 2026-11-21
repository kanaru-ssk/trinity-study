import type { Chart } from "../types/chart.ts";
import type { Result } from "../types/result.ts";
import type { AcwiChart } from "./fetch-acwi-chart.ts";

const toMonth = (date: string) => date.slice(0, 7);

/**
 * 既存のチャートの各月について、priceUsd を別の指数（levels）の値に置き換える。
 * 為替レート（jpyPerUsd）は既存の値を使い、priceJpy を計算し直す。
 * levels に欠けている月があればエラーを返す（期間が短くなるとシミュレーション結果が変わるため）
 */
export function rebuildChart(
	chart: Chart,
	levels: AcwiChart,
): Result<Chart, string> {
	const levelByMonth = new Map(
		levels.map((level) => [toMonth(level.date), level]),
	);

	const missing = chart
		.map((data) => data.date)
		.filter((date) => !levelByMonth.has(toMonth(date)));
	if (missing.length > 0) {
		return {
			ok: false,
			error: `指数データが ${missing.length} か月分ありません（${missing[0]} 〜 ${missing.at(-1)}）`,
		};
	}

	return {
		ok: true,
		data: chart.map((data) => {
			// biome-ignore lint/style/noNonNullAssertion: 上で存在を確認済み
			const level = levelByMonth.get(toMonth(data.date))!;
			return {
				date: level.date,
				priceUsd: level.priceUsd,
				priceJpy: level.priceUsd * data.jpyPerUsd,
				jpyPerUsd: data.jpyPerUsd,
			};
		}),
	};
}

export const toCsv = (chart: Chart): string =>
	[
		"date,priceUsd,priceJpy,jpyPerUsd",
		...chart.map(
			(data) =>
				`${data.date},${data.priceUsd},${data.priceJpy},${data.jpyPerUsd}`,
		),
	].join("\n");
