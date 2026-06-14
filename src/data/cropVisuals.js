export const cropVisuals = {
  corn: {
    id: "corn",
    name: "玉米",
    color: "#337f38",
    accentColor: "#72bc4d",
    pattern: "tall-stalks",
    description: "高秆、宽叶、成行分布"
  },
  soybean: {
    id: "soybean",
    name: "大豆",
    color: "#438f45",
    accentColor: "#78c96d",
    pattern: "bushy-round-leaves",
    description: "矮株、圆叶、丛生分布"
  },
  rice: {
    id: "rice",
    name: "水稻",
    color: "#4e9d55",
    accentColor: "#8fd08f",
    pattern: "paddy-rice",
    waterRequired: true,
    description: "水田浅水、细长稻苗"
  },
  wheat: {
    id: "wheat",
    name: "小麦",
    color: "#c99a35",
    accentColor: "#f0cf62",
    pattern: "dense-wheat",
    description: "密集细秆、偏金黄色麦田"
  },
  cotton: {
    id: "cotton",
    name: "棉花",
    color: "#4c8d4d",
    accentColor: "#ffffff",
    pattern: "cotton-bolls",
    description: "低矮棉株、白色棉桃"
  },
  potato: {
    id: "potato",
    name: "马铃薯",
    color: "#4f8741",
    accentColor: "#78b65a",
    pattern: "ridge-low-bush",
    description: "垄作田畦、低矮叶丛"
  },
  rapeseed: {
    id: "rapeseed",
    name: "油菜",
    color: "#529a3d",
    accentColor: "#f4d13d",
    pattern: "yellow-flowers",
    description: "绿色植株、黄色花田"
  },
  tea: {
    id: "tea",
    name: "茶叶",
    color: "#2f7746",
    accentColor: "#55ad6b",
    pattern: "tea-rows",
    description: "低矮茶树、条带状茶园"
  }
};

export const defaultCropVisual = cropVisuals.corn;
