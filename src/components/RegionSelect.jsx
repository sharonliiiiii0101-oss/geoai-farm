import { useMemo, useState } from "react";
import ChinaFarmlandMap from "./ChinaFarmlandMap.jsx";
import { landformRegions } from "../data/landformRegions.js";

export default function RegionSelect({ regions, onSelect, onBack }) {
  const [selectedRegionId, setSelectedRegionId] = useState(null);

  const selectedRegion = useMemo(
    () => regions.find((region) => region.id === selectedRegionId),
    [regions, selectedRegionId]
  );
  const selectedLandform = useMemo(
    () => landformRegions.find((region) => region.id === selectedRegionId),
    [selectedRegionId]
  );

  return (
    <section className="content-page">
      <header className="page-header">
        <div>
          <p className="eyebrow">第一步：选择一块典型耕地</p>
          <h1>中国耕地区域选择</h1>
          <p>
            以“中国主要地形区分布图”为底图，叠加按地形区边界手工描绘的 SVG 热区。
            直接点击地图上的不规则地形区范围，查看土地特征并进入经营模拟。
          </p>
        </div>
        <button className="ghost-button" onClick={onBack}>返回首页</button>
      </header>

      <div className="region-layout distribution-layout">
        <div className="farmland-map-card">
          <div className="map-title-strip">
            <div>
              <strong>中国耕地类型交互分布图</strong>
              <span>悬停查看地形区边界，点击具体范围选择耕地</span>
            </div>
          </div>

          <ChinaFarmlandMap
            selectedRegionId={selectedRegionId}
            onSelectRegion={setSelectedRegionId}
          />
        </div>

        <aside className="map-detail-panel">
          {selectedRegion && selectedLandform ? (
            <>
              <p className="eyebrow">已选择耕地</p>
              <h2>{selectedRegion.name}</h2>
              <p className="map-detail-summary">{selectedLandform.subtitle}｜{selectedLandform.landFeature}</p>

              <dl className="map-detail-list">
                <div>
                  <dt>地形类型</dt>
                  <dd>{selectedLandform.terrainType}</dd>
                </div>
                <div>
                  <dt>土地特征</dt>
                  <dd>
                    <span
                      className="land-feature-chip"
                      style={{ "--region-color": selectedLandform.color }}
                    >
                      {selectedLandform.landFeature}
                    </span>
                  </dd>
                </div>
                <div>
                  <dt>耕地类型</dt>
                  <dd>{selectedLandform.farmlandType}</dd>
                </div>
                <div>
                  <dt>主要土壤</dt>
                  <dd>{selectedLandform.soil}</dd>
                </div>
                <div>
                  <dt>地形坡度</dt>
                  <dd>{selectedLandform.slope}</dd>
                </div>
                <div>
                  <dt>适宜作物</dt>
                  <dd>{selectedLandform.crops.join("、")}</dd>
                </div>
              </dl>

              <h3>主要风险</h3>
              <div className="tag-row large">
                {selectedLandform.risks.map((risk) => (
                  <span className="tag danger" key={risk}>{risk}</span>
                ))}
              </div>

              <button className="primary-button full-width" onClick={() => onSelect(selectedRegion.id)}>
                开始经营
              </button>
            </>
          ) : (
            <div className="map-empty-state">
              <p className="eyebrow">等待选择</p>
              <h2>点击地图上的不规则耕地区域</h2>
              <p>
                区域热区沿地形图上的主要地形区边缘绘制。选中后会保持高亮，并显示土地特征、土壤、坡度、适宜作物和主要风险。
              </p>
            </div>
          )}

          <div className="quick-region-list">
            <h3>典型区域</h3>
            {landformRegions.map((landform) => {
              const region = regions.find((item) => item.id === landform.id);
              if (!region) return null;
              return (
              <button
                key={landform.id}
                className={selectedRegionId === landform.id ? "quick-region active" : "quick-region"}
                onClick={() => setSelectedRegionId(landform.id)}
              >
                <span>{landform.name}</span>
                <small>{landform.landFeature}</small>
              </button>
              );
            })}
          </div>
        </aside>
      </div>
    </section>
  );
}
