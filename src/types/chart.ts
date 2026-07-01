import { z } from "zod";

// "" (欠損セル) を Number() に通すと 0 になってしまうため NaN にして弾く
const toNumber = (v: unknown) => (v === "" ? Number.NaN : Number(v));

const chartDataSchema = z.object({
  date: z.iso.date(),
  priceUsd: z.preprocess(toNumber, z.number()),
  priceJpy: z.preprocess(toNumber, z.number()),
  jpyPerUsd: z.preprocess(toNumber, z.number()),
});
export const chartSchema = z.array(chartDataSchema);

export type ChartData = z.infer<typeof chartDataSchema>;
export type Chart = ChartData[];
