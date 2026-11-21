import { z } from "zod";

/** MSCI の指数の種類 */
export const indexVariantLabels = {
	STRD: "配当なし（Price）",
	NETR: "配当込み（Net）",
	GRTR: "配当込み（Gross）",
} as const;

export type IndexVariant = keyof typeof indexVariantLabels;

/** src/data/index.json の形式。src/data/chart.csv の priceUsd がどの指数かを表す */
export const indexMetaSchema = z.object({
	indexVariant: z.enum(["STRD", "NETR", "GRTR"]),
});

export type IndexMeta = z.infer<typeof indexMetaSchema>;
