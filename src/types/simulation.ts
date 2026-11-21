/** 取り崩し期間ごとのシミュレーション結果 */
export type SimulationRow = {
	/** 取り崩し期間（年） */
	payoutPeriod: number;
	/** 試行回数 */
	numOfSimulation: number;
	/** 取り崩し率ごとの成功率（0〜1）。withdrawalRates と同じ順番 */
	successRates: number[];
};
