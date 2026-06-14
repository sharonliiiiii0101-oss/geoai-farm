const defaultRule = {
  recommended: [],
  optional: [],
  notRecommended: [],
  notes: {},
  effects: {}
};

export const cropSuitability = {
  huabei: {
    recommended: ["小麦", "玉米", "棉花"],
    optional: ["大豆", "马铃薯"],
    notRecommended: ["水稻", "茶叶", "油菜"],
    notes: {
      "小麦": "华北平原地势平坦，是我国重要的小麦产区，适合发展旱作和灌溉农业。",
      "玉米": "玉米适应性较强，适合华北平原夏季种植。",
      "棉花": "华北平原部分地区适合棉花种植，但需要合理灌溉。",
      "水稻": "水稻需水量较大，而华北平原水资源相对不足，大面积种植会增加灌溉压力，并可能加剧地下水超采。",
      "茶叶": "茶叶更适合温暖湿润的丘陵山地，华北平原并非主要适宜区。",
      "油菜": "油菜并非华北平原最典型的优势作物，本区更适合小麦、玉米等旱作或灌溉农业作物。"
    },
    effects: {
      "水稻": { water: -8, risks: { "水资源压力": 8, "地下水超采风险": 6 } }
    }
  },
  songnen: {
    recommended: ["玉米", "大豆", "水稻"],
    optional: ["小麦", "马铃薯"],
    notRecommended: ["茶叶", "棉花", "油菜"],
    notes: {
      "玉米": "松嫩平原黑土肥沃、地势开阔，是玉米的重要产区。",
      "大豆": "大豆适合黑土区种植，也有利于轮作和改善土壤氮素条件。",
      "水稻": "松嫩平原局部低洼地区和水源条件较好的地区可以发展水稻。",
      "茶叶": "茶叶需要较温暖湿润的丘陵山地环境，不符合松嫩平原的热量和区域农业特征。",
      "棉花": "棉花对热量条件要求较高，松嫩平原并非主要棉花适宜区。",
      "油菜": "油菜不是松嫩平原的主要优势作物，本区更适合玉米、大豆和局部水稻。"
    }
  },
  yangtze: {
    recommended: ["水稻", "油菜", "小麦"],
    optional: ["玉米", "大豆"],
    notRecommended: ["棉花", "马铃薯", "茶叶"],
    notes: {
      "水稻": "长江中下游平原地势低平、河湖密布、水热条件好，适合水田农业和水稻种植。",
      "油菜": "油菜常与水稻、小麦等形成轮作，是长江中下游地区常见作物。",
      "小麦": "长江中下游平原冬春季可发展小麦，与水稻等作物形成多熟制。",
      "棉花": "棉花并非该区域水田主导农业的最优选择，若大面积种植会削弱水田利用优势。",
      "马铃薯": "马铃薯更适合冷凉或旱作条件，长江中下游平原的优势在水田和多熟制农业。",
      "茶叶": "茶叶更适合丘陵山地，不是平原水田主导区的主要适宜作物。"
    }
  },
  loess: {
    recommended: ["玉米", "马铃薯", "小麦"],
    optional: ["大豆", "油菜"],
    notRecommended: ["水稻", "棉花", "茶叶"],
    notes: {
      "玉米": "玉米适应性较强，能够适应黄土高原旱作农业条件。",
      "马铃薯": "马铃薯较耐旱、适合坡耕地和旱作环境，是黄土高原较适宜的作物。",
      "小麦": "小麦可适应黄土高原部分旱作区，但需要注意水土保持和墒情。",
      "水稻": "水稻需水量大，不适合黄土高原坡耕地和干旱半干旱环境。",
      "棉花": "棉花不是黄土高原坡耕地的主要适宜作物，区域水热条件和地形约束较明显。",
      "茶叶": "茶叶更适合湿润丘陵环境，黄土高原干旱和水土流失风险较高。"
    },
    effects: {
      "水稻": { water: -8, risks: { "干旱风险": 6, "水资源压力": 8 } }
    }
  },
  yungui: {
    recommended: ["玉米", "马铃薯", "茶叶"],
    optional: ["油菜", "水稻"],
    notRecommended: ["棉花", "小麦", "大豆"],
    notes: {
      "玉米": "玉米适应性强，适合云贵高原山地和坡耕地农业。",
      "马铃薯": "马铃薯耐性较强，适合高原山地和小块坡耕地。",
      "茶叶": "茶叶适合温暖湿润的丘陵山地环境，云贵高原部分地区适宜发展茶叶等特色农业。",
      "棉花": "棉花不适合云贵高原地形破碎、坡地较多的农业环境。",
      "小麦": "大面积小麦种植不符合云贵高原山地和立体气候的主要农业特征。",
      "大豆": "大豆不是云贵高原的主要优势作物，本区更适合玉米、马铃薯和特色茶叶。"
    }
  },
  xinjiang: {
    recommended: ["棉花", "小麦", "玉米"],
    optional: ["马铃薯", "大豆"],
    notRecommended: ["水稻", "茶叶", "油菜"],
    notes: {
      "棉花": "新疆绿洲光照充足、昼夜温差大，适合棉花等灌溉农业作物。",
      "小麦": "小麦适合新疆绿洲灌溉农业区，需合理利用有限水资源。",
      "玉米": "玉米可在绿洲灌溉条件下种植，但需要注意节水。",
      "水稻": "水稻需水量大，而新疆绿洲农业水资源有限，大面积种植会加重灌溉压力和盐渍化风险。",
      "茶叶": "茶叶需要温暖湿润环境，不适合新疆干旱区绿洲农业条件。",
      "油菜": "油菜不是新疆绿洲农业的主要优势作物，水资源约束下应优先选择棉花、小麦或玉米。"
    },
    effects: {
      "水稻": { water: -10, ecology: -2, risks: { "水资源压力": 10, "盐渍化风险": 8 } }
    }
  },
  sichuan: {
    recommended: ["水稻", "油菜", "小麦"],
    optional: ["玉米", "马铃薯", "茶叶"],
    notRecommended: ["棉花", "大豆"],
    notes: {
      "水稻": "四川盆地水热条件较好，平坝和低洼地区适合发展水田和水稻种植。",
      "油菜": "油菜适合与水稻、小麦等形成轮作，是四川盆地常见作物。",
      "小麦": "四川盆地冬春季可种植小麦，适合多熟制农业。",
      "茶叶": "茶叶可在四川盆地周边丘陵山地发展，但并非所有盆地平坝都适合。",
      "棉花": "棉花不是四川盆地的主要优势作物，本区更适合水稻、油菜、小麦等多熟制农业。",
      "大豆": "大豆可以零星种植，但不是四川盆地的主导优势作物。"
    }
  },
  southeast: {
    recommended: ["茶叶", "水稻", "油菜"],
    optional: ["马铃薯", "玉米"],
    notRecommended: ["棉花", "小麦", "大豆"],
    notes: {
      "茶叶": "东南丘陵气候湿润、丘陵坡地多，适合发展茶叶等园地农业。",
      "水稻": "东南丘陵低洼地和河谷地区可发展水田农业。",
      "油菜": "油菜可与水稻等作物轮作，适合部分丘陵水田区。",
      "棉花": "棉花不是东南丘陵的主要适宜作物。",
      "小麦": "小麦不符合东南丘陵湿润丘陵农业的主要区域特征。",
      "大豆": "大豆不是东南丘陵的主要优势作物，本区更适合茶叶、水稻和油菜。"
    }
  }
};

cropSuitability.yangtze_plain = cropSuitability.yangtze;
cropSuitability.loess_plateau = cropSuitability.loess;
cropSuitability.yungui_plateau = cropSuitability.yungui;
cropSuitability.xinjiang_oasis = cropSuitability.xinjiang;
cropSuitability.sichuan_basin = cropSuitability.sichuan;
cropSuitability.southeast_hills = cropSuitability.southeast;

export const cropSuitabilityLabels = {
  recommended: "推荐",
  optional: "可选",
  notRecommended: "不推荐"
};

const baseEffects = {
  recommended: { yield: 8, fertility: 0, water: 0, ecology: 2, safety: 6, risks: {} },
  optional: { yield: 2, fertility: 0, water: 0, ecology: 0, safety: 1, risks: {} },
  notRecommended: { yield: -6, fertility: 0, water: 0, ecology: -4, safety: -5, risks: {} }
};

export function getCropSuitabilityStatus(regionId, cropName) {
  const rule = cropSuitability[regionId] ?? defaultRule;
  if (rule.recommended.includes(cropName)) return "recommended";
  if (rule.notRecommended.includes(cropName)) return "notRecommended";
  if (rule.optional.includes(cropName)) return "optional";
  return "optional";
}

export function getCropSuitabilityInfo(regionId, cropName) {
  const rule = cropSuitability[regionId] ?? defaultRule;
  const status = getCropSuitabilityStatus(regionId, cropName);
  const effects = {
    ...baseEffects[status],
    risks: { ...(baseEffects[status]?.risks ?? {}) }
  };
  const special = rule.effects?.[cropName];

  if (special) {
    effects.yield += special.yield ?? 0;
    effects.fertility += special.fertility ?? 0;
    effects.water += special.water ?? 0;
    effects.ecology += special.ecology ?? 0;
    effects.safety += special.safety ?? 0;
    effects.risks = { ...effects.risks, ...(special.risks ?? {}) };
  }

  return {
    status,
    label: cropSuitabilityLabels[status],
    recommended: rule.recommended,
    optional: rule.optional,
    notRecommended: rule.notRecommended,
    note: rule.notes?.[cropName] ?? "该作物在本区属于一般选择，需要结合水分、肥力和经营措施综合判断。",
    effects
  };
}

export function getCropAlternatives(regionId) {
  return cropSuitability[regionId]?.recommended ?? [];
}
