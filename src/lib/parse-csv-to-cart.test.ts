import { describe, expect, it } from "vitest";
import { parseCsvToCart } from "./parse-csv-to-cart.ts";

describe("parseCsvToCart", () => {
	it("CSV をチャートデータに変換する", () => {
		const result = parseCsvToCart(
			"date,priceUsd,priceJpy,jpyPerUsd\n1987-12-31,100,12100,121\n",
		);
		expect(result).toEqual({
			ok: true,
			data: [
				{ date: "1987-12-31", priceUsd: 100, priceJpy: 12100, jpyPerUsd: 121 },
			],
		});
	});

	it("欠損セルがあるとエラーになる", () => {
		const result = parseCsvToCart(
			"date,priceUsd,priceJpy,jpyPerUsd\n1987-12-31,100,,121",
		);
		expect(result.ok).toBe(false);
	});
});
