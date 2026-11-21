// 日付は "YYYY-MM-DD" 文字列で扱う。
// new Date("YYYY-MM-DD") は UTC 0 時として解釈されるため、Date を使う場合は必ず UTC の getter / setter を使う
// （ローカルタイムの getter を使うと、UTC より西のタイムゾーンで 1 日ずれる）

type Template = "YYYY-MM-DD" | "YYYY/MM/DD" | "YYYY年M月";

export function formatDate(date: Date, template: Template = "YYYY-MM-DD") {
	const yyyy = date.getUTCFullYear();
	const m = date.getUTCMonth() + 1;
	const mm = String(m).padStart(2, "0");
	const d = date.getUTCDate();
	const dd = String(d).padStart(2, "0");

	if (template === "YYYY年M月") {
		return `${yyyy}年${m}月`;
	}

	if (template === "YYYY/MM/DD") {
		return `${yyyy}/${mm}/${dd}`;
	}

	// YYYY-MM-DD
	return `${yyyy}-${mm}-${dd}`;
}

/** "2023-11-05" に days 日を足す */
export function addDays(date: string, days: number): string {
	const d = new Date(date);
	d.setUTCDate(d.getUTCDate() + days);
	return formatDate(d);
}

/** "2023-11-05" -> "20231105" */
export const toCompactDate = (date: string): string => date.replaceAll("-", "");

/** 20231105 -> "2023-11-05" */
export function fromCompactDate(compact: number | string): string {
	const s = String(compact);
	return `${s.slice(0, 4)}-${s.slice(4, 6)}-${s.slice(6, 8)}`;
}

/** 土日なら次の月曜日を返す */
export function nextWeekday(date: string): string {
	const day = new Date(date).getUTCDay();
	if (day === 0) return addDays(date, 1);
	if (day === 6) return addDays(date, 2);
	return date;
}
