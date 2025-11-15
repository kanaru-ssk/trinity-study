// biome-ignore-all lint/suspicious/noArrayIndexKey: build時にデータを静的に生成している
import type { SimulationMeta } from "@/types/simulation";

type SimulationTableProps = {
  withdrawalRates: number[];
  simulationMeta: SimulationMeta[];
  simulationResults: number[][];
};

export function SimulationTable({
  withdrawalRates,
  simulationMeta,
  simulationResults,
}: SimulationTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="mt-0 mb-0 w-full border-collapse whitespace-nowrap text-xs">
        <thead>
          <tr>
            <th className="sticky left-0 bg-white" />
            {withdrawalRates.map((rate) => (
              <th key={rate} className="p-4 text-center">
                {rate}%
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {simulationResults.map((resultsRow, i) => {
            const meta = simulationMeta[i];
            return (
              <tr key={i}>
                <th className="sticky left-0 w-20 bg-white px-4 py-1 text-center">
                  {meta.payoutPeriod} Year
                  <br />
                  (n={meta.numOfSimulation})
                </th>
                {resultsRow.map((result, j) => (
                  <td
                    key={j}
                    className="px-4 py-3 text-center"
                    style={{ backgroundColor: getCellColor(result) }}
                  >
                    {Math.floor(100 * result)}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

const getCellColor = (result: number): string => {
  const r = result < 0.5 ? 255 : 255 - 155 * 2 * (result - 0.5);
  const g = result > 0.5 ? 255 : 100 + 155 * 2 * result;
  const b = 100;

  return `rgb(${r},${g},${b})`;
};
