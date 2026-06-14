import { useMemo, useRef, useState } from "react";
import { cropAreaMasks } from "../data/cropAreaMasks.js";
import { defaultFarmBackground, farmBackgrounds } from "../data/farmBackgrounds.js";
import { defaultFarmSceneConfig, farmSceneConfigs } from "../data/farmSceneConfigs.js";

function roundPoint(point) {
  return {
    x: Number(point.x.toFixed(1)),
    y: Number(point.y.toFixed(1))
  };
}

function formatExport(regionId, polygons) {
  const payload = {
    [regionId]: {
      cropPolygons: polygons
    }
  };

  return `export const cropAreaMasks = ${JSON.stringify(payload, null, 2)};`;
}

export default function CropAreaEditor({ region, onClose }) {
  const config = farmSceneConfigs[region.id] ?? defaultFarmSceneConfig;
  const backgroundImage = farmBackgrounds[config.backgroundKey] ?? farmBackgrounds[region.id] ?? defaultFarmBackground;
  const initialPolygons = cropAreaMasks[region.id]?.cropPolygons ?? [];
  const [polygons, setPolygons] = useState(initialPolygons);
  const [currentPoints, setCurrentPoints] = useState([]);
  const [copied, setCopied] = useState(false);
  const mapRef = useRef(null);
  const exportText = useMemo(() => formatExport(region.id, polygons), [region.id, polygons]);

  function handleMapClick(event) {
    const rect = mapRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;

    if (x < 0 || x > 100 || y < 0 || y > 100) return;
    setCopied(false);
    setCurrentPoints((points) => [...points, roundPoint({ x, y })]);
  }

  function finishPolygon() {
    if (currentPoints.length < 3) return;
    setPolygons((items) => [...items, currentPoints]);
    setCurrentPoints([]);
    setCopied(false);
  }

  async function copyExport() {
    await navigator.clipboard.writeText(exportText);
    setCopied(true);
  }

  return (
    <section className="crop-area-editor-page">
      <header className="editor-header">
        <div>
          <p className="eyebrow">开发标注模式</p>
          <h1>{region.name} 种植区域标注</h1>
          <p>点击底图添加顶点，至少 3 个点后完成一个 polygon。坐标会按图片宽高转换为百分比。</p>
        </div>
        <button className="ghost-button" onClick={onClose}>返回模拟</button>
      </header>

      <div className="editor-layout">
        <div className="editor-map" ref={mapRef} onClick={handleMapClick}>
          <img src={backgroundImage} alt={`${region.name}耕地底图标注`} />
          <svg className="editor-overlay" viewBox="0 0 100 100" preserveAspectRatio="none">
            {polygons.map((polygon, polygonIndex) => (
              <polygon
                className="saved-polygon"
                key={`saved-${polygonIndex}`}
                points={polygon.map((point) => `${point.x},${point.y}`).join(" ")}
              />
            ))}
            {currentPoints.length > 0 && (
              <>
                <polyline
                  className="draft-polygon-line"
                  points={currentPoints.map((point) => `${point.x},${point.y}`).join(" ")}
                />
                {currentPoints.map((point, pointIndex) => (
                  <circle className="draft-point" key={`point-${pointIndex}`} cx={point.x} cy={point.y} r="0.8" />
                ))}
              </>
            )}
          </svg>
        </div>

        <aside className="editor-panel">
          <h2>标注工具</h2>
          <div className="editor-actions">
            <button onClick={finishPolygon} disabled={currentPoints.length < 3}>完成当前区域</button>
            <button onClick={() => setCurrentPoints((points) => points.slice(0, -1))} disabled={currentPoints.length === 0}>撤销上一个点</button>
            <button onClick={() => setPolygons((items) => items.slice(0, -1))} disabled={polygons.length === 0}>删除当前 polygon</button>
            <button onClick={() => { setPolygons([]); setCurrentPoints([]); setCopied(false); }}>清空当前区域</button>
          </div>

          <div className="editor-stats">
            <span>已保存 polygon：{polygons.length}</span>
            <span>当前顶点：{currentPoints.length}</span>
          </div>

          <h2>导出 JSON</h2>
          <textarea value={exportText} readOnly rows={14} />
          <button className="primary-button" onClick={copyExport}>{copied ? "已复制" : "复制导出数据"}</button>
          <p className="compact-text">复制后可把对应区域的 cropPolygons 粘贴到 src/data/cropAreaMasks.js 中。</p>
        </aside>
      </div>
    </section>
  );
}
