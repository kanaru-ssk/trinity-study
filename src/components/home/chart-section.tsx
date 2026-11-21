import { Script } from "vite-ssr-components/hono";
import type { Chart } from "../../types/chart.ts";
import { AcwiChart } from "../acwi-chart.tsx";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "../ui/card.tsx";

type ChartSectionProps = {
	chart: Chart;
	firstDataDate: string;
	lastDataDate: string;
};

export function ChartSection({
	chart,
	firstDataDate,
	lastDataDate,
}: ChartSectionProps) {
	return (
		<section>
			<Card>
				<CardHeader>
					<CardTitle>
						MSCI ACWIの全期間チャート <TrendingUpIcon />
					</CardTitle>
					<CardDescription>
						※ {firstDataDate} ~ {lastDataDate}
						<br />※ データは
						<a
							href="https://www.msci.com/end-of-day-data-search"
							target="_blank"
							rel="noreferrer"
						>
							MSCIの公式ページ
						</a>
						から取得しています。
					</CardDescription>
				</CardHeader>
				<CardContent>
					<AcwiChart chart={chart} />
					<Script src="/src/client/acwi-chart.ts" />
				</CardContent>
			</Card>
		</section>
	);
}

// lucide の trending-up アイコン
function TrendingUpIcon() {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
			class="ml-2 inline-block size-4 align-[-0.05em]"
			aria-hidden="true"
		>
			<path d="M16 7h6v6" />
			<path d="m22 7-8.5 8.5-5-5L2 17" />
		</svg>
	);
}
