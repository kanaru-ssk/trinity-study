import { error } from "@sveltejs/kit";
import { dev } from "$app/environment";
import {
  fetchAcwiChartFromMongo,
  insertChartToMongo,
  addJpyData,
  fetchAcwiChart,
  makeSimulation,
  withdrawalRates,
} from "$lib/server";

export const load = async () => {
  // MongoDBからチャートデータフェッチ
  const acwiData = await fetchAcwiChartFromMongo();
  if (!acwiData)
    throw error(404, {
      message: "Not found",
    });

  const firstDataDate = acwiData[0].date;
  let lastDataDate = acwiData[acwiData.length - 1].date;

  // MSCIから最新チャートデータフェッチ
  const latestData = !dev && (await fetchAcwiChart(lastDataDate));

  if (latestData) {
    // MSCIデータに日本円データ追加
    const newAcwiData = await addJpyData(latestData);

    // 最新チャートデータをMongoDBに追加
    // acwiDataに最新データ追加
    await Promise.all(
      newAcwiData.map(async (data) => {
        const insertedData = await insertChartToMongo(data);
        acwiData.push(insertedData);
      }),
    );

    lastDataDate = acwiData[acwiData.length - 1].date;
  }

  // 取崩しシミュレーション実行
  const { simulationMeta, simulationResults } = await makeSimulation(acwiData);

  const updateDate = new Date().toLocaleDateString("ja-JP", {
    timeZone: "UTC",
  });

  return {
    withdrawalRates,
    simulationMeta,
    simulationResults,
    firstDataDate,
    lastDataDate,
    updateDate,
  };
};

export const prerender = true;

export const config = {
  isr: {
    expiration: 60 * 60 * 24 * 30, // 30日毎にデータ更新
  },
};
