import type { Handler } from "hono";
import { Card, CardContent } from "../../components/ui/card";

const ssg = true;

const heading2 = "font-bold text-[26px] leading-[1.23] tracking-[-0.625px]";

const GET: Handler = (c) => {
	return c.render(
		<main class="prose prose-neutral mx-auto max-w-5xl space-y-16 px-4 py-20">
			<div class="not-prose">
				<h1 class="mb-0 font-bold text-[40px] text-foreground leading-[1.1] tracking-[-1px]">
					プライバシーポリシー・免責事項
				</h1>
			</div>
			<section id="disclaimer">
				<Card>
					<CardContent>
						<h2 class={heading2}>免責事項</h2>
						<ul>
							<li>
								当サイトのシミュレーション結果は、過去の指数・為替データに基づく試算であり、将来の運用成果を示唆・保証するものではありません。
							</li>
							<li>
								当サイトは特定の金融商品の購入・売却を勧誘するものではなく、投資助言を目的としたものではありません。投資に関する最終決定は、ご自身の判断と責任で行ってください。
							</li>
							<li>
								シミュレーションでは、信託報酬などの手数料、税金、インフレ（物価上昇）は考慮していません。前提条件の詳細はトップページの「シミュレーションアルゴリズム」をご確認ください。
							</li>
							<li>
								掲載している情報の正確性には注意を払っていますが、その正確性・完全性を保証するものではありません。当サイトの情報を利用したことで生じたいかなる損害についても、責任を負いかねます。
							</li>
						</ul>
					</CardContent>
				</Card>
			</section>
			<section id="privacy">
				<Card>
					<CardContent>
						<h2 class={heading2}>プライバシーポリシー</h2>
						<h3>アクセス解析ツールについて</h3>
						<p>
							当サイトでは、Google タグマネージャーを通じて、Google
							が提供するアクセス解析ツールを利用しています。これらのツールはトラフィックデータの収集のために
							Cookie
							を使用しています。トラフィックデータは匿名で収集されており、個人を特定するものではありません。
						</p>
						<h3>広告の配信について</h3>
						<p>
							当サイトでは、第三者配信の広告サービス「Google
							アドセンス」を利用する場合があります。
						</p>
						<p>
							Google などの第三者配信事業者は、Cookie
							を使用して、ユーザーが当サイトや他のウェブサイトに過去にアクセスした際の情報に基づいて広告を配信します。Google
							が広告 Cookie
							を使用することにより、ユーザーが当サイトや他のサイトにアクセスした際の情報に基づいて、Google
							やそのパートナーが適切な広告を表示できます。
						</p>
						<p>
							ユーザーは、
							<a
								href="https://adssettings.google.com/"
								target="_blank"
								rel="noreferrer"
							>
								広告設定
							</a>
							でパーソナライズ広告を無効にできます。また、
							<a
								href="https://www.aboutads.info/choices/"
								target="_blank"
								rel="noreferrer"
							>
								www.aboutads.info
							</a>
							にアクセスすれば、パーソナライズ広告に使われる第三者配信事業者の
							Cookie を無効にできます。
						</p>
						<p>
							Google によるデータの取り扱いについては、
							<a
								href="https://policies.google.com/technologies/partner-sites?hl=ja"
								target="_blank"
								rel="noreferrer"
							>
								Google のサービスを使用するサイトやアプリから収集した情報の
								Google による使用
							</a>
							をご確認ください。
						</p>
						<h3>改定</h3>
						<p>
							本ポリシーの内容は、必要に応じて予告なく変更することがあります。
						</p>
						<p>制定日: 2026年11月21日</p>
					</CardContent>
				</Card>
			</section>
		</main>,
		{
			title: "プライバシーポリシー・免責事項 | 日本版トリニティスタディ",
			description:
				"日本版トリニティスタディのプライバシーポリシー（アクセス解析・広告配信）と免責事項です。",
			path: "/privacy",
		},
	);
};

export { GET, ssg };
