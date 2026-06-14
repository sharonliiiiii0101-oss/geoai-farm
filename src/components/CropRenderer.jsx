import { useMemo } from "react";
import PlantSprite from "./PlantSprite.jsx";
import { getCropSuitabilityStatus } from "../data/cropSuitability.js";
import { cropVisuals, defaultCropVisual } from "../data/cropVisuals.js";
import { canPlacePlantInPolygon, getPolygonBounds, pointInPolygon, pointInRect } from "../utils/geometry.js";

const PLANT_SAFE_MARGIN = 0.45;

const labelAvoidZones = [
  { left: 0, top: 88, width: 25, height: 12 },
  { left: 35, top: 88, width: 30, height: 12 },
  { left: 75, top: 88, width: 25, height: 12 }
];

const layoutConfig = {
  plain_rows: { total: { high: 34, medium: 26, low: 14 }, rowSpacing: 7.2, colSpacing: 8.5, minDistance: 5.4, jitterX: 0.45, jitterY: 0.35 },
  irrigated_rows: { total: { high: 32, medium: 24, low: 12 }, rowSpacing: 7.4, colSpacing: 9.2, minDistance: 5.8, jitterX: 0.4, jitterY: 0.3 },
  paddy_grid: { total: { high: 32, medium: 24, low: 12 }, rowSpacing: 5.4, colSpacing: 6.8, minDistance: 4.2, jitterX: 0.25, jitterY: 0.22 },
  terrace_bands: { total: { high: 20, medium: 14, low: 8 }, rowSpacing: 5.8, colSpacing: 9.6, minDistance: 6.4, jitterX: 0.5, jitterY: 0.18 },
  terrace_patches: { total: { high: 24, medium: 18, low: 8 }, rowSpacing: 5.7, colSpacing: 8.6, minDistance: 6.8, jitterX: 0.35, jitterY: 0.2 },
  patchwork_fields: { total: { high: 22, medium: 16, low: 8 }, rowSpacing: 5.8, colSpacing: 8.8, minDistance: 6.2, jitterX: 0.35, jitterY: 0.25 }
};

const cropSizeConfig = {
  corn: { width: 4.2, height: 10.8 },
  soybean: { width: 4.4, height: 6.4 },
  rice: { width: 2.8, height: 6.3 },
  wheat: { width: 2.8, height: 7.1 },
  cotton: { width: 4.2, height: 7.4 },
  potato: { width: 4.5, height: 4.6 },
  rapeseed: { width: 4.3, height: 8.1 },
  tea: { width: 5.6, height: 3.9 }
};

function getCropHealth({ fertility, water, ecology, suitabilityStatus, cropId }) {
  if (suitabilityStatus === "notRecommended" || fertility < 40 || water < 35 || ecology < 45) return "poor";
  if (fertility < 60 || water < 40 || ecology < 55) return "stressed";
  if (suitabilityStatus === "recommended" && fertility >= 70 && water >= 45 && ecology >= 65) return "lush";
  if (fertility >= 80 && water >= 45 && ecology >= 70) return "lush";
  if (cropId === "rice" && water >= 55 && water <= 85) return "lush";
  return "normal";
}

function getDensity(health, fertility) {
  if (health === "poor") return "low";
  if (health === "stressed") return "medium";
  if (health === "lush" || fertility >= 80) return "high";
  return "medium";
}

function makeRandom(seedText) {
  let seed = 2166136261;
  for (let index = 0; index < seedText.length; index += 1) {
    seed ^= seedText.charCodeAt(index);
    seed = Math.imul(seed, 16777619);
  }

  return () => {
    seed += 0x6d2b79f5;
    let value = seed;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function getScale(y, cropId, layout) {
  const cropAdjust = cropId === "corn" ? 0.98 : cropId === "tea" ? 0.9 : cropId === "rice" || cropId === "wheat" ? 0.86 : 0.94;
  const layoutAdjust = layout === "terrace_bands" || layout === "terrace_patches" ? 0.9 : layout === "paddy_grid" ? 0.86 : 1.04;
  return Math.min(1.28, (0.56 + (y / 100) * 0.58) * cropAdjust * layoutAdjust);
}

function getPlantFootprint(cropId, scale) {
  const base = cropSizeConfig[cropId] ?? cropSizeConfig.corn;
  return {
    width: base.width * scale + PLANT_SAFE_MARGIN,
    height: base.height * scale + PLANT_SAFE_MARGIN
  };
}

function isFarEnough(plant, plants, minDistance) {
  return plants.every((existing) => {
    const dx = plant.x - existing.x;
    const dy = (plant.y - existing.y) * 1.35;
    return Math.sqrt(dx * dx + dy * dy) >= minDistance;
  });
}

function avoidsLabels(plant, footprint) {
  const samplePoints = [
    { x: plant.x, y: plant.y },
    { x: plant.x - footprint.width / 2, y: plant.y },
    { x: plant.x + footprint.width / 2, y: plant.y },
    { x: plant.x, y: plant.y - footprint.height * 0.35 }
  ];

  return labelAvoidZones.every((zone) => samplePoints.every((point) => !pointInRect(point, zone)));
}

function makeOrderedCandidates({ bounds, layout, random }) {
  const config = layoutConfig[layout] ?? layoutConfig.plain_rows;
  const candidates = [];
  const bottomLimit = Math.min(bounds.maxY, 88.2);
  const topStart = bounds.minY + 1.2;

  for (let row = 0, y = topStart; y <= bottomLimit; row += 1, y += config.rowSpacing) {
    const rowOffset = row % 2 === 0 ? 0 : config.colSpacing * 0.5;
    const terraceShift = layout === "terrace_bands" || layout === "terrace_patches" ? row * 0.9 : 0;

    for (let x = bounds.minX + config.colSpacing * 0.45 + rowOffset; x <= bounds.maxX - config.colSpacing * 0.35; x += config.colSpacing) {
      candidates.push({
        x: x + terraceShift + (random() - 0.5) * config.jitterX,
        y: y + (random() - 0.5) * config.jitterY,
        row
      });
    }
  }

  return candidates;
}

function generatePlants({ polygon, targetCount, layout, cropId, seed }) {
  if (!polygon?.length) return [];

  const bounds = getPolygonBounds(polygon);
  const random = makeRandom(seed);
  const config = layoutConfig[layout] ?? layoutConfig.plain_rows;
  const candidates = makeOrderedCandidates({ bounds, layout, random });
  const plants = [];

  for (const candidate of candidates) {
    if (plants.length >= targetCount) break;
    if (!pointInPolygon(candidate, polygon)) continue;

    const scale = getScale(candidate.y, cropId, layout);
    const footprint = getPlantFootprint(cropId, scale);
    if (!canPlacePlantInPolygon({
      x: candidate.x,
      y: candidate.y,
      plantWidth: footprint.width,
      plantHeight: footprint.height,
      polygon,
      safeMargin: PLANT_SAFE_MARGIN
    })) continue;
    if (!avoidsLabels(candidate, footprint)) continue;
    if (!isFarEnough(candidate, plants, config.minDistance)) continue;

    plants.push({
      x: candidate.x,
      y: candidate.y,
      scale,
      row: candidate.row
    });
  }

  return plants.sort((a, b) => a.y - b.y);
}

function getTargetCount(layout, density, polygonCount) {
  const config = layoutConfig[layout] ?? layoutConfig.plain_rows;
  const total = config.total[density] ?? config.total.medium;
  return Math.max(2, Math.ceil(total / Math.max(1, polygonCount)));
}

export default function CropRenderer({
  crop,
  region,
  fertility,
  water,
  ecology,
  sceneType,
  layout = "plain_rows",
  polygon,
  polygonIndex = 0,
  polygonCount = 1
}) {
  const visual = cropVisuals[crop?.id] ?? defaultCropVisual;
  const suitabilityStatus = getCropSuitabilityStatus(region.id, crop?.name ?? visual.name);
  const health = getCropHealth({ fertility, water, ecology, suitabilityStatus, cropId: visual.id });
  const density = getDensity(health, fertility);
  const targetCount = getTargetCount(layout, density, polygonCount);
  const showPlantDebug =
    import.meta.env.DEV &&
    typeof window !== "undefined" &&
    new URLSearchParams(window.location.search).get("plants") === "1";
  const plants = useMemo(
    () => generatePlants({
      polygon,
      targetCount,
      layout,
      cropId: visual.id,
      seed: `${region.id}-${visual.id}-${layout}-${polygonIndex}-${density}-${suitabilityStatus}`
    }),
    [polygon, targetCount, layout, region.id, visual.id, polygonIndex, density, suitabilityStatus]
  );

  return (
    <div
      className={[
        "crop-renderer",
        "crop-mask-renderer",
        `crop-${visual.id}`,
        `crop-health-${health}`,
        `crop-fit-${suitabilityStatus}`,
        `density-${density}`,
        sceneType ? `crop-scene-${sceneType}` : "",
        `crop-layout-${layout}`,
        showPlantDebug ? "show-plant-debug" : ""
      ].join(" ")}
      aria-label={`polygon-${polygonIndex + 1} ${visual.name}：${visual.description}`}
    >
      {plants.map((plant, index) => (
        <PlantSprite
          cropId={visual.id}
          debug={showPlantDebug}
          health={health}
          key={`${visual.id}-${polygonIndex}-${index}`}
          scale={plant.scale}
          x={plant.x}
          y={plant.y}
        />
      ))}
    </div>
  );
}
