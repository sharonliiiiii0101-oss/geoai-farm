import MetricBar from "./MetricBar.jsx";

function SlopeText({ region }) {
  return (
    <span className="slope-text">
      <strong>{region.slopeRange ?? region.slope}</strong>
      {region.slopeImpact && <small>{region.slopeImpact}</small>}
    </span>
  );
}

export default function LandProfile({ region, farmState, onBack, onStart }) {
  return (
    <section className="content-page">
      <header className="profile-hero">
        <img src={region.image} alt={`${region.name}实景`} />
        <div className="profile-hero-overlay" />
        <div className="profile-hero-content">
          <p className="eyebrow">第二步：读取耕地档案</p>
          <h1>{region.name}</h1>
          <p>{region.landFeature}｜{region.terrainType}</p>
          <button className="ghost-button light" onClick={onBack}>重新选择</button>
        </div>
      </header>

      <div className="profile-grid">
        <article className="profile-main">
          <h2>自然与利用条件</h2>
          <dl className="info-list">
            <div><dt>土地特征</dt><dd>{region.landFeature}</dd></div>
            <div><dt>地形类型</dt><dd>{region.terrainType}</dd></div>
            <div><dt>地形坡度</dt><dd><SlopeText region={region} /></dd></div>
            <div><dt>主要土壤</dt><dd>{region.soil}</dd></div>
            <div><dt>耕地类型</dt><dd>{region.farmlandType ?? region.landType}</dd></div>
            <div><dt>气候条件</dt><dd>{region.climate}</dd></div>
            <div><dt>适宜作物</dt><dd>{region.crops.join("、")}</dd></div>
          </dl>
        </article>

        <article className="profile-main">
          <h2>初始指标</h2>
          <MetricBar label="初始肥力" value={farmState.fertility} />
          <MetricBar label="初始水分" value={farmState.water} />
          <MetricBar label="初始生态健康" value={farmState.ecology} />
          <MetricBar label="初始产量潜力" value={region.initial.yieldPotential} />
        </article>

        <article className="profile-main wide">
          <h2>风险、措施与教学提示</h2>
          <div className="two-columns">
            <div>
              <h3>主要风险</h3>
              <div className="tag-row large">
                {region.risks.map((risk) => <span className="tag danger" key={risk}>{risk}</span>)}
              </div>
            </div>
            <div>
              <h3>推荐治理措施</h3>
              <div className="tag-row large">
                {region.recommendedMeasures.map((measure) => <span className="tag good" key={measure}>{measure}</span>)}
              </div>
            </div>
          </div>
          <div className="profile-question">
            <strong>教学问题</strong>
            <p>{region.question}</p>
            <span>{region.description}</span>
          </div>
          <button className="primary-button align-right" onClick={onStart}>开始经营</button>
        </article>
      </div>
    </section>
  );
}
