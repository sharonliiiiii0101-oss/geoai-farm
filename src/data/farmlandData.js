// 所有课堂模拟的基础数据集中在这里，便于教师后续扩展或修改。
export const crops = [
  { id: "corn", name: "玉米", waterNeed: 55, fertilityNeed: 60 },
  { id: "soybean", name: "大豆", waterNeed: 50, fertilityNeed: 52 },
  { id: "rice", name: "水稻", waterNeed: 80, fertilityNeed: 62 },
  { id: "wheat", name: "小麦", waterNeed: 48, fertilityNeed: 58 },
  { id: "cotton", name: "棉花", waterNeed: 45, fertilityNeed: 58 },
  { id: "potato", name: "马铃薯", waterNeed: 42, fertilityNeed: 50 },
  { id: "rapeseed", name: "油菜", waterNeed: 58, fertilityNeed: 54 },
  { id: "tea", name: "茶叶", waterNeed: 70, fertilityNeed: 55 }
];

export const intensityOptions = [
  {
    id: "low",
    name: "低强度开发",
    description: "产量提升较慢，但利于恢复地力。",
    effects: { yield: -6, fertility: 4, water: 1, ecology: 5 }
  },
  {
    id: "moderate",
    name: "适度开发",
    description: "兼顾粮食产出和耕地保护。",
    effects: { yield: 7, fertility: -2, water: -2, ecology: -1 }
  },
  {
    id: "high",
    name: "高强度开发",
    description: "短期增产明显，但退化风险上升。",
    effects: { yield: 16, fertility: -10, water: -6, ecology: -12 }
  }
];

export const measures = [
  {
    id: "normal",
    name: "正常耕作",
    tags: ["基础"],
    effects: { yield: 2, fertility: -1, water: -1, ecology: -1 }
  },
  {
    id: "irrigation",
    name: "合理灌溉",
    tags: ["水分"],
    effects: { yield: 6, water: 12, ecology: 1 }
  },
  {
    id: "overIrrigation",
    name: "过量灌溉",
    tags: ["风险"],
    effects: { yield: 2, water: 22, fertility: -3, ecology: -9 }
  },
  {
    id: "fertilizer",
    name: "合理施肥",
    tags: ["肥力"],
    effects: { yield: 7, fertility: 7, ecology: -1 }
  },
  {
    id: "overFertilizer",
    name: "过量施肥",
    tags: ["风险"],
    effects: { yield: 5, fertility: -5, water: -2, ecology: -10 }
  },
  {
    id: "straw",
    name: "秸秆还田",
    tags: ["保护"],
    effects: { yield: 2, fertility: 8, water: 2, ecology: 5 }
  },
  {
    id: "rotation",
    name: "轮作休耕",
    tags: ["保护"],
    effects: { yield: -7, fertility: 10, water: 4, ecology: 9 }
  },
  {
    id: "terrace",
    name: "修筑梯田",
    tags: ["坡地"],
    effects: { yield: 4, fertility: 4, water: 4, ecology: 8 }
  },
  {
    id: "savingWater",
    name: "节水灌溉",
    tags: ["水分", "科技"],
    effects: { yield: 5, water: 8, ecology: 4 }
  },
  {
    id: "drainage",
    name: "建设排水渠",
    tags: ["水分", "工程"],
    effects: { yield: 3, water: -10, ecology: 3 }
  },
  {
    id: "returnForest",
    name: "退耕还林还草",
    tags: ["生态"],
    effects: { yield: -12, fertility: 8, water: 3, ecology: 14 }
  },
  {
    id: "highStandard",
    name: "建设高标准农田",
    tags: ["工程", "科技"],
    effects: { yield: 9, fertility: 5, water: 5, ecology: 6 }
  },
  {
    id: "shelterbelt",
    name: "种植防护林",
    tags: ["生态"],
    effects: { yield: 2, fertility: 3, water: 2, ecology: 9 }
  },
  {
    id: "conservation",
    name: "保护性耕作",
    tags: ["保护"],
    effects: { yield: 2, fertility: 7, water: 3, ecology: 6 }
  },
  {
    id: "greenAgri",
    name: "绿色农业",
    tags: ["保护"],
    effects: { yield: 1, fertility: 5, water: 2, ecology: 8 }
  },
  {
    id: "mulch",
    name: "覆盖种植",
    tags: ["坡地"],
    effects: { yield: 2, fertility: 4, water: 5, ecology: 7 }
  },
  {
    id: "droughtCrop",
    name: "耐旱作物",
    tags: ["水分"],
    effects: { yield: 3, water: 4, ecology: 2 }
  }
];

export const climateEvents = {
  normal: {
    id: "normal",
    name: "正常年份",
    description: "气候条件总体适宜，经营措施的影响更明显。",
    effects: { yield: 3, fertility: 0, water: 0, ecology: 1 }
  },
  drought: {
    id: "drought",
    name: "干旱",
    description: "降水偏少，土壤水分下降，作物容易减产。",
    effects: { yield: -12, fertility: -1, water: -18, ecology: -5 }
  },
  flood: {
    id: "flood",
    name: "洪涝",
    description: "降水过多或排水不畅，低洼耕地可能积水。",
    effects: { yield: -11, fertility: -4, water: 22, ecology: -6 }
  },
  stormErosion: {
    id: "stormErosion",
    name: "暴雨冲刷",
    description: "坡面径流增强，水土流失风险上升。",
    effects: { yield: -8, fertility: -8, water: 8, ecology: -10 }
  },
  windSand: {
    id: "windSand",
    name: "风沙",
    description: "风力侵蚀会带走表层细土和有机质。",
    effects: { yield: -7, fertility: -6, water: -5, ecology: -7 }
  },
  frost: {
    id: "frost",
    name: "低温冻害",
    description: "低温影响作物生长期，尤其会压低当年产量。",
    effects: { yield: -9, fertility: 0, water: 0, ecology: -2 }
  },
  salinization: {
    id: "salinization",
    name: "土壤盐渍化风险上升",
    description: "蒸发强、排水弱或灌溉不当时，盐分容易在地表累积。",
    effects: { yield: -8, fertility: -5, water: -3, ecology: -8 }
  },
  blackSoilLoss: {
    id: "blackSoilLoss",
    name: "黑土退化风险上升",
    description: "长期高强度利用会使黑土有机质下降、黑土层变薄。",
    effects: { yield: -6, fertility: -9, water: -1, ecology: -8 }
  },
  urbanOccupation: {
    id: "urbanOccupation",
    name: "城市建设占用耕地",
    description: "建设用地扩张会压缩优质耕地面积，影响粮食安全基础。",
    effects: { yield: -10, fertility: -2, water: 0, ecology: -6 }
  }
};

export const regions = [
  {
    id: "songnen",
    name: "松嫩平原",
    position: { left: "70%", top: "16%" },
    slope: "<2°",
    soil: "黑土",
    landType: "旱地为主，局部水田",
    climate: "温带季风气候，雨热同期，生长期较集中",
    suitableCrops: ["玉米", "大豆", "水稻"],
    extraCrops: "甜菜、高粱",
    initial: { fertility: 90, water: 70, ecology: 80, yieldPotential: 85 },
    risks: ["黑土退化", "风蚀", "过度开发"],
    suitableMeasures: ["秸秆还田", "轮作休耕", "保护性耕作", "建设高标准农田"],
    teachingTip: "黑土肥力高，但长期高强度开发会导致有机质下降和黑土层变薄。",
    eventWeights: {
      normal: 30,
      blackSoilLoss: 22,
      windSand: 15,
      drought: 12,
      flood: 6,
      frost: 10,
      urbanOccupation: 5
    }
  },
  {
    id: "huabei",
    name: "华北平原",
    position: { left: "61%", top: "38%" },
    slope: "<3°",
    soil: "潮土、褐土",
    landType: "旱地为主，灌溉农业发达",
    climate: "温带季风气候，春旱突出，水资源相对紧张",
    suitableCrops: ["小麦", "玉米", "棉花"],
    extraCrops: "花生、杂粮",
    initial: { fertility: 78, water: 55, ecology: 68, yieldPotential: 82 },
    risks: ["干旱", "地下水超采", "盐渍化"],
    suitableMeasures: ["节水灌溉", "合理灌溉", "建设排水渠", "建设高标准农田"],
    teachingTip: "华北平原粮食产量高，但水资源短缺，节水农业对保障粮食安全十分关键。",
    eventWeights: {
      normal: 28,
      drought: 24,
      salinization: 16,
      windSand: 9,
      frost: 8,
      flood: 5,
      urbanOccupation: 10
    }
  },
  {
    id: "yangtze",
    name: "长江中下游平原",
    position: { left: "64%", top: "57%" },
    slope: "<2°",
    soil: "水稻土、冲积土",
    landType: "水田为主，河湖密布",
    climate: "亚热带季风气候，降水丰富，夏季洪涝风险较高",
    suitableCrops: ["水稻", "油菜", "小麦"],
    extraCrops: "莲藕、棉花",
    initial: { fertility: 82, water: 82, ecology: 74, yieldPotential: 88 },
    risks: ["洪涝", "土地污染", "城市占用耕地"],
    suitableMeasures: ["建设排水渠", "合理灌溉", "建设高标准农田", "绿色农业"],
    teachingTip: "水热条件优越带来高产潜力，但洪涝和建设占地会影响耕地稳定性。",
    eventWeights: {
      normal: 30,
      flood: 25,
      stormErosion: 8,
      urbanOccupation: 16,
      drought: 5,
      frost: 6,
      salinization: 4,
      blackSoilLoss: 0
    }
  },
  {
    id: "loess",
    name: "黄土高原",
    position: { left: "49%", top: "42%" },
    slope: "8°-25°",
    soil: "黄土、黄绵土",
    landType: "旱地和坡耕地较多",
    climate: "温带季风向温带大陆性过渡，降水集中且变率大",
    suitableCrops: ["玉米", "马铃薯"],
    extraCrops: "谷子、苹果",
    initial: { fertility: 62, water: 48, ecology: 52, yieldPotential: 62 },
    risks: ["水土流失", "土层变薄", "坡耕地退化"],
    suitableMeasures: ["修筑梯田", "退耕还林还草", "种植防护林", "覆盖种植"],
    teachingTip: "坡面径流会带走土壤，梯田和植被恢复能显著减少水土流失。",
    eventWeights: {
      normal: 24,
      stormErosion: 26,
      drought: 18,
      windSand: 12,
      frost: 7,
      urbanOccupation: 5,
      flood: 3,
      salinization: 5
    }
  },
  {
    id: "yungui",
    name: "云贵高原",
    position: { left: "48%", top: "70%" },
    slope: "10°-30°",
    soil: "红壤、石灰土",
    landType: "坡耕地、梯田和小块耕地并存",
    climate: "亚热带季风气候，立体气候明显，喀斯特地貌广布",
    suitableCrops: ["玉米", "马铃薯", "茶叶"],
    extraCrops: "烟草、杂粮",
    initial: { fertility: 58, water: 66, ecology: 55, yieldPotential: 58 },
    risks: ["石漠化", "水土流失", "耕地破碎"],
    suitableMeasures: ["修筑梯田", "退耕还林还草", "种植防护林", "覆盖种植"],
    teachingTip: "喀斯特山区土层薄，坡地开发不当会加剧石漠化和耕地破碎化。",
    eventWeights: {
      normal: 28,
      stormErosion: 24,
      flood: 8,
      drought: 12,
      urbanOccupation: 4,
      frost: 5,
      salinization: 3,
      windSand: 4
    }
  },
  {
    id: "xinjiang",
    name: "新疆绿洲农业区",
    position: { left: "22%", top: "32%" },
    slope: "<5°",
    soil: "灌淤土、灰漠土",
    landType: "绿洲灌溉农业",
    climate: "温带大陆性气候，降水稀少，蒸发强",
    suitableCrops: ["棉花", "小麦"],
    extraCrops: "瓜果、玉米",
    initial: { fertility: 68, water: 42, ecology: 50, yieldPotential: 70 },
    risks: ["干旱", "盐渍化", "水资源不足"],
    suitableMeasures: ["节水灌溉", "建设排水渠", "耐旱作物", "合理灌溉"],
    teachingTip: "绿洲农业离不开灌溉，但灌溉过量和排水不足会提高盐渍化风险。",
    eventWeights: {
      normal: 22,
      drought: 28,
      salinization: 24,
      windSand: 12,
      frost: 6,
      urbanOccupation: 3,
      flood: 1,
      stormErosion: 4
    }
  },
  {
    id: "southeast",
    name: "东南丘陵",
    position: { left: "69%", top: "70%" },
    slope: "6°-20°",
    soil: "红壤",
    landType: "丘陵水田、旱地和园地交错",
    climate: "亚热带季风气候，水热充足，降水季节变化明显",
    suitableCrops: ["水稻", "茶叶"],
    extraCrops: "柑橘、油茶",
    initial: { fertility: 60, water: 76, ecology: 62, yieldPotential: 66 },
    risks: ["红壤酸化", "水土流失", "坡地开发"],
    suitableMeasures: ["修筑梯田", "种植防护林", "合理施肥", "退耕还林还草"],
    teachingTip: "红壤区水热充足，但坡地开垦和不合理施肥会带来酸化与水土流失。",
    eventWeights: {
      normal: 30,
      stormErosion: 18,
      flood: 12,
      drought: 8,
      urbanOccupation: 8,
      salinization: 3,
      frost: 5,
      windSand: 2
    }
  },
  {
    id: "sichuan",
    name: "四川盆地",
    position: { left: "50%", top: "60%" },
    slope: "盆地平原<5°，丘陵区较大",
    soil: "紫色土、水稻土",
    landType: "水田和旱地镶嵌，田块较细碎",
    climate: "亚热带湿润气候，热量充足，云雾多",
    suitableCrops: ["水稻", "小麦", "油菜"],
    extraCrops: "玉米、蔬菜",
    initial: { fertility: 75, water: 74, ecology: 70, yieldPotential: 80 },
    risks: ["耕地破碎化", "水土流失", "建设占地"],
    suitableMeasures: ["建设高标准农田", "合理灌溉", "轮作休耕", "绿色农业"],
    teachingTip: "盆地农业条件较好，推进高标准农田有利于改善田块破碎和基础设施不足。",
    eventWeights: {
      normal: 34,
      flood: 12,
      stormErosion: 12,
      urbanOccupation: 14,
      drought: 8,
      frost: 5,
      salinization: 2,
      windSand: 1
    }
  }
];

export const teachingGoals = [
  "理解我国耕地资源分布不均、类型多样、质量差异明显的特点",
  "理解耕地质量受地形、土壤、气候、水资源和人类活动共同影响",
  "理解过度开发、不合理灌溉、坡地开垦等会导致土地退化",
  "理解保护耕地、提升耕地质量和发展农业科技对粮食安全的重要性",
  "培养学生读图分析、区域认知、综合思维和人地协调观"
];
