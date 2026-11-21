import { z } from "zod";
import type { Result } from "../types/result.ts";
import { fetchJson } from "./fetch-json.ts";

// Exchange Rate API から指定日のドル円レートをフェッチ
export const fetchExchangeRate = async (
	date: string,
	apiKey: string,
): Promise<Result<number, string>> => {
	// 無料プランはHTTPSに非対応のためHTTPを使用
	const endpoint = "http://api.exchangeratesapi.io/v1";
	const accessKey = `access_key=${apiKey}`;
	const symbols = "symbols=JPY,USD";

	const res = await fetchJson(`${endpoint}/${date}?${accessKey}&${symbols}`);
	if (!res.ok) {
		return { ok: false, error: `exchangerates API (${date}): ${res.error}` };
	}

	const parsed = exchangeRatesResponseSchema.safeParse(res.data);
	if (!parsed.success) {
		return {
			ok: false,
			error: `exchangerates API (${date}): ${parsed.error.message}`,
		};
	}

	return { ok: true, data: parsed.data.rates.JPY / parsed.data.rates.USD };
};

const exchangeRatesResponseSchema = z.object({
	success: z.literal(true),
	timestamp: z.number(),
	base: z.string(),
	date: z.string(),
	rates: z.object({
		JPY: z.number().positive(),
		USD: z.number().positive(),
	}),
});
