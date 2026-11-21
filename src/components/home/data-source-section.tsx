import { Card, CardContent } from "../ui/card.tsx";
import { sectionHeading2 } from "./headings.ts";

export function DataSourceSection() {
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
