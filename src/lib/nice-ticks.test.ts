import { describe, expect, it } from "vitest";
import { niceTicks } from "./nice-ticks.ts";

describe("niceTicks", () => {
	it.each([
		[870, [0, 200, 400, 600, 800, 1000]],
		[160, [0, 50, 100, 150, 200]],
		[100, [0, 20, 40, 60, 80, 100]],
		[0.9, [0, 0.2, 0.4, 0.6, 0.8, 1]],
	])("%d", (max, ticks) => {
		expect(niceTicks(max)).toEqual(ticks);
	});

	it("最大値は max 以上になる", () => {
		for (const max of [1, 7, 33, 121, 999, 12345]) {
			expect(niceTicks(max).at(-1)).toBeGreaterThanOrEqual(max);
		}
	});

	it("max が 0 以下なら [0] を返す", () => {
		expect(niceTicks(0)).toEqual([0]);
	});
});
