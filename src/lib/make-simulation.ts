import type { Chart } from "@/types/chart";

// 取崩しシミュレーションデータを作成
// simulationMeta : 取崩し期間とシミュレーション回数の配列
// simulationResults : 取崩し期間と取崩し率の二元配列
export async function makeSimulation(chart: Chart, withdrawalRates: number[]) {
  // データの年数からシミュレーション可能な取り崩し期間を算出
  // 取り崩し期間は15年以上で5年区切り
  const numYearOfData = Math.floor(chart.length / 12);
  const numPayoutPeriod = Math.floor(numYearOfData / 5) - 2;
  const payoutPeriods = Array.from(
    { length: numPayoutPeriod },
    (_, i) => i * 5 + 15,
  );

  const simulationMeta = payoutPeriods.map((payoutPeriod) => ({
    payoutPeriod,
    numOfSimulation: chart.length - 12 * (payoutPeriod - 1),
  }));

  const simulationResults = simulationMeta.map(
    ({ payoutPeriod, numOfSimulation }) =>
      withdrawalRates.map((withdrawalRate) =>
        simulate(chart, payoutPeriod, numOfSimulation, withdrawalRate),
      ),
  );

  return { simulationMeta, simulationResults };
}

// 取崩しシミュレーション
// チャートデータ、取崩し期間、取崩し率、試行回数を受け取って成功率(0~1)を返す
const simulate = (
  chart: Chart,
  payoutPeriod: number,
  numOfSimulation: number,
  withdrawalRate: number,
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
      const PercentageChange = price / prePrice; // 騰落率

      // 資産残高に騰落率を掛ける
      amountRemaining *= PercentageChange;

      // 資産残高から取崩し額を引く
      amountRemaining -= withdrawalRate;

      // 資産残高が0未満になったら失敗
      if (amountRemaining < 0) {
        countFailure++;
        break;
      }
    }
  }

  return (numOfSimulation - countFailure) / numOfSimulation;
};
