export function pointInPolygon(point, polygon) {
  if (!point || !Array.isArray(polygon) || polygon.length < 3) return false;

  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].x;
    const yi = polygon[i].y;
    const xj = polygon[j].x;
    const yj = polygon[j].y;

    const intersects = yi > point.y !== yj > point.y &&
      point.x < ((xj - xi) * (point.y - yi)) / (yj - yi || Number.EPSILON) + xi;

    if (intersects) inside = !inside;
  }

  return inside;
}

export function getPolygonBounds(polygon) {
  const xs = polygon.map((point) => point.x);
  const ys = polygon.map((point) => point.y);

  return {
    minX: Math.min(...xs),
    maxX: Math.max(...xs),
    minY: Math.min(...ys),
    maxY: Math.max(...ys)
  };
}

export function polygonToClipPath(polygon) {
  return `polygon(${polygon.map((point) => `${point.x}% ${point.y}%`).join(", ")})`;
}

export function canPlacePlantInPolygon({ x, y, plantWidth, plantHeight, polygon, safeMargin = 0 }) {
  const halfWidth = plantWidth / 2 + safeMargin;
  const height = plantHeight + safeMargin;
  const bottomPad = safeMargin * 0.35;
  const samplePoints = [
    { x, y },
    { x: x - halfWidth, y },
    { x: x + halfWidth, y },
    { x: x - halfWidth, y: y - height },
    { x: x + halfWidth, y: y - height },
    { x, y: y - height },
    { x: x - halfWidth, y: y - height * 0.5 },
    { x: x + halfWidth, y: y - height * 0.5 },
    { x, y: y + bottomPad }
  ];

  return samplePoints.every((point) => pointInPolygon(point, polygon));
}

export function pointInRect(point, rect) {
  return point.x >= rect.left &&
    point.x <= rect.left + rect.width &&
    point.y >= rect.top &&
    point.y <= rect.top + rect.height;
}
