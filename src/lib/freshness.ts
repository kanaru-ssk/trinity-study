const DAY_MS = 24 * 60 * 60 * 1000;

/** データの最終日（YYYY-MM-DD）が now から何日前か */
export const daysSince = (date: string, now: Date): number =>
	Math.floor((now.getTime() - Date.parse(date)) / DAY_MS);

/**
 * 月末データが 2 か月連続で取れていない状態を「古い」とみなす。
 * 月初に前月分がまだ公開されていないことはあるため、1 か月分の遅れは許容する
 */
export const MAX_DATA_AGE_DAYS = 45;

export const isStale = (lastDataDate: string, now: Date): boolean =>
	daysSince(lastDataDate, now) > MAX_DATA_AGE_DAYS;
