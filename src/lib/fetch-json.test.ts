import { afterEach, describe, expect, it, vi } from "vitest";
import { fetchJson } from "./fetch-json.ts";

const mockFetch = (...responses: (Response | Error)[]) => {
	const fn = vi.fn();
	for (const res of responses) {
		if (res instanceof Error) fn.mockRejectedValueOnce(res);
		else fn.mockResolvedValueOnce(res);
	}
	vi.stubGlobal("fetch", fn);
	return fn;
};

const json = (body: unknown, status = 200) =>
	new Response(JSON.stringify(body), { status });

afterEach(() => {
	vi.unstubAllGlobals();
});

describe("fetchJson", () => {
	it("JSON を返す", async () => {
		mockFetch(json({ a: 1 }));
		expect(await fetchJson("https://example.com")).toEqual({
			ok: true,
			data: { a: 1 },
		});
	});

	it("5xx とネットワークエラーは再試行する", async () => {
		const fetch = mockFetch(
			json({}, 503),
			new Error("network"),
			json({ a: 1 }),
		);
		const result = await fetchJson("https://example.com", { retryDelayMs: 0 });
		expect(result).toEqual({ ok: true, data: { a: 1 } });
		expect(fetch).toHaveBeenCalledTimes(3);
	});

	it("4xx は再試行せずにエラーを返す", async () => {
		const fetch = mockFetch(json({}, 401));
		const result = await fetchJson("https://example.com", { retryDelayMs: 0 });
		expect(result.ok).toBe(false);
		expect(fetch).toHaveBeenCalledTimes(1);
	});

	it("再試行しても失敗したら最後のエラーを返す", async () => {
		mockFetch(json({}, 500), json({}, 500), new Error("timeout"));
		const result = await fetchJson("https://example.com", { retryDelayMs: 0 });
		expect(result).toEqual({ ok: false, error: "timeout" });
	});
});
