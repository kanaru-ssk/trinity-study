import { afterEach, describe, expect, it, vi } from "vitest";
import { fetchAcwiChart } from "./fetch-acwi-chart.ts";

const msciResponse = (levels: { level_eod: number; calc_date: number }[]) => ({
	msci_index_code: "892400",
	index_variant_type: "STRD",
	ISO_currency_symbol: "USD",
	indexes: { INDEX_LEVELS: levels },
});

afterEach(() => {
	vi.unstubAllGlobals();
});

describe("fetchAcwiChart", () => {
	it("月末データを変換して返す", async () => {
		vi.stubGlobal(
			"fetch",
			vi
				.fn()
				.mockResolvedValue(
					Response.json(
						msciResponse([{ level_eod: 1000.5, calc_date: 20261130 }]),
					),
				),
		);
		expect(await fetchAcwiChart(new Date("2026-10-30"))).toEqual({
			ok: true,
			data: [{ date: "2026-11-30", priceUsd: 1000.5 }],
		});
	});

	it("新しいデータがなければ空配列を返す", async () => {
		vi.stubGlobal(
			"fetch",
			vi.fn().mockResolvedValue(Response.json(msciResponse([]))),
		);
		expect(await fetchAcwiChart(new Date("2026-10-30"))).toEqual({
			ok: true,
			data: [],
		});
	});

	it("レスポンスの形式が変わったらエラーを返す", async () => {
		vi.stubGlobal(
			"fetch",
			vi.fn().mockResolvedValue(Response.json({ unexpected: true })),
		);
		const result = await fetchAcwiChart(new Date("2026-10-30"));
		expect(result.ok).toBe(false);
	});
});
