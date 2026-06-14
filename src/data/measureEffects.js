export const measureBaseEffects = {
  normal: { yield: 2, fertility: -1, water: -1, ecology: -1, safety: 0 },
  irrigation: { yield: 6, fertility: 0, water: 10, ecology: 1, safety: 2 },
  overIrrigation: { yield: 3, fertility: -2, water: 15, ecology: -8, safety: -4, risks: { "盐渍化风险": 8, "地下水超采风险": 8, "洪涝风险": 5 } },
  fertilizer: { yield: 5, fertility: 5, water: 0, ecology: -1, safety: 2 },
  overFertilizer: { yield: 5, fertility: -5, water: -2, ecology: -8, safety: -4, risks: { "污染风险": 8, "红壤酸化风险": 6 } },
  straw: { yield: 2, fertility: 6, water: 2, ecology: 4, safety: 2 },
  rotation: { yield: -5, fertility: 8, water: 3, ecology: 6, safety: 2 },
  terrace: { yield: 2, fertility: 2, water: 3, ecology: 4, safety: 2, risks: { "水土流失风险": -5 } },
  savingWater: { yield: 4, fertility: 0, water: 8, ecology: 4, safety: 4, risks: { "水资源压力": -5, "盐渍化风险": -3 } },
  drainage: { yield: 3, fertility: 0, water: -5, ecology: 3, safety: 3, risks: { "洪涝风险": -6, "盐渍化风险": -2 } },
  returnForest: { yield: -8, fertility: 6, water: 2, ecology: 12, safety: 2, risks: { "水土流失风险": -8, "石漠化风险": -6 } },
  highStandard: { yield: 8, fertility: 4, water: 4, ecology: 5, safety: 6, risks: { "耕地破碎化风险": -5 } },
  shelterbelt: { yield: 2, fertility: 2, water: 1, ecology: 8, safety: 3, risks: { "风蚀风险": -8, "水土流失风险": -4 } },
  conservation: { yield: 2, fertility: 6, water: 3, ecology: 6, safety: 3, risks: { "风蚀风险": -4, "水土流失风险": -4 } },
  greenAgri: { yield: 1, fertility: 4, water: 1, ecology: 8, safety: 3, risks: { "污染风险": -8, "红壤酸化风险": -5 } },
  mulch: { yield: 2, fertility: 3, water: 5, ecology: 6, safety: 3, risks: { "水土流失风险": -5, "干旱风险": -4 } },
  droughtCrop: { yield: 3, fertility: 0, water: 4, ecology: 2, safety: 3, risks: { "干旱风险": -6 } }
};

export const regionMeasureEffects = {
  huabei: {
    suitable: ["irrigation", "savingWater", "drainage", "fertilizer", "highStandard", "droughtCrop", "conservation"],
    neutral: ["normal", "straw", "rotation", "mulch", "greenAgri"],
    unsuitable: ["terrace", "returnForest", "overIrrigation", "overFertilizer"],
    special: {
      terrace: {
        effects: { yield: -2, fertility: 0, water: 0, ecology: -1, safety: -2 },
        note: "华北平原地势平坦，修筑梯田对水土保持作用有限，反而可能破坏连片耕地，不利于机械化耕作。建议优先选择节水灌溉、高标准农田建设和排水改良。"
      },
      savingWater: {
        effects: { yield: 4, fertility: 0, water: 10, ecology: 5, safety: 6 },
        risks: { "盐渍化风险": -5, "地下水超采风险": -5 },
        note: "华北平原水资源相对不足，节水灌溉有利于缓解干旱和地下水超采问题。"
      },
      overIrrigation: {
        effects: { yield: 3, fertility: -2, water: 15, ecology: -8, safety: -6 },
        risks: { "盐渍化风险": 10, "地下水超采风险": 10 },
        note: "华北平原过量灌溉会增加地下水超采和盐渍化风险。"
      }
    }
  },
  songnen: {
    suitable: ["straw", "rotation", "conservation", "fertilizer", "highStandard", "mulch"],
    neutral: ["normal", "irrigation", "savingWater", "droughtCrop", "greenAgri"],
    unsuitable: ["terrace", "overFertilizer", "overIrrigation", "returnForest"],
    special: {
      straw: { effects: { yield: 2, fertility: 8, water: 2, ecology: 5, safety: 5 }, risks: { "黑土退化风险": -8 }, note: "秸秆还田能补充有机质，是松嫩平原黑土保护的重要措施。" },
      rotation: { effects: { yield: -4, fertility: 10, water: 3, ecology: 8, safety: 6 }, note: "轮作休耕会降低短期产量，但能恢复黑土地力并提高长期粮食安全。" },
      terrace: { effects: { yield: -2, fertility: 0, water: 0, ecology: -1, safety: -2 }, note: "松嫩平原地势平坦，黑土保护重点不是修梯田，而是秸秆还田、轮作休耕和保护性耕作。" }
    }
  },
  yangtze: {
    suitable: ["drainage", "irrigation", "fertilizer", "greenAgri", "highStandard", "rotation"],
    neutral: ["normal", "straw", "conservation"],
    unsuitable: ["terrace", "overIrrigation", "overFertilizer", "droughtCrop"],
    special: {
      drainage: { effects: { yield: 3, fertility: 0, water: -5, ecology: 5, safety: 6 }, risks: { "洪涝风险": -10 }, note: "长江中下游平原地势低平，建设排水渠能减轻洪涝和积水影响。" },
      overIrrigation: { effects: { yield: -2, fertility: -2, water: 12, ecology: -5, safety: -5 }, risks: { "洪涝风险": 10 }, note: "长江中下游平原河湖密布，过量灌溉会加重积水和洪涝风险。" },
      terrace: { effects: { yield: -2, fertility: 0, water: 0, ecology: -1, safety: -2 }, note: "长江中下游平原地势低平，主要问题是洪涝与排水，修筑梯田不是适宜措施。" }
    }
  },
  loess: {
    suitable: ["terrace", "returnForest", "shelterbelt", "mulch", "droughtCrop", "conservation", "fertilizer"],
    neutral: ["normal", "straw", "rotation", "savingWater"],
    unsuitable: ["overIrrigation", "overFertilizer"],
    special: {
      terrace: { effects: { yield: 6, fertility: 4, water: 5, ecology: 10, safety: 8 }, risks: { "水土流失风险": -12 }, note: "黄土高原坡度较大，修筑梯田可以减缓坡面径流，减少水土流失，提高保水保土能力。" },
      returnForest: { effects: { yield: -8, fertility: 6, water: 3, ecology: 15, safety: 5 }, risks: { "水土流失风险": -15 }, note: "退耕还林还草会降低短期产量，但能显著恢复生态并减少水土流失。" }
    }
  },
  yungui: {
    suitable: ["terrace", "returnForest", "shelterbelt", "mulch", "conservation", "greenAgri"],
    neutral: ["normal", "fertilizer", "rotation", "droughtCrop"],
    unsuitable: ["overIrrigation", "overFertilizer"],
    special: {
      terrace: { effects: { yield: 4, fertility: 3, water: 4, ecology: 8, safety: 5 }, risks: { "水土流失风险": -10 }, note: "云贵高原地形崎岖，修筑梯田有利于稳定坡耕地并减少水土流失。" },
      returnForest: { effects: { yield: -6, fertility: 5, water: 2, ecology: 12, safety: 4 }, risks: { "石漠化风险": -10, "水土流失风险": -8 }, note: "退耕还林还草能缓解石漠化和水土流失，但会减少短期耕地产出。" }
    }
  },
  xinjiang: {
    suitable: ["savingWater", "irrigation", "drainage", "droughtCrop", "greenAgri", "mulch"],
    neutral: ["normal", "fertilizer", "conservation"],
    unsuitable: ["overIrrigation", "overFertilizer", "terrace", "returnForest"],
    special: {
      savingWater: { effects: { yield: 4, fertility: 0, water: 8, ecology: 8, safety: 8 }, risks: { "盐渍化风险": -8, "水资源压力": -10 }, note: "新疆绿洲农业水资源紧张，节水灌溉能提高用水效率并降低盐渍化风险。" },
      overIrrigation: { effects: { yield: 3, fertility: -2, water: 12, ecology: -10, safety: -8 }, risks: { "盐渍化风险": 15, "水资源压力": 12 }, note: "新疆绿洲农业依赖灌溉，但过量灌溉会增加水资源压力，并可能导致土壤盐渍化。应优先选择节水灌溉和排水改良。" },
      terrace: { effects: { yield: -2, fertility: 0, water: 0, ecology: -1, safety: -2 }, note: "新疆绿洲农业区的核心问题是水资源配置和盐渍化防治，修筑梯田不是主要治理措施。" }
    }
  },
  sichuan: {
    suitable: ["highStandard", "irrigation", "fertilizer", "rotation", "drainage", "greenAgri", "conservation"],
    neutral: ["normal", "straw", "mulch", "terrace"],
    unsuitable: ["overIrrigation", "overFertilizer", "returnForest"],
    special: {
      highStandard: { effects: { yield: 8, fertility: 4, water: 4, ecology: 5, safety: 8 }, risks: { "耕地破碎化风险": -6 }, note: "四川盆地田块较细碎，高标准农田建设有利于改善灌排条件和机械化水平。" },
      terrace: { effects: { yield: 1, fertility: 1, water: 2, ecology: 2, safety: 1 }, note: "四川盆地局部丘陵地区可因地制宜修筑小型梯田，但平坝地区更适合高标准农田建设。" }
    }
  },
  southeast: {
    suitable: ["terrace", "shelterbelt", "mulch", "greenAgri", "fertilizer", "conservation", "returnForest"],
    neutral: ["normal", "irrigation", "rotation"],
    unsuitable: ["overFertilizer", "overIrrigation"],
    special: {
      terrace: { effects: { yield: 3, fertility: 2, water: 3, ecology: 6, safety: 4 }, risks: { "水土流失风险": -8 }, note: "东南丘陵坡地较多，修筑梯田能减少坡面径流并稳定耕作层。" },
      overFertilizer: { effects: { yield: 2, fertility: -4, water: -1, ecology: -8, safety: -6 }, risks: { "红壤酸化风险": 10 }, note: "东南丘陵红壤区过量施肥会加重酸化和面源污染风险。" }
    }
  }
};

export function getMeasureAdaptation(regionId, measureId) {
  const regionRules = regionMeasureEffects[regionId];
  if (!regionRules) return "neutral";
  if (regionRules.suitable.includes(measureId)) return "suitable";
  if (regionRules.unsuitable.includes(measureId)) return "unsuitable";
  return "neutral";
}

export function getMeasureNote(regionId, measureId) {
  return regionMeasureEffects[regionId]?.special?.[measureId]?.note ?? "";
}

function scaleValue(value, category) {
  if (category === "suitable") return value > 0 ? Math.round(value * 1.2) : value;
  if (category === "unsuitable") return value > 0 ? Math.round(value * 0.3) : value;
  return value;
}

export function getRegionalMeasureEffect(regionId, measureId) {
  const base = measureBaseEffects[measureId] ?? { yield: 0, fertility: 0, water: 0, ecology: 0, safety: 0 };
  const special = regionMeasureEffects[regionId]?.special?.[measureId];
  const category = getMeasureAdaptation(regionId, measureId);

  if (special) {
    return {
      category,
      effects: { yield: 0, fertility: 0, water: 0, ecology: 0, safety: 0, ...special.effects },
      risks: special.risks ?? {},
      note: special.note ?? ""
    };
  }

  const effects = {
    yield: scaleValue(base.yield ?? 0, category),
    fertility: scaleValue(base.fertility ?? 0, category),
    water: scaleValue(base.water ?? 0, category),
    ecology: scaleValue(base.ecology ?? 0, category),
    safety: scaleValue(base.safety ?? 0, category)
  };

  if (category === "suitable") {
    effects.safety += 3;
  }

  if (category === "unsuitable") {
    effects.ecology -= 4;
    effects.safety -= 4;
  }

  return {
    category,
    effects,
    risks: base.risks ?? {},
    note: category === "unsuitable" ? "该措施与当前区域不匹配，正向收益会降低，并可能带来额外生态压力。" : ""
  };
}
