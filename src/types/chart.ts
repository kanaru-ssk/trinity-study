import { z } from "zod";

// "" (欠損セル) を Number() に通すと 0 になってしまうため NaN にして弾く
const toNumber = (v: unknown) => (v === "" ? Number.NaN : Number(v));
const positiveNumber = z.preprocess(toNumber, z.number().positive());

const chartDataSchema = z.object({
	date: z.iso.date(),
	priceUsd: positiveNumber,
	priceJpy: positiveNumber,
	jpyPerUsd: positiveNumber,
});

// "2023-11-30" -> 2023 * 12 + 10
const toMonthIndex = (date: string) =>
	Number(date.slice(0, 4)) * 12 + Number(date.slice(5, 7)) - 1;

// シミュレーションは「12 行 = 1 年」を前提にしているため、月が欠けたり重複したりしていないことを保証する
export const chartSchema = z
	.array(chartDataSchema)
	.superRefine((chart, ctx) => {
		for (let i = 1; i < chart.length; i++) {
			const prev = chart[i - 1].date;
			const current = chart[i].date;
			if (toMonthIndex(current) - toMonthIndex(prev) !== 1) {
				ctx.addIssue({
					code: "custom",
					path: [i, "date"],
					message: `月が連続していません: ${prev} の次が ${current}`,
				});
			}
		}
	});

export type ChartData = z.infer<typeof chartDataSchema>;
export type Chart = ChartData[];
