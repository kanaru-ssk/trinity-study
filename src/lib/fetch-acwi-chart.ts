import z from "zod";
import type { ChartData } from "../types/chart.ts";
import type { Result } from "../types/result.ts";
import { fetchJson } from "./fetch-json.ts";

type AcwiChart = Omit<ChartData, "priceJpy" | "jpyPerUsd">[];

// MSCI API から最新のACWIチャートデータをフェッチ
// 新しいデータがない場合は空配列を返す。取得や解析に失敗した場合はエラーを返す
export const fetchAcwiChart = async (
	lastDataDate: Date,
): Promise<Result<AcwiChart, string>> => {
	const cloneLastDataDate = new Date(lastDataDate);
	cloneLastDataDate.setDate(cloneLastDataDate.getDate() + 1);
	const lastDataDateStr = toNoBreakStr(cloneLastDataDate);
	const latestWeekDayStr = toNoBreakStr(getNextWeekDay(new Date()));

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
			date: format(level.calc_date),
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

// 2023-11-05 -> "20231105"
const toNoBreakStr = (date: Date) => {
	const year = String(date.getFullYear());
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const day = String(date.getDate()).padStart(2, "0");

	return `${year}${month}${day}`;
};

// 20231105 -> "2023-11-05"
const format = (dateNumber: number) => {
	const noBreakStr = String(dateNumber);
	const year = noBreakStr.slice(0, 4);
	const month = noBreakStr.slice(4, 6);
	const day = noBreakStr.slice(6);
	return `${year}-${month}-${day}`;
};

// 土日の時は次の月曜日を返す
const getNextWeekDay = (date: Date) => {
	const nextWeekDay = new Date(date);
	const day = date.getDay();

	if (day === 0) nextWeekDay.setDate(date.getDate() + 1);
	if (day === 6) nextWeekDay.setDate(date.getDate() + 2);

	return nextWeekDay;
};
