import { describe, expect, it } from "vitest";
import { daysSince, isStale } from "./freshness.ts";

describe("freshness", () => {
	it("経過日数を返す", () => {
		expect(daysSince("2026-10-30", new Date("2026-12-01T00:00:00Z"))).toBe(32);
	});

	it("月初に前月分が未公開でも古いとはみなさない", () => {
		expect(isStale("2026-10-30", new Date("2026-12-01T00:00:00Z"))).toBe(false);
	});

	it("2 か月分取れていなければ古いとみなす", () => {
		expect(isStale("2026-10-30", new Date("2027-01-01T00:00:00Z"))).toBe(true);
	});
});
