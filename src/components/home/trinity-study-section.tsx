import { Card, CardContent } from "../ui/card.tsx";
import { sectionHeading2 } from "./headings.ts";

export function TrinityStudySection() {
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
