import { evaluateFinalReport } from "../utils/simulation.js";

function getRecordValue(record, keys, fallback = "") {
  const key = keys.find((candidate) => record?.[candidate] !== undefined && record?.[candidate] !== null);
  return key ? record[key] : fallback;
}

function formatMeasures(record) {
  const measures = getRecordValue(record, ["measures", "actions"], []);
  if (!Array.isArray(measures) || measures.length === 0) {
    return "未选择明显经营措施";
  }
  return measures.join("、");
}

const measureExplanations = {
  建设高标准农田: "改善田块条件，提高耕作效率和抗灾能力",
  保护性耕作: "减少土壤扰动，有助于保持土壤肥力",
  秸秆还田: "增加土壤有机质，改善土壤肥力",
  种植防护林: "减弱风沙影响，保护耕地生态",
  节水灌溉: "提高水资源利用效率，缓解干旱影响",
  修筑梯田: "减轻坡地水土流失，改善坡耕地利用条件",
  合理灌溉: "改善作物水分条件，减轻水分不足带来的减产风险",
  合理施肥: "补充作物生长所需养分，维持土壤肥力",
  建设排水渠: "提升排水能力，降低洪涝和渍害风险",
  轮作休耕: "缓解连续种植压力，帮助地力恢复",
  退耕还林还草: "降低坡地开发强度，促进生态恢复",
  覆盖种植: "减少地表裸露，减轻水土流失和蒸发",
  绿色农业: "减少农业污染压力，提升耕地生态质量",
  耐旱作物: "提高作物对水分不足环境的适应能力",
  正常耕作: "维持基本农业生产，但对耕地质量改善作用有限",
  过量灌溉: "短期改善水分，但可能增加盐渍化或水资源压力",
  过量施肥: "短期可能刺激产量，但容易造成肥力失衡和生态压力"
};

const eventExplanations = {
  正常年份: "自然条件相对平稳，经营措施的作用更容易体现",
  干旱: "水分不足会限制作物生长，灌溉效率和耐旱能力变得更重要",
  洪涝: "过多水分会影响根系呼吸，排水和田块整理尤为关键",
  暴雨冲刷: "强降水容易带走表层土壤，坡地地区尤其需要加强水土保持",
  风沙: "风力侵蚀会损伤作物并带走表土，防护林和覆盖措施有保护作用",
  低温冻害: "热量条件不足会影响作物生长周期，使产量出现波动",
  土壤盐渍化风险上升: "盐分累积会抑制作物吸水，合理灌排和节水管理十分重要",
  黑土退化风险上升: "黑土肥力下降会削弱长期生产能力，需要补充有机质并减少过度扰动",
  城市建设占用耕地: "建设占地会压缩耕地空间，提醒我们保护优质耕地资源"
};

function describeCropPattern(records) {
  const crops = records.map((record) => getRecordValue(record, ["crop", "cropName"], "未记录作物")).filter(Boolean);
  const uniqueCrops = Array.from(new Set(crops));

  if (uniqueCrops.length === 0) {
    return "五年内作物选择记录较少";
  }

  if (uniqueCrops.length === 1) {
    return `五年中你持续种植${uniqueCrops[0]}，经营重点更集中在稳定该作物产量和维护耕地质量上`;
  }

  const segments = crops.reduce((result, crop, index) => {
    const last = result[result.length - 1];
    if (last && last.crop === crop) {
      last.end = index + 1;
    } else {
      result.push({ crop, start: index + 1, end: index + 1 });
    }
    return result;
  }, []);
  const cropPath = segments
    .map((segment) => (segment.start === segment.end ? `第${segment.start}年种植${segment.crop}` : `第${segment.start}至${segment.end}年种植${segment.crop}`))
    .join("，");

  return `五年中你根据经营需要调整过作物结构，${cropPath}`;
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

function explainMeasures(measures) {
  if (!Array.isArray(measures) || measures.length === 0) {
    return "由于没有明显经营措施，耕地变化更多受自然事件和原有地力条件影响";
  }

  const explanations = measures
    .map((measure) => {
      const explanation = measureExplanations[measure];
      return explanation ? `${measure}可以${explanation}` : "";
    })
    .filter(Boolean)
    .slice(0, 3);

  return explanations.length ? explanations.join("；") : `${measures.join("、")}共同影响了当年的耕地质量和作物生长`;
}

function describeYieldChange(record, previousRecord, event, measures) {
  const yieldValue = Number(getRecordValue(record, ["yield", "production"], 0));
  if (!previousRecord) {
    return `产量达到${yieldValue}，为后续观察经营成效提供了起点`;
  }

  const previousYield = Number(getRecordValue(previousRecord, ["yield", "production"], yieldValue));
  const delta = yieldValue - previousYield;
  const eventReason = eventExplanations[event] ?? "该年度事件改变了作物生长条件";
  const hasProtectiveMeasure = measures.some((measure) =>
    ["建设高标准农田", "保护性耕作", "秸秆还田", "种植防护林", "节水灌溉", "修筑梯田", "建设排水渠", "合理灌溉", "合理施肥", "轮作休耕"].includes(measure)
  );

  if (delta > 5) {
    return `产量由${previousYield}提高到${yieldValue}，说明在${event}背景下，${hasProtectiveMeasure ? "经营措施对改善作物生长条件发挥了积极作用" : "自然条件或作物适应性对产量恢复起到一定作用"}`;
  }

  if (delta < -5) {
    return `产量由${previousYield}下降到${yieldValue}，主要与${event}带来的压力有关，${eventReason}，也提示后续需要更有针对性地保护耕地`;
  }

  return `产量维持在${yieldValue}左右，说明${event}影响下耕地生产状态总体较稳定，但仍需要继续关注肥力、水分和生态健康`;
}

function describeQualityChange(record, previousRecord) {
  if (!previousRecord) {
    return "";
  }

  const fertilityDelta = Number(getRecordValue(record, ["fertility"], 0)) - Number(getRecordValue(previousRecord, ["fertility"], 0));
  const ecologyDelta = Number(getRecordValue(record, ["ecology"], 0)) - Number(getRecordValue(previousRecord, ["ecology"], 0));
  const quality = [];

  if (fertilityDelta > 2) quality.push("土壤肥力有所恢复");
  if (fertilityDelta < -2) quality.push("土壤肥力被进一步消耗");
  if (ecologyDelta > 2) quality.push("生态健康得到改善");
  if (ecologyDelta < -2) quality.push("生态健康承受压力");

  return quality.length ? `同时，${quality.join("，")}。` : "";
}

function buildOperationReview(region, records) {
  if (!records.length) {
    return "本次经营还没有形成完整年度记录，暂时无法生成经营过程回顾。";
  }

  const cropIntro = describeCropPattern(records);
  const usedMeasures = Array.from(new Set(records.flatMap((record) => getRecordValue(record, ["measures", "actions"], []))));
  const strategyFocus = usedMeasures.length
    ? `主要围绕${usedMeasures.slice(0, 5).join("、")}等措施展开，体现了通过人类经营改善耕地条件的思路`
    : "经营措施相对较少，耕地变化更多依赖自然条件和原有地力";
  const annualReview = records.map((record, index) => {
    const year = getRecordValue(record, ["year"], index + 1);
    const event = getRecordValue(record, ["event", "eventName"], "正常年份") || "正常年份";
    const measures = getRecordValue(record, ["measures", "actions"], []);
    const measureText = formatMeasures(record);
    const eventLead = event === "正常年份" ? `第${year}年为正常年份` : `第${year}年遇到${event}`;
    const actionPhrase = measures.length ? `你采取${measureText}` : "该年未选择明显经营措施";
    const eventText = eventExplanations[event] ?? "该事件改变了作物生长和耕地质量条件";
    const measureExplanation = explainMeasures(measures);
    const yieldChange = describeYieldChange(record, records[index - 1], event, measures);
    const qualityChange = describeQualityChange(record, records[index - 1]);

    return `${eventLead}，${eventText}。${actionPhrase}，${measureExplanation}，因此${yieldChange}。${qualityChange}`;
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

  return `在${region.name}五年的耕地经营过程中，${cropIntro}，并且${strategyFocus}。${annualReview}综合五年记录来看，${yieldTrend}，${fertilityTrend}，${ecologyTrend}，${securityText}说明粮食安全不是单纯由作物产量决定，而是受到自然条件、耕地质量和人类经营措施共同影响。${positiveEnding}`;
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
