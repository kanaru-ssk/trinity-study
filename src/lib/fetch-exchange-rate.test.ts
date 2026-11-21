import { afterEach, describe, expect, it, vi } from "vitest";
import { fetchExchangeRate, isPlausibleRate } from "./fetch-exchange-rate.ts";

afterEach(() => {
	vi.unstubAllGlobals();
});

const response = (body: unknown) => {
	const fetch = vi.fn().mockResolvedValue(Response.json(body));
	vi.stubGlobal("fetch", fetch);
	return fetch;
};

describe("fetchExchangeRate", () => {
	it("HTTPS でドル円レートを取得する", async () => {
		const fetch = response({
			amount: 1,
			base: "USD",
			date: "2026-11-30",
			rates: { JPY: 155.5 },
		});
		expect(await fetchExchangeRate("2026-11-30")).toEqual({
			ok: true,
			data: 155.5,
		});
		expect(fetch.mock.calls[0][0]).toMatch(/^https:\/\//);
	});

	it("レスポンスの形式が違えばエラーを返す", async () => {
		response({ message: "not found" });
		const result = await fetchExchangeRate("2026-11-30");
		expect(result.ok).toBe(false);
	});
});

describe("isPlausibleRate", () => {
	it("前月比 20% 以内なら妥当とみなす", () => {
		expect(isPlausibleRate(150, 165)).toBe(true);
		expect(isPlausibleRate(150, 120)).toBe(true);
	});

	it("前月比 20% を超えたら異常値とみなす", () => {
		expect(isPlausibleRate(150, 181)).toBe(false);
		expect(isPlausibleRate(150, 1.5)).toBe(false);
	});
});
