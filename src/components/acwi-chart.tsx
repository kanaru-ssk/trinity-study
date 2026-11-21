import { niceTicks } from "../lib/nice-ticks.ts";
import { cn } from "../lib/utils.ts";
import type { Chart } from "../types/chart.ts";

/** クライアントのツールチップに渡すデータ。[日付, ドル建て, 円建て, JPY/USD] */
export type AcwiChartPoint = [string, number, number, number];

export type AcwiChartData = {
	maxLeft: number;
	maxRight: number;
	points: AcwiChartPoint[];
};

export const series = [
	{ key: "priceUsd", label: "ドル建て", color: "var(--chart-1)" },
	{ key: "priceJpy", label: "円建て", color: "var(--chart-2)" },
	{ key: "jpyPerUsd", label: "JPY/USD", color: "var(--chart-3)" },
] as const;

// SVG の座標系。preserveAspectRatio="none" で描画領域いっぱいに引き伸ばす
const SIZE = 1000;

const round = (value: number) => Math.round(value * 100) / 100;

type AcwiChartProps = {
	chart: Chart;
};

export function AcwiChart({ chart }: AcwiChartProps) {
	// priceJpyの初年度評価額をpriceUsdと揃える
	const points: AcwiChartPoint[] = chart.map((data) => [
		data.date,
		round(data.priceUsd),
		round((data.priceJpy * chart[0].priceUsd) / chart[0].priceJpy),
		round(data.jpyPerUsd),
	]);

	const leftTicks = niceTicks(
		Math.max(...points.flatMap(([, usd, jpy]) => [usd, jpy])),
	);
	const rightTicks = niceTicks(Math.max(...points.map(([, , , rate]) => rate)));
	const maxLeft = leftTicks[leftTicks.length - 1];
	const maxRight = rightTicks[rightTicks.length - 1];

	const x = (i: number) => (i / (points.length - 1)) * SIZE;
	const yLeft = (v: number) => SIZE - (v / maxLeft) * SIZE;
	const yRight = (v: number) => SIZE - (v / maxRight) * SIZE;

	const linePath = (y: (v: number) => number, col: 1 | 2 | 3) =>
		points
			.map((p, i) => `${i === 0 ? "M" : "L"}${round(x(i))},${round(y(p[col]))}`)
			.join("");
	const areaPath = (col: 1 | 2) =>
		`${linePath(yLeft, col)}L${SIZE},${SIZE}L0,${SIZE}Z`;

	// 5年ごとの1月を目盛りにする
	const xTicks = points
		.map(([date], i) => ({
			year: date.slice(0, 4),
			month: date.slice(5, 7),
			i,
		}))
		.filter(({ year, month }) => month === "01" && Number(year) % 5 === 0);

	const data: AcwiChartData = { maxLeft, maxRight, points };

	return (
		<div
			class="not-prose text-ink-muted text-xs"
			data-acwi-chart={JSON.stringify(data)}
		>
			<div
				class="relative mr-9 mb-8 ml-10 aspect-[4/3] sm:aspect-video"
				data-plot
			>
				<svg
					viewBox={`0 0 ${SIZE} ${SIZE}`}
					preserveAspectRatio="none"
					class="absolute inset-0 size-full overflow-visible"
					role="img"
					aria-label="MSCI ACWI のドル建て・円建て価格とドル円レートの推移"
				>
					{leftTicks.map((tick) => (
						<line
							x1={0}
							x2={SIZE}
							y1={yLeft(tick)}
							y2={yLeft(tick)}
							stroke="var(--border)"
							vector-effect="non-scaling-stroke"
						/>
					))}
					<path
						d={areaPath(1)}
						fill={series[0].color}
						fill-opacity={0.2}
						stroke={series[0].color}
						vector-effect="non-scaling-stroke"
					/>
					<path
						d={areaPath(2)}
						fill={series[1].color}
						fill-opacity={0.6}
						stroke={series[1].color}
						vector-effect="non-scaling-stroke"
					/>
					<path
						d={linePath(yRight, 3)}
						fill="none"
						stroke={series[2].color}
						stroke-width={2}
						vector-effect="non-scaling-stroke"
					/>
				</svg>

				{leftTicks.map((tick) => (
					<span
						class="absolute right-full mr-2 -translate-y-1/2"
						style={{ top: `${(yLeft(tick) / SIZE) * 100}%` }}
					>
						{tick}
					</span>
				))}
				{rightTicks.map((tick) => (
					<span
						class="absolute left-full ml-2 -translate-y-1/2"
						style={{ top: `${(yRight(tick) / SIZE) * 100}%` }}
					>
						{tick}
					</span>
				))}
				{xTicks.map(({ year, i }) => (
					<span
						class={cn(
							"absolute top-full mt-2 -translate-x-1/2",
							// スマホでは10年ごとに間引く
							Number(year) % 10 !== 0 && "max-sm:hidden",
						)}
						style={{ left: `${(x(i) / SIZE) * 100}%` }}
					>
						{year}
					</span>
				))}

				{/* ホバー時の表示。src/client/acwi-chart.ts が操作する */}
				<div
					class="pointer-events-none absolute inset-y-0 hidden w-px bg-ink-faint"
					data-cursor
				/>
				{series.map(({ color }) => (
					<div
						class="pointer-events-none absolute hidden size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-card"
						style={{ backgroundColor: color }}
						data-dot
					/>
				))}
				<div
					class="pointer-events-none absolute top-2 hidden min-w-36 rounded-md border bg-card px-3 py-2 text-foreground shadow-[var(--shadow-soft-2)]"
					data-tooltip
				>
					<div class="mb-1 font-semibold" data-tooltip-date />
					{series.map(({ label, color }) => (
						<div class="flex items-center gap-2">
							<span
								class="size-2 rounded-full"
								style={{ backgroundColor: color }}
							/>
							<span class="text-ink-muted">{label}</span>
							<span class="ml-auto font-mono tabular-nums" data-tooltip-value />
						</div>
					))}
				</div>
			</div>

			<ul class="flex justify-center gap-4">
				{series.map(({ label, color }) => (
					<li class="flex items-center gap-1.5">
						<span
							class="size-2.5 rounded-xs"
							style={{ backgroundColor: color }}
						/>
						{label}
					</li>
				))}
			</ul>
		</div>
	);
}
