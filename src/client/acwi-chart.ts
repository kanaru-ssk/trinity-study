/// <reference lib="dom" />
/// <reference lib="dom.iterable" />
// src/components/acwi-chart.tsx のホバー時にツールチップを表示する
import type { AcwiChartData } from "../components/acwi-chart.tsx";

const formatNumber = (value: number) =>
	value.toLocaleString("ja-JP", { maximumFractionDigits: 2 });

for (const root of document.querySelectorAll<HTMLElement>(
	"[data-acwi-chart]",
)) {
	const { maxLeft, maxRight, points } = JSON.parse(
		root.dataset.acwiChart ?? "",
	) as AcwiChartData;

	const plot = root.querySelector<HTMLElement>("[data-plot]");
	const cursor = root.querySelector<HTMLElement>("[data-cursor]");
	const tooltip = root.querySelector<HTMLElement>("[data-tooltip]");
	const date = root.querySelector<HTMLElement>("[data-tooltip-date]");
	const dots = [...root.querySelectorAll<HTMLElement>("[data-dot]")];
	const values = [
		...root.querySelectorAll<HTMLElement>("[data-tooltip-value]"),
	];
	if (!plot || !cursor || !tooltip || !date) continue;

	const overlays = [cursor, tooltip, ...dots];

	const show = (event: PointerEvent) => {
		const rect = plot.getBoundingClientRect();
		const ratio = Math.min(
			Math.max((event.clientX - rect.left) / rect.width, 0),
			1,
		);
		const index = Math.round(ratio * (points.length - 1));
		const [day, usd, jpy, rate] = points[index];
		const left = (index / (points.length - 1)) * 100;
		const tops = [usd / maxLeft, jpy / maxLeft, rate / maxRight].map(
			(v) => (1 - v) * 100,
		);

		cursor.style.left = `${left}%`;
		dots.forEach((dot, i) => {
			dot.style.left = `${left}%`;
			dot.style.top = `${tops[i]}%`;
		});

		date.textContent = day;
		[usd, jpy, rate].forEach((value, i) => {
			if (values[i]) values[i].textContent = formatNumber(value);
		});
		// 右半分ではツールチップをカーソルの左に出す
		if (ratio > 0.5) {
			tooltip.style.left = "";
			tooltip.style.right = `calc(${100 - left}% + 12px)`;
		} else {
			tooltip.style.right = "";
			tooltip.style.left = `calc(${left}% + 12px)`;
		}

		for (const el of overlays) el.classList.remove("hidden");
	};

	const hide = () => {
		for (const el of overlays) el.classList.add("hidden");
	};

	plot.addEventListener("pointermove", show);
	plot.addEventListener("pointerdown", show);
	plot.addEventListener("pointerleave", hide);
}
