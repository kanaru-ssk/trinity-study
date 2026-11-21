import csv from "../data/chart.csv?raw";
import type { Chart } from "../types/chart.ts";
import { parseCsvToCart } from "./parse-csv-to-cart.ts";

// src/data/chart.csv を読み込む。不正なデータならビルドを失敗させる
export function loadChart(): Chart {
	const parsed = parseCsvToCart(csv);
	if (!parsed.ok) {
		throw new Error(parsed.error);
	}
	return parsed.data;
}
