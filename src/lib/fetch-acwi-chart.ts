import { z } from "zod";
import type { ChartData } from "../types/chart.ts";
import type { Result } from "../types/result.ts";
import {
	addDays,
	formatDate,
	fromCompactDate,
	nextWeekday,
	toCompactDate,
} from "./date.ts";
import { fetchJson } from "./fetch-json.ts";
import type { IndexVariant } from "./index-variant.ts";

export type AcwiChart = Omit<ChartData, "priceJpy" | "jpyPerUsd">[];

// MSCI API から最新のACWIチャートデータをフェッチ
// 新しいデータがない場合は空配列を返す。取得や解析に失敗した場合はエラーを返す
// lastDataDate: CSV の最終データ日（YYYY-MM-DD）。その翌日以降のデータを取得する
export const fetchAcwiChart = (
	lastDataDate: string,
	indexVariant: IndexVariant,
	now = new Date(),
): Promise<Result<AcwiChart, string>> =>
	fetchAcwiLevels(addDays(lastDataDate, 1), indexVariant, now);

// MSCI API から startDate（YYYY-MM-DD）以降の月末データを取得する
export const fetchAcwiLevels = async (
	startDate: string,
	indexVariant: IndexVariant,
	now = new Date(),
): Promise<Result<AcwiChart, string>> => {
	const params = new URLSearchParams({
		currency_symbol: "USD",
		index_variant: indexVariant,
		start_date: toCompactDate(startDate),
		end_date: toCompactDate(nextWeekday(formatDate(now))),
		data_frequency: "END_OF_MONTH",
		index_codes: "892400", // MSCI ACWI
	});

	const res = await fetchJson(
		`https://app2.msci.com/products/service/index/indexmaster/getLevelDataForGraph?${params}`,
	);
	if (!res.ok) {
		return { ok: false, error: `MSCI API: ${res.error}` };
	}

	const parsed = msciResponseSchema.safeParse(res.data);
	if (!parsed.success) {
		return { ok: false, error: `MSCI API: ${parsed.error.message}` };
	}

	return {
		ok: true,
		data: parsed.data.indexes.INDEX_LEVELS.map((level) => ({
			date: fromCompactDate(level.calc_date),
			priceUsd: level.level_eod,
		})),
	};
};

const msciResponseSchema = z.object({
	msci_index_code: z.string(),
	index_variant_type: z.string(),
	ISO_currency_symbol: z.string(),
	indexes: z.object({
		INDEX_LEVELS: z.array(
			z.object({
				level_eod: z.number(),
				calc_date: z.number(),
			}),
		),
	}),
});
