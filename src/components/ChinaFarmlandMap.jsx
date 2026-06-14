import { useState } from "react";
import { landFeatureLegend, landformMapViewBox, landformRegions } from "../data/landformRegions.js";

export default function ChinaFarmlandMap({ selectedRegionId, onSelectRegion }) {
  const [hoveredRegionId, setHoveredRegionId] = useState(null);

  function renderRegionPaths(region) {
    const paths = region.paths ?? [region.path];
    const isSelected = selectedRegionId === region.id;
    const isHovered = hoveredRegionId === region.id;

    return paths.map((path, index) => (
      <path
        key={`${region.id}-${index}`}
        d={path}
        className={[
          "landform-region-path",
          isSelected ? "selected" : "",
          isHovered ? "hovered" : ""
        ].join(" ")}
        style={{
          "--region-color": region.color,
          "--region-stroke": region.strokeColor,
          fill: region.fill
        }}
        role="button"
        tabIndex={index === 0 ? 0 : -1}
        aria-label={`选择${region.name}`}
        onClick={() => onSelectRegion(region.id)}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            onSelectRegion(region.id);
          }
        }}
        onMouseEnter={() => setHoveredRegionId(region.id)}
        onMouseLeave={() => setHoveredRegionId(null)}
        onFocus={() => setHoveredRegionId(region.id)}
        onBlur={() => setHoveredRegionId(null)}
      >
        <title>{`${region.name}｜${region.landFeature}｜适宜作物：${region.crops.join("、")}`}</title>
      </path>
    ));
  }

  return (
    <div className="farmland-map-frame landform-map-frame">
      <img
        className="farmland-distribution-image landform-base-map"
        src="/assets/china-landform-map.jpg"
        alt="中国主要地形区分布图"
      />

      <svg
        className="farmland-svg-overlay landform-svg-overlay"
        viewBox={`0 0 ${landformMapViewBox.width} ${landformMapViewBox.height}`}
        preserveAspectRatio="xMidYMid meet"
        aria-label="中国主要地形区可点击热区"
      >
        <defs>
          <pattern id="paddyDryPattern" width="18" height="18" patternUnits="userSpaceOnUse" patternTransform="rotate(35)">
            <rect width="18" height="18" fill="#29B6F6" opacity="0.8" />
            <rect width="7" height="18" fill="#F6A13A" opacity="0.88" />
          </pattern>
          <pattern id="terracePattern" width="16" height="16" patternUnits="userSpaceOnUse">
            <rect width="16" height="16" fill="#C68642" opacity="0.82" />
            <path d="M0 4 H16 M0 11 H16" stroke="#8A5724" strokeWidth="2" opacity="0.72" />
          </pattern>
          <pattern id="oasisPattern" width="18" height="18" patternUnits="userSpaceOnUse" patternTransform="rotate(-25)">
            <rect width="18" height="18" fill="#2FBF71" opacity="0.8" />
            <path d="M0 9 H18" stroke="#087A3D" strokeWidth="4" opacity="0.42" />
          </pattern>
        </defs>

        {landformRegions.map((region) => renderRegionPaths(region))}
      </svg>

      <div className="map-shape-label-layer" aria-hidden="false">
        {landformRegions.map((region) => {
          const isSelected = selectedRegionId === region.id;
          const isHovered = hoveredRegionId === region.id;

          return (
            <button
              key={region.id}
              className={[
                "shape-map-label landform-map-label",
                isSelected ? "selected" : "",
                isHovered ? "hovered" : ""
              ].join(" ")}
              style={{
                "--region-color": region.color,
                left: `${(region.label.x / landformMapViewBox.width) * 100}%`,
                top: `${(region.label.y / landformMapViewBox.height) * 100}%`
              }}
              onClick={() => onSelectRegion(region.id)}
              onMouseEnter={() => setHoveredRegionId(region.id)}
              onMouseLeave={() => setHoveredRegionId(null)}
              title={`${region.name}｜${region.landFeature}｜适宜作物：${region.crops.join("、")}`}
            >
              <strong>{region.name}</strong>
              <small>{region.subtitle}</small>
            </button>
          );
        })}
      </div>

      <div className="landform-map-legend" aria-label="土地特征颜色图例">
        <strong>土地特征图例</strong>
        {landFeatureLegend.map((item) => (
          <span key={item.key}>
            <i className={item.swatchClass} />
            {item.label}
          </span>
        ))}
      </div>
    </div>
  );
}
