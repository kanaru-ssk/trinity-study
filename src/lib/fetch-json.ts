import type { Result } from "../types/result.ts";

type Options = {
	/** 1 リクエストあたりのタイムアウト（ミリ秒） */
	timeoutMs?: number;
	/** ネットワークエラー・429・5xx のときに再試行する回数 */
	retries?: number;
	/** 再試行までの待ち時間（ミリ秒）。試行ごとに倍になる */
	retryDelayMs?: number;
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const isRetryable = (status: number) => status === 429 || status >= 500;

// JSON を取得する。失敗は例外ではなく Result で返す
export async function fetchJson(
	url: string,
	{ timeoutMs = 10_000, retries = 2, retryDelayMs = 1_000 }: Options = {},
): Promise<Result<unknown, string>> {
	let error = "";
	for (let attempt = 0; attempt <= retries; attempt++) {
		if (attempt > 0) await sleep(retryDelayMs * 2 ** (attempt - 1));
		try {
			const res = await fetch(url, { signal: AbortSignal.timeout(timeoutMs) });
			if (res.ok) return { ok: true, data: await res.json() };
			error = `${res.status}: ${res.statusText}`;
			if (!isRetryable(res.status)) break;
		} catch (e) {
			error = e instanceof Error ? e.message : String(e);
		}
	}
	return { ok: false, error };
}
