import type { SimulationRow } from "../../types/simulation.ts";
import { SimulationTable } from "../simulation-table.tsx";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "../ui/card.tsx";

type SimulationSectionProps = {
	withdrawalRates: number[];
	rows: SimulationRow[];
	firstDataDate: string;
	lastDataDate: string;
	indexLabel: string;
};

export function SimulationSection({
	withdrawalRates,
	rows,
	firstDataDate,
	lastDataDate,
	indexLabel,
}: SimulationSectionProps) {
	return (
		<section>
			<Card>
				<CardHeader>
					<CardTitle>シミュレーション結果</CardTitle>
					<CardDescription>
						※ 縦軸: 取り崩し期間(n=試行回数)、横軸:
						初年度の資産額に対する取り崩し率
						<br />※ {firstDataDate} ~ {lastDataDate}
						のデータを使用してシミュレーションしています。
						<br />※ 指数は MSCI ACWI {indexLabel}
						を円換算したものです。信託報酬・税金は考慮していません。
						<br />※
						過去データに基づく試算であり、将来の運用成果を保証するものではありません（
						<a href="/privacy#disclaimer">免責事項</a>）。
						<br />※ 実際のアルゴリズムは
						<a
							href="https://github.com/kanaru-ssk/trinity-study/blob/main/src/lib/make-simulation.ts"
							target="_blank"
							rel="noreferrer"
						>
							GitHub
						</a>
						をご確認ください。
					</CardDescription>
				</CardHeader>
				<CardContent>
					<SimulationTable withdrawalRates={withdrawalRates} rows={rows} />
				</CardContent>
			</Card>
		</section>
	);
}
