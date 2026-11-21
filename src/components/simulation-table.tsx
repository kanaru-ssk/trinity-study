import type { SimulationMeta } from "../types/simulation";

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
		<div class="overflow-x-auto">
			<table class="mt-0 mb-0 w-full border-collapse whitespace-nowrap text-xs">
				<thead>
					<tr>
						<th class="sticky left-0 bg-card" />
						{withdrawalRates.map((rate) => (
							<th class="p-4 text-center">{rate}%</th>
						))}
					</tr>
				</thead>
				<tbody>
					{simulationResults.map((resultsRow, i) => {
						const meta = simulationMeta[i];
						return (
							<tr>
								<th class="sticky left-0 w-20 bg-card px-4 py-1 text-center">
									{meta.payoutPeriod}年
									<br />
									(n={meta.numOfSimulation})
								</th>
								{resultsRow.map((result) => (
									<td
										class="px-4 py-3 text-center"
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
