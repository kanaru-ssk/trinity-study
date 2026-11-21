import fs from "node:fs";
import { describe, expect, it } from "vitest";
import { parseCsvToCart } from "./parse-csv-to-cart.ts";

const header = "date,priceUsd,priceJpy,jpyPerUsd";

describe("parseCsvToCart", () => {
	it("CSV をチャートデータに変換する", () => {
		const result = parseCsvToCart(`${header}\n1987-12-31,100,12100,121\n`);
		expect(result).toEqual({
			ok: true,
			data: [
				{ date: "1987-12-31", priceUsd: 100, priceJpy: 12100, jpyPerUsd: 121 },
			],
		});
	});

	it("欠損セルがあるとエラーになる", () => {
		const result = parseCsvToCart(`${header}\n1987-12-31,100,,121`);
		expect(result.ok).toBe(false);
	});

	it("0 以下の値があるとエラーになる", () => {
		const result = parseCsvToCart(`${header}\n1987-12-31,100,0,121`);
		expect(result.ok).toBe(false);
	});

	it("年をまたいで月が連続していれば成功する", () => {
		const result = parseCsvToCart(
			`${header}\n1987-11-30,1,1,1\n1987-12-31,1,1,1\n1988-01-29,1,1,1`,
		);
		expect(result.ok).toBe(true);
	});

	it("月が欠けているとエラーになる", () => {
		const result = parseCsvToCart(
			`${header}\n1987-12-31,1,1,1\n1988-02-29,1,1,1`,
		);
		expect(result).toEqual({
			ok: false,
			error: expect.stringContaining("月が連続していません"),
		});
	});

	it("同じ月が重複しているとエラーになる", () => {
		const result = parseCsvToCart(
			`${header}\n1987-12-30,1,1,1\n1987-12-31,1,1,1`,
		);
		expect(result.ok).toBe(false);
	});

	it("src/data/chart.csv は検証を通る", () => {
		const csv = fs.readFileSync(
			new URL("../data/chart.csv", import.meta.url),
			"utf8",
		);
		expect(parseCsvToCart(csv).ok).toBe(true);
	});
});
