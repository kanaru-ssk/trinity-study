import type { Handler } from "hono";
import { AboutSection } from "../components/home/about-section.tsx";
import { AlgorithmSection } from "../components/home/algorithm-section.tsx";
import { ChartSection } from "../components/home/chart-section.tsx";
import { DataSourceSection } from "../components/home/data-source-section.tsx";
import { SimulationSection } from "../components/home/simulation-section.tsx";
import { TrinityStudySection } from "../components/home/trinity-study-section.tsx";
import indexJson from "../data/index.json";
import { formatDate } from "../lib/date.ts";
import { indexMetaSchema, indexVariantLabels } from "../lib/index-variant.ts";
import { loadChart } from "../lib/load-chart.ts";
import { makeSimulation } from "../lib/make-simulation.ts";

const ssg = true;

const withdrawalRates = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const GET: Handler = (c) => {
	// CSVからチャートデータ取得
	const chart = loadChart();
	const { indexVariant } = indexMetaSchema.parse(indexJson);
	const indexLabel = indexVariantLabels[indexVariant];

	// 取り崩しシミュレーション実行
	const rows = makeSimulation(chart, withdrawalRates);

	const firstDataDate = formatDate(new Date(chart[0].date), "YYYY/MM/DD");
	const lastDataDate = formatDate(
		new Date(chart[chart.length - 1].date),
		"YYYY/MM/DD",
	);
	// ビルド日時ではなくデータの最終月を表示する（更新が止まっていても「最新」と誤認させないため）
	const lastDataMonth = formatDate(
		new Date(chart[chart.length - 1].date),
		"YYYY年M月",
	);

	return c.render(
		<main class="prose prose-neutral mx-auto max-w-5xl space-y-16 px-4 py-20">
			<div class="not-prose">
				<span class="inline-flex items-center rounded-full bg-card px-2 py-1 font-semibold text-[12px] text-primary leading-[1.33] tracking-[0.125px]">
					{lastDataMonth}末までのデータ
				</span>
				<h1 class="mt-4 mb-0 font-bold text-[40px] text-foreground leading-[1.1] tracking-[-1px]">
					日本版トリニティスタディ
				</h1>
			</div>
			<SimulationSection
				withdrawalRates={withdrawalRates}
				rows={rows}
				firstDataDate={firstDataDate}
				lastDataDate={lastDataDate}
				indexLabel={indexLabel}
			/>
			<ChartSection
				chart={chart}
				firstDataDate={firstDataDate}
				lastDataDate={lastDataDate}
			/>
			<AboutSection />
			<TrinityStudySection />
			<AlgorithmSection chart={chart} rows={rows} />
			<DataSourceSection />
		</main>,
		{
			title: `日本版トリニティスタディ | ${lastDataMonth}末までのデータ`,
			description:
				"eMAXIS Slim 全世界株式（オール・カントリー）が連動する、MSCI ACWIを日本円建てで取崩しシミュレーション。4%ルールが日本でも再現性のある投資方法なのか検証しました。",
			path: "/",
		},
	);
};

export { GET, ssg };
