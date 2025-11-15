import { z } from "zod";
import { env } from "@/env";

// Exchange Rate API から指定日のドル円レートをフェッチ
export const fetchExchangeRate = async (
  date: string,
): Promise<number | null> => {
  const endpoint = "http://api.exchangeratesapi.io/v1";
  const accessKey = `access_key=${env.EXCHANGE_RATE_API_KEY}`;
  const symbols = "symbols=JPY,USD";

  const res = await fetch(`${endpoint}/${date}?${accessKey}&${symbols}`);
  if (!res.ok) {
    console.error(`${res.status}: ${res.statusText}`);
    return null;
  }

  const parsed = exchangeRatesResponseSchema.safeParse(await res.json());
  if (!parsed.success) {
    console.error(parsed.error);
    return null;
  }

  return parsed.data.rates.JPY / parsed.data.rates.USD;
};

const exchangeRatesResponseSchema = z.object({
  success: z.boolean(),
  timestamp: z.number(),
  base: z.string(),
  date: z.string(),
  rates: z.object({
    JPY: z.number(),
    USD: z.number(),
  }),
});
