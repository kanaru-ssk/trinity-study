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
		expect(await fetchAcwiChart("2026-10-30", "STRD")).toEqual({
			ok: true,
			data: [{ date: "2026-11-30", priceUsd: 1000.5 }],
		});
	});

	it("最終データ日の翌日から、直近の平日までを取得する", async () => {
		const fetch = vi.fn().mockResolvedValue(Response.json(msciResponse([])));
		vi.stubGlobal("fetch", fetch);
		// 2026-11-21 は土曜日
		await fetchAcwiChart(
			"2026-10-31",
			"NETR",
			new Date("2026-11-21T12:00:00Z"),
		);
		const url = new URL(fetch.mock.calls[0][0]);
		expect(url.searchParams.get("start_date")).toBe("20261101");
		expect(url.searchParams.get("end_date")).toBe("20261123");
		expect(url.searchParams.get("index_variant")).toBe("NETR");
	});

	it("新しいデータがなければ空配列を返す", async () => {
		vi.stubGlobal(
			"fetch",
			vi.fn().mockResolvedValue(Response.json(msciResponse([]))),
		);
		expect(await fetchAcwiChart("2026-10-30", "STRD")).toEqual({
			ok: true,
			data: [],
		});
	});

	it("レスポンスの形式が変わったらエラーを返す", async () => {
		vi.stubGlobal(
			"fetch",
			vi.fn().mockResolvedValue(Response.json({ unexpected: true })),
		);
		const result = await fetchAcwiChart("2026-10-30", "STRD");
		expect(result.ok).toBe(false);
	});
});
