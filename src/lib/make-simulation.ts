import type { Chart } from "../types/chart.ts";
import type { SimulationRow } from "../types/simulation.ts";

type Options = {
	/**
	 * chart と同じ月の消費者物価指数。指定すると、毎年の取り崩し額を開始月からの物価上昇率に合わせて増減させる
	 * （オリジナルのトリニティスタディのインフレ調整と同じ考え方）。省略すると取り崩し額は名目で一定
	 */
	cpi?: number[];
};

// 取崩しシミュレーションデータを作成
// 取り崩し期間ごとに、試行回数と取り崩し率ごとの成功率を返す
export function makeSimulation(
	chart: Chart,
	withdrawalRates: number[],
	{ cpi }: Options = {},
): SimulationRow[] {
	if (cpi && cpi.length !== chart.length) {
		throw new Error("cpi は chart と同じ長さにしてください");
	}

	// データの年数からシミュレーション可能な取り崩し期間を算出
	// 取り崩し期間は15年以上で5年区切り
	const numYearOfData = Math.floor(chart.length / 12);
	const numPayoutPeriod = Math.floor(numYearOfData / 5) - 2;
	const payoutPeriods = Array.from(
		{ length: numPayoutPeriod },
		(_, i) => i * 5 + 15,
	);

	return payoutPeriods.map((payoutPeriod) => {
		const numOfSimulation = chart.length - 12 * (payoutPeriod - 1);
		return {
			payoutPeriod,
			numOfSimulation,
			successRates: withdrawalRates.map((withdrawalRate) =>
				simulate(chart, payoutPeriod, numOfSimulation, withdrawalRate, cpi),
			),
		};
	});
}

// 取崩しシミュレーション
// チャートデータ、取崩し期間、取崩し率、試行回数を受け取って成功率(0~1)を返す
const simulate = (
	chart: Chart,
	payoutPeriod: number,
	numOfSimulation: number,
	withdrawalRate: number,
	cpi?: number[],
) => {
	let countFailure = 0; // 失敗回数
	for (let i = 0; i < numOfSimulation; i++) {
		// 資産残高。100にすると毎年の取り崩し額 = withdrawalRateになる
		let amountRemaining = 100;

		// 初年度の取り崩し
		amountRemaining -= withdrawalRate;

		for (let pi = 1; pi < payoutPeriod; pi++) {
			const prePrice = chart[i + 12 * (pi - 1)].priceJpy; // 1年前の基準価格
			const price = chart[i + 12 * pi].priceJpy; // 当月の基準価格
			const growthRatio = price / prePrice; // 1年間の価格の倍率（1 + 騰落率）

			// 資産残高に価格の倍率を掛ける
			amountRemaining *= growthRatio;

			// 資産残高から取崩し額を引く（インフレ調整する場合は開始月からの物価上昇率を掛ける）
			const inflation = cpi ? cpi[i + 12 * pi] / cpi[i] : 1;
			amountRemaining -= withdrawalRate * inflation;

			// 資産残高が0未満になったら失敗
			if (amountRemaining < 0) {
				countFailure++;
				break;
			}
		}
	}

	return (numOfSimulation - countFailure) / numOfSimulation;
};
