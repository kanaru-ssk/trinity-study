import { type Chart, chartSchema } from "@/types/chart";
import type { Result } from "@/types/result";

export function parseCsvToCart(csv: string): Result<Chart, string> {
  const [headerLine, ...lines] = csv.trim().split("\n");
  const headers = headerLine.split(",");

  const rows = lines
    .map((line) => line.split(","))
    .map((cols) => {
      const obj: Record<string, string> = {};
      headers.forEach((h, i) => {
        obj[h] = cols[i] ?? "";
      });
      return obj;
    });

  const parsed = chartSchema.safeParse(rows);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.message,
    };
  }

  return {
    ok: true,
    data: parsed.data,
  };
}
