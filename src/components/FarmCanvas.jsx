import CropRenderer from "./CropRenderer.jsx";
import { defaultCropAreaMask, cropAreaMasks } from "../data/cropAreaMasks.js";
import { defaultFarmBackground, farmBackgrounds } from "../data/farmBackgrounds.js";
import { defaultFarmSceneConfig, farmSceneConfigs } from "../data/farmSceneConfigs.js";
import { polygonToClipPath } from "../utils/geometry.js";

const ENABLE_CROP_MASK_DEBUG = false;

const measureClassMap = {
  irrigation: "measure-irrigation",
  savingWater: "measure-saving-water",
  overIrrigation: "measure-over-irrigation",
  fertilizer: "measure-fertilizer",
  overFertilizer: "measure-over-fertilizer",
  straw: "measure-straw",
  rotation: "measure-rotation",
  terrace: "measure-terrace",
  drainage: "measure-drainage",
  returnForest: "measure-return-forest",
  highStandard: "measure-high-standard",
  shelterbelt: "measure-shelterbelt",
  conservation: "measure-conservation",
  greenAgri: "measure-green-agri",
  mulch: "measure-mulch",
  droughtCrop: "measure-drought-crop"
};

function metricClass(prefix, value) {
  if (value >= 80) return `${prefix}-high`;
  if (value >= 60) return `${prefix}-normal`;
  if (value >= 40) return `${prefix}-low`;
  return `${prefix}-critical`;
}

function getRiskClasses(farmState) {
  const riskText = `${(farmState.riskLabels ?? []).join(" ")} ${farmState.lastEvent?.name ?? ""}`;
  return [
    riskText.includes("干旱") ? "risk-drought" : "",
    riskText.includes("洪涝") || riskText.includes("积水") ? "risk-flood" : "",
    riskText.includes("盐渍化") ? "risk-salinization" : "",
    riskText.includes("水土流失") ? "risk-erosion" : "",
    riskText.includes("石漠化") ? "risk-karst" : "",
    riskText.includes("黑土退化") ? "risk-black-soil-loss" : "",
    riskText.includes("污染") || riskText.includes("酸化") ? "risk-pollution" : "",
    riskText.includes("建设占用") || riskText.includes("建设占地") ? "risk-urban" : ""
  ].filter(Boolean);
}

function ZoneEffects() {
  return (
    <div className="zone-effects" aria-hidden="true">
      <div className="straw-layer" />
      <div className="mulch-layer" />
      <div className="water-layer" />
      <div className="crack-layer" />
      <div className="salt-layer" />
      <div className="pollution-layer" />
      <div className="erosion-layer" />
      <div className="grass-layer" />
      <div className="return-forest-layer" />
    </div>
  );
}

export default function FarmCanvas({ region, farmState, currentCrop, selectedMeasures = [] }) {
  const config = farmSceneConfigs[region.id] ?? defaultFarmSceneConfig;
  const mask = cropAreaMasks[region.id] ?? cropAreaMasks[config.backgroundKey] ?? defaultCropAreaMask;
  const cropPolygons = mask.cropPolygons?.length ? mask.cropPolygons : defaultCropAreaMask.cropPolygons;
  const backgroundImage = farmBackgrounds[config.backgroundKey] ?? farmBackgrounds[region.id] ?? defaultFarmBackground;
  const visualClasses = farmState.activeVisuals ?? [];
  const measureClasses = selectedMeasures.map((id) => measureClassMap[id]).filter(Boolean);
  const query = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
  const showCropMaskDebug = ENABLE_CROP_MASK_DEBUG && import.meta.env.DEV && query?.get("masks") === "1";

  const fieldClasses = [
    "farm-canvas",
    "farm-canvas-with-background",
    `scene-${config.sceneType}`,
    metricClass("fertility", farmState.fertility),
    metricClass("water", farmState.water),
    metricClass("ecology", farmState.ecology),
    currentCrop?.id ? `selected-crop-${currentCrop.id}` : "",
    ...visualClasses,
    ...getRiskClasses(farmState),
    ...measureClasses
  ].join(" ");

  return (
    <div className={fieldClasses} aria-label="动态农田画面">
      <img key={config.backgroundKey ?? region.id} className="farm-background" src={backgroundImage} alt={`${region.name}耕地底图`} />

      <div className="farm-land-layers" aria-hidden="true">
        {cropPolygons.map((polygon, index) => (
          <div
            className="crop-mask-layer"
            data-polygon-index={index}
            key={`${region.id}-polygon-${index}`}
            style={{ clipPath: polygonToClipPath(polygon) }}
          >
            <ZoneEffects />
            <CropRenderer
              crop={currentCrop}
              region={region}
              fertility={farmState.fertility}
              water={farmState.water}
              ecology={farmState.ecology}
              sceneType={config.sceneType}
              layout={config.cropLayout}
              polygon={polygon}
              polygonIndex={index}
              polygonCount={cropPolygons.length}
            />
          </div>
        ))}
      </div>

      {showCropMaskDebug && (
        <svg className="crop-mask-debug" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          {cropPolygons.map((polygon, index) => (
            <polygon
              key={`${region.id}-debug-${index}`}
              points={polygon.map((point) => `${point.x},${point.y}`).join(" ")}
            />
          ))}
        </svg>
      )}

      <div className="farm-label-layer">
        <div className="scene-label">
          <strong>{region.name}</strong>
          <span>{config.label}</span>
        </div>

        <div className="canvas-legend">
          <span>肥力 {farmState.fertility}</span>
          <span>水分 {farmState.water}</span>
          <span>生态 {farmState.ecology}</span>
        </div>
      </div>
    </div>
  );
}
