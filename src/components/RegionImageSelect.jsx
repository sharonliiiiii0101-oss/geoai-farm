import { useMemo, useState } from "react";
import { featureFilters } from "../data/regions.js";

function SlopeText({ region }) {
  return (
    <span className="slope-text">
      <strong>{region.slopeRange ?? region.slope}</strong>
      {region.slopeImpact && <small>{region.slopeImpact}</small>}
    </span>
  );
}

function RegionCard({ region, selectedForCompare, compareDisabled, onCompareToggle, onSelect }) {
  return (
    <article
      className={`region-image-card ${region.featureClass}`}
      style={{
        "--theme-color": region.themeColor,
        "--feature-color": region.featureColor
      }}
    >
      <label className="compare-check" onClick={(event) => event.stopPropagation()}>
        <input
          type="checkbox"
          checked={selectedForCompare}
          disabled={!selectedForCompare && compareDisabled}
          onChange={() => onCompareToggle(region.id)}
        />
        加入对比
      </label>

      <div className="region-image-wrap">
        <img src={region.image} alt={`${region.name}实景`} />
        <div className="region-image-overlay" />
        <div className="region-image-title">
          <h2>{region.name}</h2>
          <p>{region.subtitle}</p>
        </div>
      </div>

      <div className="region-card-body">
        <div className="feature-pill">{region.landFeature}</div>
        <dl className="region-facts">
          <div><dt>主要土壤</dt><dd>{region.soil}</dd></div>
          <div><dt>坡度</dt><dd><SlopeText region={region} /></dd></div>
          <div><dt>适宜作物</dt><dd>{region.crops.join("、")}</dd></div>
        </dl>

        <div className="tag-row compact-tags">
          {region.risks.map((risk) => (
            <span className="tag danger" key={risk}>{risk}</span>
          ))}
        </div>

        <p className="teaching-question">{region.question}</p>
        <button className="select-region-button" onClick={() => onSelect(region.id)}>
          选择这块耕地
        </button>
      </div>
    </article>
  );
}

function ComparePanel({ regions, onClose }) {
  return (
    <div className="compare-backdrop" role="dialog" aria-modal="true" aria-label="区域对比">
      <section className="compare-panel">
        <header className="compare-header">
          <div>
            <p className="eyebrow">区域对比</p>
            <h2>两类耕地景观的差异</h2>
          </div>
          <button className="ghost-button" onClick={onClose}>关闭</button>
        </header>

        <div className="compare-grid">
          {regions.map((region) => (
            <article className="compare-column" key={region.id}>
              <img src={region.image} alt={`${region.name}实景`} />
              <h3>{region.name}</h3>
              <dl className="compare-list">
                <div><dt>地形类型</dt><dd>{region.terrainType}</dd></div>
                <div><dt>土地特征</dt><dd>{region.landFeature}</dd></div>
                <div><dt>土壤</dt><dd>{region.soil}</dd></div>
                <div><dt>坡度</dt><dd><SlopeText region={region} /></dd></div>
                <div><dt>气候条件</dt><dd>{region.climate}</dd></div>
                <div><dt>适宜作物</dt><dd>{region.crops.join("、")}</dd></div>
                <div><dt>主要风险</dt><dd>{region.risks.join("、")}</dd></div>
                <div><dt>推荐治理措施</dt><dd>{region.recommendedMeasures.join("、")}</dd></div>
              </dl>
            </article>
          ))}
        </div>

        <p className="compare-summary">
          不同地区的耕地利用方式受地形、土壤、水分和气候条件共同影响，农业生产需要因地制宜。保障粮食安全不仅要扩大产量，还要保护耕地质量。
        </p>
      </section>
    </div>
  );
}

export default function RegionImageSelect({ regions, onSelect, onBack }) {
  const [activeFilter, setActiveFilter] = useState("全部");
  const [compareIds, setCompareIds] = useState([]);
  const [showCompare, setShowCompare] = useState(false);

  const filteredRegions = useMemo(() => {
    if (activeFilter === "全部") return regions;
    return regions.filter((region) => region.landFeature === activeFilter);
  }, [activeFilter, regions]);

  const compareRegions = compareIds
    .map((id) => regions.find((region) => region.id === id))
    .filter(Boolean);

  function toggleCompare(regionId) {
    setCompareIds((current) => {
      if (current.includes(regionId)) return current.filter((id) => id !== regionId);
      if (current.length >= 2) return current;
      return [...current, regionId];
    });
  }

  return (
    <section className="content-page image-select-page">
      <header className="page-header">
        <div>
          <p className="eyebrow">第一步：选择一块典型耕地</p>
          <h1>选择你的耕地经营区域</h1>
          <p>观察不同地区的真实耕地景观，选择一块土地开始你的粮食安全经营挑战。</p>
        </div>
        <button className="ghost-button" onClick={onBack}>返回首页</button>
      </header>

      <section className="image-select-intro">
        <p>
          不同地区的地形、土壤、水分条件和耕地类型不同，会影响作物选择、耕地质量和粮食安全。请根据实景图片和区域信息，选择一块耕地进行经营。
        </p>
      </section>

      <section className="feature-filter-panel">
        <p>按土地特征筛选，观察不同耕地类型与地形、水源、气候之间的关系。</p>
        <div className="feature-filter-row">
          {featureFilters.map((filter) => (
            <button
              key={filter}
              className={activeFilter === filter ? "feature-filter active" : "feature-filter"}
              onClick={() => setActiveFilter(filter)}
            >
              {filter}
            </button>
          ))}
        </div>
      </section>

      <div className="region-image-grid">
        {filteredRegions.map((region) => (
          <RegionCard
            key={region.id}
            region={region}
            selectedForCompare={compareIds.includes(region.id)}
            compareDisabled={compareIds.length >= 2}
            onCompareToggle={toggleCompare}
            onSelect={onSelect}
          />
        ))}
      </div>

      {compareIds.length > 0 && (
        <div className="compare-dock">
          <span>已加入对比：{compareRegions.map((region) => region.name).join("、")}</span>
          <button
            className="primary-button"
            disabled={compareIds.length !== 2}
            onClick={() => setShowCompare(true)}
          >
            对比这两个区域
          </button>
        </div>
      )}

      {showCompare && <ComparePanel regions={compareRegions} onClose={() => setShowCompare(false)} />}
    </section>
  );
}
