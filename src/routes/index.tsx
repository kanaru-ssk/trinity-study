import type { Handler } from "hono";
import { Script } from "vite-ssr-components/hono";
import { AcwiChart } from "../components/acwi-chart";
import { SimulationTable } from "../components/simulation-table";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "../components/ui/card";
import csv from "../data/chart.csv?raw";
import indexJson from "../data/index.json";
import { formatDate } from "../lib/date";
import { indexMetaSchema, indexVariantLabels } from "../lib/index-variant";
import { makeSimulation } from "../lib/make-simulation";
import { parseCsvToCart } from "../lib/parse-csv-to-cart";
import type { Chart } from "../types/chart";
import type { SimulationMeta } from "../types/simulation";

const ssg = true;

const withdrawalRates = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const GET: Handler = (c) => {
	// CSVからチャートデータ取得
	const parsed = parseCsvToCart(csv);
	if (!parsed.ok) {
		throw new Error(parsed.error);
	}
	const chart = parsed.data;
	const { indexVariant } = indexMetaSchema.parse(indexJson);
	const indexLabel = indexVariantLabels[indexVariant];

	// 取り崩しシミュレーション実行
	const { simulationMeta, simulationResults } = makeSimulation(
		chart,
		withdrawalRates,
	);

	const firstDataDate = formatDate(new Date(chart[0].date), "YYYY/MM/DD");
	const lastDataDate = formatDate(
		new Date(chart[chart.length - 1].date),
		"YYYY/MM/DD",
	);
	const currentMonth = formatDate(new Date(), "YYYY年M月");

	return c.render(
		<main class="prose prose-neutral mx-auto max-w-5xl space-y-16 px-4 py-20">
			<div class="not-prose">
				<span class="inline-flex items-center rounded-full bg-card px-2 py-1 font-semibold text-[12px] text-primary leading-[1.33] tracking-[0.125px]">
					{currentMonth}最新
				</span>
				<h1 class="mt-4 mb-0 font-bold text-[40px] text-foreground leading-[1.1] tracking-[-1px]">
					日本版トリニティスタディ
				</h1>
			</div>
			<SimulationSection
				withdrawalRates={withdrawalRates}
				simulationMeta={simulationMeta}
				simulationResults={simulationResults}
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
			<AlgorithmSection chart={chart} simulationMeta={simulationMeta} />
			<DataSourceSection />
		</main>,
		{
			title: `日本版トリニティスタディ | ${currentMonth}最新`,
			description:
				"eMAXIS Slim 全世界株式（オール・カントリー）が連動する、MSCI ACWIを日本円建てで取崩しシミュレーション。4%ルールが日本でも再現性のある投資方法なのか検証しました。",
		},
	);
};

export { GET, ssg };

type SimulationSectionProps = {
	withdrawalRates: number[];
	simulationMeta: SimulationMeta[];
	simulationResults: number[][];
	firstDataDate: string;
	lastDataDate: string;
	indexLabel: string;
};

function SimulationSection({
	withdrawalRates,
	simulationMeta,
	simulationResults,
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
					<SimulationTable
						withdrawalRates={withdrawalRates}
						simulationMeta={simulationMeta}
						simulationResults={simulationResults}
					/>
				</CardContent>
			</Card>
		</section>
	);
}

type ChartSectionProps = {
	chart: Chart;
	firstDataDate: string;
	lastDataDate: string;
};

function ChartSection({
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

const sectionHeading2 =
	"font-bold text-[26px] leading-[1.23] tracking-[-0.625px]";
const sectionHeading3 =
	"font-bold text-[22px] leading-[1.27] tracking-[-0.25px]";

function AboutSection() {
	return (
		<section>
			<Card>
				<CardContent>
					<h2 class={sectionHeading2}>当サイトについて</h2>
					<p>
						MSCI
						ACWIを日本円建てで取崩しシミュレーションした日本版トリニティスタディです。
					</p>
					<p>
						毎月最新データを自動的に取得し、シミュレーション結果を更新しています。
					</p>
				</CardContent>
			</Card>
		</section>
	);
}

function TrinityStudySection() {
	return (
		<section>
			<Card>
				<CardContent>
					<h2 class={sectionHeading2}>トリニティスタディとは？</h2>
					<p>
						1998年、
						<a
							href="https://www.aaii.com/journal"
							target="_blank"
							rel="noreferrer"
						>
							THE AAII JOURNAL
						</a>
						に掲載された以下の論文の通称。
					</p>
					<p>
						<a
							href="https://www.aaii.com/files/pdf/6794_retirement-savings-choosing-a-withdrawal-rate-that-is-sustainable.pdf"
							target="_blank"
							rel="noreferrer"
						>
							Retirement Savings: Choosing a Withdrawal Rate That Is Sustainable
						</a>
					</p>
					<p>
						現役時に貯めた資産を取り崩して生活する退職者を想定し、株式および債券で運用された資産の安全な取崩し率を調べた論文です。
					</p>
					<p>
						この論文では株式にS&P500(アメリカの株式インデックス)、債券にアメリカの長期高格付け社債を使用してシミュレーションしています。
					</p>
					<p>
						本サイトでは、日本人向けとしてACWI(全世界株式インデックス)を日本円建てで取崩すシミュレーションをしました。
					</p>
				</CardContent>
			</Card>
		</section>
	);
}

type AlgorithmSectionProps = {
	chart: Chart;
	simulationMeta: SimulationMeta[];
};

function AlgorithmSection({ chart, simulationMeta }: AlgorithmSectionProps) {
	return (
		<section>
			<Card>
				<CardContent>
					<h2 class={sectionHeading2}>シミュレーションアルゴリズム</h2>
					<p>
						このサイトで使用したプログラムは
						<a
							href="https://github.com/kanaru-ssk/trinity-study"
							target="_blank"
							rel="noreferrer"
						>
							GitHub
						</a>
						で公開しています。ソースコード内の
						<a
							href="https://github.com/kanaru-ssk/trinity-study/blob/main/src/lib/make-simulation.ts"
							target="_blank"
							rel="noreferrer"
						>
							make-simulation.ts
						</a>
						で実際に動いているシミュレーションアルゴリズムをご確認頂けます。
					</p>
					<p>上記ファイルの関数で以下の手順でシミュレーションしています。</p>
					<ol>
						<li>
							初年度の資産額を100に設定。毎年の取り崩し額は取り崩し率の数値（5%取り崩しの場合5）となる。
						</li>
						<li>初年度はそのまま取り崩し(100 – 5で資産残高95)</li>
						<li>
							2年目以降は資産残高に1年間の騰落率をかけて時価を計算し、そこから取り崩す。（10%値上がりした場合、95*1.1–5=99.5）
						</li>
						<li>
							3を取り崩し年数分繰り返し、資産残高が一度も0未満（マイナス）にならなければ成功とする。
						</li>
					</ol>
					<p>
						取り崩しは毎年の初めに行うため、取り崩し年数が15年の場合、取り崩しは15回、騰落率をかけるのは14回（開始月から14年後まで）となる。
					</p>
					<TrialExample chart={chart} meta={simulationMeta[0]} />
				</CardContent>
			</Card>
		</section>
	);
}

type TrialExampleProps = {
	chart: Chart;
	meta: SimulationMeta | undefined;
};

// 試行回数の説明。実際のデータから例を作る
function TrialExample({ chart, meta }: TrialExampleProps) {
	if (!meta) return null;
	const { payoutPeriod, numOfSimulation } = meta;
	const month = (index: number) =>
		formatDate(new Date(chart[index].date), "YYYY年M月");
	const trial = (n: number) => {
		const start = n - 1;
		const end = start + 12 * (payoutPeriod - 1);
		return `${n}回目、${month(start)}から${month(end)}。`;
	};
	const trials =
		numOfSimulation > 5
			? [1, 2, 3, null, numOfSimulation - 1, numOfSimulation]
			: Array.from({ length: numOfSimulation }, (_, i) => i + 1);

	return (
		<>
			<h3 class={sectionHeading3}>試行回数について</h3>
			<p>上の操作をデータ数が許す限り、開始月を1か月ずつずらして繰り返す。</p>
			<p>
				例えば、{month(0)}から{month(chart.length - 1)}
				のデータ（{chart.length}か月分）で、{payoutPeriod}
				年の取り崩し年数でシミュレーションする回数は以下のようになる。
			</p>
			<ul>
				{trials.map((n) => (
					<li>{n === null ? "..." : trial(n)}</li>
				))}
			</ul>
			<p>
				計算式にすると、
				<code>(データ月数) - 12 * (取り崩し年数 - 1)</code>
				となる（{chart.length} - 12 * {payoutPeriod - 1} = {numOfSimulation}
				回）。
			</p>
		</>
	);
}

function DataSourceSection() {
	return (
		<section>
			<Card>
				<CardContent>
					<h2 class={sectionHeading2}>データ入手元</h2>
					<dl>
						<dt>ACWI のチャートデータ</dt>
						<dd>
							<a
								href="https://www.msci.com/end-of-day-data-search"
								target="_blank"
								rel="noreferrer"
							>
								End of day index data search
							</a>
						</dd>
						<dt>ドル円為替データ</dt>
						<dd>
							<a
								href="https://frankfurter.dev/"
								target="_blank"
								rel="noreferrer"
							>
								Frankfurter API
							</a>
							（2026年10月までのデータは
							<a
								href="https://exchangeratesapi.io/"
								target="_blank"
								rel="noreferrer"
							>
								exchangerates API
							</a>
							）
						</dd>
					</dl>
				</CardContent>
			</Card>
		</section>
	);
}
