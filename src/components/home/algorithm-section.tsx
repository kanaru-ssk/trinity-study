import { formatDate } from "../../lib/date.ts";
import type { Chart } from "../../types/chart.ts";
import type { SimulationRow } from "../../types/simulation.ts";
import { Card, CardContent } from "../ui/card.tsx";
import { sectionHeading2, sectionHeading3 } from "./headings.ts";

type AlgorithmSectionProps = {
	chart: Chart;
	rows: SimulationRow[];
};

export function AlgorithmSection({ chart, rows }: AlgorithmSectionProps) {
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
					<h3 class={sectionHeading3}>インフレ（物価上昇）について</h3>
					<p>
						取り崩し額は名目で毎年一定（初年度の資産額 ×
						取り崩し率）としており、インフレ調整はしていません。
					</p>
					<p>
						オリジナルのトリニティスタディや「4%ルール」では、取り崩し額を毎年の物価上昇率に合わせて増やす前提でも検証しています。物価が上昇する局面では、実際に必要な取り崩し額は増えるため、当サイトの結果は楽観的な数値になります。
					</p>
					<p>
						取り崩しは毎年の初めに行うため、取り崩し年数が15年の場合、取り崩しは15回、騰落率をかけるのは14回（開始月から14年後まで）となる。
					</p>
					<TrialExample chart={chart} row={rows[0]} />
				</CardContent>
			</Card>
		</section>
	);
}

type TrialExampleProps = {
	chart: Chart;
	row: SimulationRow | undefined;
};

// 試行回数の説明。実際のデータから例を作る
function TrialExample({ chart, row }: TrialExampleProps) {
	if (!row) return null;
	const { payoutPeriod, numOfSimulation } = row;
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
