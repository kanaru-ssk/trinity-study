import { formatDate } from "@/lib/date";
import { loadChart } from "@/lib/load-chart";
import { makeSimulation } from "@/lib/make-simulation";
import { View } from "./view";

const withdrawalRates = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

export default async function Home() {
  const chart = await loadChart();

  // 取り崩しシミュレーション実行
  const { simulationMeta, simulationResults } = await makeSimulation(
    chart,
    withdrawalRates,
  );

  const firstDataDate = formatDate(new Date(chart[0].date), "YYYY/MM/DD");
  const lastDataDate = formatDate(
    new Date(chart[chart.length - 1].date),
    "YYYY/MM/DD",
  );

  return (
    <View
      chart={chart}
      withdrawalRates={withdrawalRates}
      simulationMeta={simulationMeta}
      simulationResults={simulationResults}
      firstDataDate={firstDataDate}
      lastDataDate={lastDataDate}
    />
  );
}
