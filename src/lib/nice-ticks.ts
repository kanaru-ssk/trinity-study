/**
 * 0 から max までを count 個程度に区切る、きりの良い目盛りを返す。
 * 例: niceTicks(870, 5) → [0, 200, 400, 600, 800, 1000]
 */
export function niceTicks(max: number, count = 5): number[] {
	if (max <= 0) return [0];
	const rough = max / count;
	const magnitude = 10 ** Math.floor(Math.log10(rough));
	const step =
		[1, 2, 2.5, 5, 10].map((n) => n * magnitude).find((s) => s >= rough) ??
		10 * magnitude;
	const ticks: number[] = [];
	for (let v = 0; v < max + step; v += step) {
		ticks.push(Number(v.toPrecision(12)));
		if (v >= max) break;
	}
	return ticks;
}
