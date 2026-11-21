import { afterEach, describe, expect, it, vi } from "vitest";
import { fetchExchangeRate } from "./fetch-exchange-rate.ts";

afterEach(() => {
	vi.unstubAllGlobals();
});

const response = (body: unknown) =>
	vi.stubGlobal("fetch", vi.fn().mockResolvedValue(Response.json(body)));

describe("fetchExchangeRate", () => {
	it("ドル円レートを返す", async () => {
		response({
			success: true,
			timestamp: 0,
			base: "EUR",
			date: "2026-11-30",
			rates: { JPY: 160, USD: 1.25 },
		});
		expect(await fetchExchangeRate("2026-11-30", "key")).toEqual({
			ok: true,
			data: 128,
		});
	});

	it("success が false ならエラーを返す", async () => {
		response({ success: false, error: { code: 101 } });
		const result = await fetchExchangeRate("2026-11-30", "key");
		expect(result.ok).toBe(false);
	});
});
