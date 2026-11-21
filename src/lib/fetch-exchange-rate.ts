import { z } from "zod";
import type { Result } from "../types/result.ts";
import { fetchJson } from "./fetch-json.ts";

// Frankfurter API（欧州中央銀行の参照レート）から指定日のドル円レートをフェッチ
// HTTPS 対応・API キー不要。指定日が休業日の場合は直前の営業日のレートが返る
export const fetchExchangeRate = async (
	date: string,
): Promise<Result<number, string>> => {
	const endpoint = "https://api.frankfurter.dev/v1";

	const res = await fetchJson(`${endpoint}/${date}?base=USD&symbols=JPY`);
	if (!res.ok) {
		return { ok: false, error: `Frankfurter API (${date}): ${res.error}` };
	}

	const parsed = frankfurterResponseSchema.safeParse(res.data);
	if (!parsed.success) {
		return {
			ok: false,
			error: `Frankfurter API (${date}): ${parsed.error.message}`,
		};
	}

	return { ok: true, data: parsed.data.rates.JPY };
};

const frankfurterResponseSchema = z.object({
	base: z.literal("USD"),
	date: z.iso.date(),
	rates: z.object({
		JPY: z.number().positive(),
	}),
});

/** 前月比でこれ以上動いたレートは異常値として扱う */
export const MAX_MONTHLY_RATE_CHANGE = 0.2;

// 取得したレートが前月から極端に変動していないか確認する
export const isPlausibleRate = (previous: number, next: number): boolean =>
	Math.abs(next / previous - 1) <= MAX_MONTHLY_RATE_CHANGE;
