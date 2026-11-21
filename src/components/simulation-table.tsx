import type { SimulationRow } from "../types/simulation.ts";

type SimulationTableProps = {
	withdrawalRates: number[];
	rows: SimulationRow[];
};

export function SimulationTable({
	withdrawalRates,
	rows,
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
					{rows.map(({ payoutPeriod, numOfSimulation, successRates }) => (
						<tr>
							<th class="sticky left-0 w-20 bg-card px-4 py-1 text-center">
								{payoutPeriod}年
								<br />
								(n={numOfSimulation})
							</th>
							{successRates.map((result) => (
								<td
									class="px-4 py-3 text-center"
									style={{ backgroundColor: getCellColor(result) }}
								>
									{Math.floor(100 * result)}
								</td>
							))}
						</tr>
					))}
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
