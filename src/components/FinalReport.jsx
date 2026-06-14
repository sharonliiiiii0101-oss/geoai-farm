import { evaluateFinalReport } from "../utils/simulation.js";

function MiniChart({ label, records, field }) {
  const values = records.map((record) => record[field]);
  return (
    <div className="mini-chart">
      <h3>{label}</h3>
      <div className="chart-bars">
        {values.map((value, index) => (
          <div className="chart-bar" key={`${field}-${index}`}>
            <span style={{ height: `${value}%` }} />
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
          <h2>作物选择适宜性评价</h2>
          <dl className="info-list">
            <div><dt>推荐作物选择次数</dt><dd>{report.cropSuitability.recommendedCount}</dd></div>
            <div><dt>可选作物选择次数</dt><dd>{report.cropSuitability.optionalCount}</dd></div>
            <div><dt>不推荐作物选择次数</dt><dd>{report.cropSuitability.notRecommendedCount}</dd></div>
          </dl>
          <h3>使用过的推荐作物</h3>
          <div className="tag-row large">
            {(report.cropSuitability.recommendedCropsUsed.length ? report.cropSuitability.recommendedCropsUsed : ["暂无"]).map((crop) => (
              <span className="tag good" key={crop}>{crop}</span>
            ))}
          </div>
          <h3>慎选或扣分作物</h3>
          <div className="tag-row large">
            {(report.cropSuitability.notRecommendedCrops.length ? report.cropSuitability.notRecommendedCrops : ["暂无"]).map((crop) => (
              <span className="tag danger" key={crop}>{crop}</span>
            ))}
          </div>
          <p className="compare-summary">{report.cropSuitability.summary}</p>
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

        <article className="report-summary">
          <h2>措施组合合理性</h2>
          <dl className="info-list">
            <div><dt>冲突组合次数</dt><dd>{report.combination.conflictCount}</dd></div>
          </dl>
          <p className="compare-summary">{report.combination.summary}</p>
        </article>
      </div>
    </section>
  );
}
