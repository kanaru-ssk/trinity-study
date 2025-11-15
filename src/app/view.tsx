"use client";

import { SimulationTable } from "@/components/simulation-talbe";
import { formatDate } from "@/lib/date";
import type { SimulationMeta } from "@/types/simulation";

type ViewProps = {
  withdrawalRates: number[];
  simulationMeta: SimulationMeta[];
  simulationResults: number[][];
  firstDataDate: string;
  lastDataDate: string;
};

export function View({
  withdrawalRates,
  simulationMeta,
  simulationResults,
  firstDataDate,
  lastDataDate,
}: ViewProps) {
  return (
    <main className="prose prose-neutral mx-auto max-w-4xl px-5 py-20">
      <h1>
        <span className="text-2xl">
          {formatDate(new Date(), "YYYY年M月")}最新
        </span>
        <br />
        <span className="text-3xl">日本版トリニティスタディ</span>
      </h1>
      <SimulationSection
        withdrawalRates={withdrawalRates}
        simulationMeta={simulationMeta}
        simulationResults={simulationResults}
        firstDataDate={firstDataDate}
        lastDataDate={lastDataDate}
      />
      <AboutSection />
      <TrinityStudySection />
      <AlgorithmSection />
      <DataSourceSection />
    </main>
  );
}

type SimulationSectionProps = {
  withdrawalRates: number[];
  simulationMeta: SimulationMeta[];
  simulationResults: number[][];
  firstDataDate: string;
  lastDataDate: string;
};

function SimulationSection({
  withdrawalRates,
  simulationMeta,
  simulationResults,
  firstDataDate,
  lastDataDate,
}: SimulationSectionProps) {
  return (
    <section>
      <h2>シミュレーション結果</h2>
      <SimulationTable
        withdrawalRates={withdrawalRates}
        simulationMeta={simulationMeta}
        simulationResults={simulationResults}
      />
      <p className="text-sm">
        ※ 縦軸: 取り崩し期間(n=試行回数)、横軸: 初年度の資産額に対する取り崩し率
        <br />※ {firstDataDate} ~ {lastDataDate}
        のデータを使用してシミュレーションしています。
      </p>
    </section>
  );
}

function AboutSection() {
  return (
    <section>
      <h2>当サイトについて</h2>
      <p>
        MSCI
        ACWIを日本円建てで取崩しシミュレーションした日本版トリニティスタディです。
      </p>
      <p>
        毎月最新データを自動的に取得し、シミュレーション結果を更新しています。
      </p>
    </section>
  );
}

function TrinityStudySection() {
  return (
    <section>
      <h2>トリニティスタディとは？</h2>
      <p>
        1998年、
        <a href="https://www.aaii.com/journal" target="_blank" rel="noreferrer">
          THE AAII JOURNAL
        </a>
        に掲載された以下の論文の通称。
      </p>
      <p>
        <a
          href="https://www.aaii.com/files/pdf/6794_retirement-savings-choosing-a-withdrawal-rate-that-is-sustainable.pdf"
          target="_blank"
          rel="noreferrer"
        >
          Retirement Savings: Choosing a Withdrawal Rate That Is Sustainable
        </a>
      </p>
      <p>
        現役時に貯めた資産を取り崩して生活する退職者を想定し、株式および債権で運用された資産の安全な取崩し率を調べた論文です。
      </p>
      <p>
        この論文では株式にS&P500(アメリカの株式インデックス)、債権にアメリカの長期高格付け社債を使用してシミュレーションしています。
      </p>
      <p>
        本サイトでは、日本人向けとしてACWI(全世界株式インデックス)を日本円建てで取崩すシミュレーションをしました。
      </p>
    </section>
  );
}

function AlgorithmSection() {
  return (
    <section>
      <h2>シミュレーションアルゴリズム</h2>
      <p>
        このサイトで使用したプログラムは
        <a
          href="https://github.com/kanaru-ssk/trinity-study"
          target="_blank"
          rel="noreferrer"
        >
          GitHub
        </a>
        で公開しています。ソースコード内のmakeSimulationData.tsで実際に動いているシミュレーションアルゴリズムをご確認頂けます。
      </p>
      <p>上記ファイルの関数で以下の手順でシミュレーションしています。</p>
      <ol>
        <li>
          初年度の資産額を100に設定。毎年の取り崩し額は取り崩し率の数値（5%取り崩しの場合5）となる。
        </li>
        <li>初年度はそのまま取り崩し(100 – 5で資産残高95)</li>
        <li>
          2年目以降は資産残高に騰落率をかけて時価を計算し、そこから取り崩す。（10%値上がりした場合、95*1.1–5=99.5）
        </li>
        <li>
          3を取り崩し年数分繰り返し、資産残高が0にならなければ成功とする。
        </li>
      </ol>
      <h3>試行回数について</h3>
      <p>上の操作をデータ数が許す限り繰り返す。</p>
      <p>
        例えば、1987年12月から2023年11月のデータを取得出来ている場合、15年の取り崩し年数でシミュレーションする回数は以下のようになる。
      </p>
      <ul>
        <li>1回目、1987年12月から2001年12月。</li>
        <li>2回目、1988年1月から2002年1月。</li>
        <li>3回目、1988年2月から2002年2月。</li>
        <li>...</li>
        <li>263回目、2009年10月から2023年10月。</li>
        <li>264回目、2009年11月から2023年11月。</li>
      </ul>
      <p>
        計算式にすると、<code>(データ月数) - 12 * (取り崩し年数 - 1) </code>
        となる。
      </p>
    </section>
  );
}

function DataSourceSection() {
  return (
    <section>
      <h2>データ入手元</h2>
      <dl>
        <dt>ACWI のチャートデータ</dt>
        <dd>
          <a
            href="https://www.msci.com/end-of-day-data-search"
            target="_blank"
            rel="noreferrer"
          >
            End of day index data search
          </a>
        </dd>
        <dt>ドル円為替データ</dt>
        <dd>
          <a
            href="https://exchangeratesapi.io/"
            target="_blank"
            rel="noreferrer"
          >
            exchangerates API
          </a>
        </dd>
      </dl>
    </section>
  );
}
