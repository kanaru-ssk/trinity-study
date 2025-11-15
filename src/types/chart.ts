import { z } from "zod";

const chartDataSchema = z.object({
  date: z.iso.date(),
  priceUsd: z.preprocess((v) => Number(v), z.number()),
  priceJpy: z.preprocess((v) => Number(v), z.number()),
  jpyPerUsd: z.preprocess((v) => Number(v), z.number()),
});
export const chartSchema = z.array(chartDataSchema);

export type ChartData = z.infer<typeof chartDataSchema>;
export type Chart = ChartData[];
