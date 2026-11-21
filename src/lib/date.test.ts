import { describe, expect, it } from "vitest";
import {
	addDays,
	formatDate,
	fromCompactDate,
	nextWeekday,
	toCompactDate,
} from "./date.ts";

// vite.config.ts で TZ=America/New_York にして、ローカルタイム依存を検出する
describe("date", () => {
	it("テストは UTC より西のタイムゾーンで実行される", () => {
		expect(new Date("2026-01-01").getTimezoneOffset()).toBeGreaterThan(0);
	});

	it("formatDate は YYYY-MM-DD 文字列の日付をずらさない", () => {
		const date = new Date("2026-10-30");
		expect(formatDate(date)).toBe("2026-10-30");
		expect(formatDate(date, "YYYY/MM/DD")).toBe("2026/10/30");
		expect(formatDate(new Date("2026-11-01"), "YYYY年M月")).toBe("2026年11月");
	});

	it("addDays は月・年をまたぐ", () => {
		expect(addDays("2026-10-31", 1)).toBe("2026-11-01");
		expect(addDays("2026-12-31", 1)).toBe("2027-01-01");
	});

	it("compact 形式と相互変換する", () => {
		expect(toCompactDate("2023-11-05")).toBe("20231105");
		expect(fromCompactDate(20231105)).toBe("2023-11-05");
	});

	it("nextWeekday は土日を月曜日にする", () => {
		expect(nextWeekday("2026-11-20")).toBe("2026-11-20"); // 金
		expect(nextWeekday("2026-11-21")).toBe("2026-11-23"); // 土
		expect(nextWeekday("2026-11-22")).toBe("2026-11-23"); // 日
	});
});
