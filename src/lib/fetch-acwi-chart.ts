import z from "zod";
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

type AcwiChart = Omit<ChartData, "priceJpy" | "jpyPerUsd">[];

// MSCI API から最新のACWIチャートデータをフェッチ
// 新しいデータがない場合は空配列を返す。取得や解析に失敗した場合はエラーを返す
// lastDataDate: CSV の最終データ日（YYYY-MM-DD）。その翌日以降のデータを取得する
export const fetchAcwiChart = async (
	lastDataDate: string,
	now = new Date(),
): Promise<Result<AcwiChart, string>> => {
	const lastDataDateStr = toCompactDate(addDays(lastDataDate, 1));
	const latestWeekDayStr = toCompactDate(nextWeekday(formatDate(now)));

	const endpoint =
		"https://app2.msci.com/products/service/index/indexmaster/getLevelDataForGraph";
	const currencySymbol = "currency_symbol=USD";
	const indexVariant = "index_variant=STRD";
	const startDate = `start_date=${lastDataDateStr}`;
	const endDate = `end_date=${latestWeekDayStr}`;
	const dataFrequency = "data_frequency=END_OF_MONTH";
	const indexCodes = "index_codes=892400";

	const res = await fetchJson(
		`${endpoint}?${currencySymbol}&${indexVariant}&${startDate}&${endDate}&${dataFrequency}&${indexCodes}`,
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
