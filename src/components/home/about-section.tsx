import { Card, CardContent } from "../ui/card.tsx";
import { sectionHeading2 } from "./headings.ts";

export function AboutSection() {
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
