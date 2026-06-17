import { evaluateFinalReport } from "../utils/simulation.js";

function getRecordValue(record, keys, fallback = "") {
  const key = keys.find((candidate) => record?.[candidate] !== undefined && record?.[candidate] !== null);
  return key ? record[key] : fallback;
}

function formatMeasures(record) {
  const measures = getRecordValue(record, ["measures", "actions"], []);
  if (!Array.isArray(measures) || measures.length === 0) {
    return "该年未选择明显经营措施";
  }
  return measures.join("、");
}

function describeCropPattern(records) {
  const crops = records.map((record) => getRecordValue(record, ["crop", "cropName"], "未记录作物")).filter(Boolean);
  const uniqueCrops = Array.from(new Set(crops));

  if (uniqueCrops.length === 0) {
    return "五年内作物选择记录较少";
  }

  if (uniqueCrops.length === 1) {
    return `五年中你主要选择种植${uniqueCrops[0]}`;
  }

  return `五年中你的作物选择经历了${crops.map((crop, index) => `第${index + 1}年${crop}`).join("、")}的变化`;
}

function describeTrend(records, field, label) {
  const values = records.map((record) => Number(getRecordValue(record, [field], 0)));
  if (values.length < 2) return `${label}记录较少，暂时难以判断趋势`;

  const first = values[0];
  const last = values[values.length - 1];
  const directionChanges = values.slice(1).filter((value, index) => value < values[index]).length;

  if (last - first >= 8 && directionChanges <= 1) {
    return `${label}整体呈上升趋势`;
  }

  if (first - last >= 8 && directionChanges >= 2) {
    return `${label}整体有所下降，说明经营或灾害压力仍需关注`;
  }

  return `${label}受年度事件和措施组合影响出现一定波动`;
}

function describeAnnualImpact(record, previousRecord) {
  const yieldValue = Number(getRecordValue(record, ["yield", "production"], 0));
  const fertility = Number(getRecordValue(record, ["fertility"], 0));
  const ecology = Number(getRecordValue(record, ["ecology"], 0));

  if (!previousRecord) {
    return `当年产量为${yieldValue}，土壤肥力为${fertility}，生态健康为${ecology}，形成了后续经营比较的基础`;
  }

  const yieldDelta = yieldValue - Number(getRecordValue(previousRecord, ["yield", "production"], yieldValue));
  const fertilityDelta = fertility - Number(getRecordValue(previousRecord, ["fertility"], fertility));
  const ecologyDelta = ecology - Number(getRecordValue(previousRecord, ["ecology"], ecology));
  const changes = [];

  if (yieldDelta > 3) changes.push("产量有所提高");
  if (yieldDelta < -3) changes.push("产量受到影响并下降");
  if (Math.abs(yieldDelta) <= 3) changes.push("产量基本保持稳定");
  if (fertilityDelta > 2) changes.push("土壤肥力有所改善");
  if (fertilityDelta < -2) changes.push("土壤肥力出现消耗");
  if (ecologyDelta > 2) changes.push("生态健康得到提升");
  if (ecologyDelta < -2) changes.push("生态健康承受压力");

  return `${changes.join("，")}，当年产量为${yieldValue}`;
}

function buildOperationReview(region, records) {
  if (!records.length) {
    return "本次经营还没有形成完整年度记录，暂时无法生成经营过程回顾。";
  }

  const cropIntro = describeCropPattern(records);
  const annualReview = records.map((record, index) => {
    const year = getRecordValue(record, ["year"], index + 1);
    const crop = getRecordValue(record, ["crop", "cropName"], "未记录作物");
    const event = getRecordValue(record, ["event", "eventName"], "正常年份") || "正常年份";
    const measures = formatMeasures(record);
    const impact = describeAnnualImpact(record, records[index - 1]);

    return `第${year}年，你选择种植${crop}，年度事件为${event}，采取的经营措施是${measures}，${impact}。`;
  }).join("");

  const yieldTrend = describeTrend(records, "yield", "产量");
  const fertilityTrend = describeTrend(records, "fertility", "土壤肥力");
  const ecologyTrend = describeTrend(records, "ecology", "生态健康");
  const finalRecord = records[records.length - 1];
  const finalSecurity = getRecordValue(finalRecord, ["foodSecurity"], null);
  const securityText = finalSecurity === null ? "" : `最终粮食安全贡献达到${finalSecurity}，`;
  const positiveEnding =
    Number(getRecordValue(finalRecord, ["fertility"], 0)) >= 60 && Number(getRecordValue(finalRecord, ["ecology"], 0)) >= 60
      ? "总体来看，你的经营策略能够兼顾粮食产出和耕地质量，体现了一定的因地制宜意识和耕地保护意识。"
      : "总体来看，你的经营策略已经开始关注区域差异，但仍需要进一步加强耕地保护和长期地力恢复。";

  return `在${region.name}五年的耕地经营过程中，${cropIntro}。${annualReview}综合五年记录来看，${yieldTrend}，${fertilityTrend}，${ecologyTrend}，${securityText}说明耕地质量、自然事件和经营措施共同影响粮食安全。${positiveEnding}`;
}

function MiniChart({ label, records, field }) {
  const values = records.map((record) => record[field]);
  return (
    <div className="mini-chart">
      <h3>{label}</h3>
      <div className="chart-bars">
        {values.map((value, index) => (
          <div className="chart-bar" key={`${field}-${index}`}>
            <span className="chart-fill" style={{ height: `${value}%` }}>
              <b className="chart-value">{value}</b>
            </span>
            <small>{index + 1}</small>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function FinalReport({ region, farmState, onRestart, onChooseRegion }) {
  const report = evaluateFinalReport(region, farmState);
  const records = farmState.history;
  const operationReview = buildOperationReview(region, records);

  return (
    <section className="content-page report-page">
      <header className="page-header">
        <div>
          <p className="eyebrow">第四步：生成经营报告</p>
          <h1>耕地经营报告</h1>
          <p>{report.narrative}</p>
        </div>
        <div className="header-actions">
          <button className="ghost-button" onClick={onChooseRegion}>选择新区域</button>
          <button className="primary-button" onClick={onRestart}>重新开始</button>
        </div>
      </header>

      <div className="report-grid">
        <article className="report-summary">
          <h2>{region.name}</h2>
          <div className="grade-badge">{report.grade}</div>
          <p>{region.teachingTip}</p>
          <dl className="info-list">
            <div><dt>平均粮食产量</dt><dd>{report.averageYield}</dd></div>
            <div><dt>最终土壤肥力</dt><dd>{farmState.fertility}</dd></div>
            <div><dt>最终生态健康</dt><dd>{farmState.ecology}</dd></div>
            <div><dt>最终粮食安全贡献</dt><dd>{farmState.foodSecurity}</dd></div>
          </dl>
        </article>

        <article className="report-charts">
          <MiniChart label="5年粮食产量变化" records={records} field="yield" />
          <MiniChart label="5年土壤肥力变化" records={records} field="fertility" />
          <MiniChart label="5年生态健康变化" records={records} field="ecology" />
        </article>

        <article className="report-table">
          <h2>年度记录</h2>
          <table>
            <thead>
              <tr>
                <th>年份</th>
                <th>作物</th>
                <th>作物适宜性</th>
                <th>事件</th>
                <th>措施</th>
                <th>产量</th>
              </tr>
            </thead>
            <tbody>
              {records.map((record) => (
                <tr key={record.year}>
                  <td>第{record.year}年</td>
                  <td>{record.crop}</td>
                  <td>{record.cropSuitabilityLabel ?? "可选"}</td>
                  <td>{record.event}</td>
                  <td>{record.measures.join("、")}</td>
                  <td>{record.yield}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </article>

        <article className="report-summary">
          <h2>主要问题与治理措施</h2>
          <h3>出现过的主要问题</h3>
          <div className="tag-row large">
            {(report.majorRisks.length ? report.majorRisks : ["风险较低"]).map((risk) => (
              <span className="tag danger" key={risk}>{risk}</span>
            ))}
          </div>
          <h3>采取过的治理措施</h3>
          <div className="tag-row large">
            {(report.usedMeasures.length ? report.usedMeasures : ["正常耕作"]).map((measure) => (
              <span className="tag good" key={measure}>{measure}</span>
            ))}
          </div>
        </article>

        <article className="report-summary">
          <h2>经营过程回顾</h2>
          <p className="operation-review">{operationReview}</p>
        </article>

        <article className="report-summary">
          <h2>措施选择适配性评价</h2>
          <dl className="info-list">
            <div><dt>适宜措施次数</dt><dd>{report.adaptation.suitableCount}</dd></div>
            <div><dt>不适宜措施次数</dt><dd>{report.adaptation.unsuitableCount}</dd></div>
          </dl>
          <h3>最匹配的措施</h3>
          <div className="tag-row large">
            {(report.adaptation.matchedMeasures.length ? report.adaptation.matchedMeasures : ["暂无"]).map((measure) => (
              <span className="tag good" key={measure}>{measure}</span>
            ))}
          </div>
          <h3>造成扣分的措施</h3>
          <div className="tag-row large">
            {(report.adaptation.penaltyMeasures.length ? report.adaptation.penaltyMeasures : ["暂无"]).map((measure) => (
              <span className="tag danger" key={measure}>{measure}</span>
            ))}
          </div>
          <p className="compare-summary">{report.adaptation.summary}</p>
        </article>

      </div>
    </section>
  );
}
