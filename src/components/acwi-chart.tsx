"use client";

import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  XAxis,
  YAxis,
} from "recharts";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import type { Chart } from "@/types/chart";

const chartConfig = {
  priceUsd: {
    label: "ドル建て",
    color: "var(--chart-1)",
  },
  priceJpy: {
    label: "円建て",
    color: "var(--chart-2)",
  },
  jpyPerUsd: {
    label: "JPY/USD",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig;

type ChartAreaLinearProps = {
  chart: Chart;
};

export function ChartAreaLinear({ chart }: ChartAreaLinearProps) {
  // priceJpyの初年度評価額をpriceUsdと揃える
  chart = chart.map((data) => ({
    ...data,
    priceJpy: (data.priceJpy * chart[0].priceUsd) / chart[0].priceJpy,
  }));

  return (
    <ChartContainer config={chartConfig}>
      <ComposedChart
        accessibilityLayer
        data={chart}
        margin={{ left: -24, right: -24 }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="date"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value) => value.slice(0, 4)}
        />
        <YAxis yAxisId="left" name="name" />
        <YAxis yAxisId="right" orientation="right" />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="dot" hideLabel />}
        />

        <Area
          dataKey="priceUsd"
          yAxisId="left"
          type="linear"
          fill="var(--color-priceUsd)"
          fillOpacity={0.2}
          stroke="var(--color-priceUsd)"
        />
        <Area
          dataKey="priceJpy"
          yAxisId="left"
          type="linear"
          fill="var(--color-priceJpy)"
          fillOpacity={0.6}
          stroke="var(--color-priceJpy)"
        />
        <Line
          dataKey="jpyPerUsd"
          yAxisId="right"
          type="linear"
          stroke="var(--color-jpyPerUsd)"
          strokeWidth={2}
          dot={false}
        />
      </ComposedChart>
    </ChartContainer>
  );
}
