import { z } from "zod";

const chartDataSchema = z.object({
  id: z.string(),
  date: z.iso.datetime(),
  priceUsd: z.preprocess((v) => Number(v), z.number()),
  priceJpy: z.preprocess((v) => Number(v), z.number()),
  jpyUsd: z.preprocess((v) => Number(v), z.number()),
});
export const chartSchema = z.array(chartDataSchema);

export type ChartData = z.infer<typeof chartDataSchema>;
export type Chart = ChartData[];
