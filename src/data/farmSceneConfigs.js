const huabei = {
  backgroundKey: "huabei",
  sceneType: "plain-dry-irrigated",
  label: "平原旱地与灌溉农业",
  cropLayout: "plain_rows",
  cropZones: [
    { id: "main-field", left: 4, top: 54, width: 92, height: 38, rotation: 0 }
  ],
  riskHints: ["干旱", "盐渍化", "地下水超采"]
};

const songnen = {
  backgroundKey: "songnen",
  sceneType: "black-soil-plain",
  label: "黑土平原大田",
  cropLayout: "plain_rows",
  cropZones: [
    { id: "black-soil-field", left: 4, top: 54, width: 92, height: 38, rotation: 0 }
  ],
  riskHints: ["黑土退化", "风蚀", "过度开发"]
};

const yangtze = {
  backgroundKey: "yangtze",
  sceneType: "paddy-river-plain",
  label: "水田平原与河网",
  cropLayout: "paddy_grid",
  cropZones: [
    { id: "front-paddy", left: 6, top: 60, width: 88, height: 28, rotation: 0 },
    { id: "middle-paddy", left: 12, top: 50, width: 76, height: 12, rotation: 0 }
  ],
  riskHints: ["洪涝", "土地污染", "建设占用耕地"]
};

const loess = {
  backgroundKey: "loess",
  sceneType: "loess-slope-terrace",
  label: "黄土高原坡耕地",
  cropLayout: "terrace_bands",
  cropZones: [
    { id: "front-terrace", left: 8, top: 63, width: 84, height: 18, rotation: 0 },
    { id: "middle-terrace", left: 18, top: 52, width: 64, height: 10, rotation: 0 },
    { id: "upper-terrace", left: 24, top: 43, width: 52, height: 8, rotation: 0 }
  ],
  riskHints: ["水土流失", "土层变薄", "坡耕地退化"]
};

const yungui = {
  backgroundKey: "yungui",
  sceneType: "mountain-terrace-karst",
  label: "山地梯田与喀斯特",
  cropLayout: "terrace_patches",
  cropZones: [
    { id: "front-terrace", left: 8, top: 64, width: 84, height: 17, rotation: 0 },
    { id: "left-terrace", left: 7, top: 52, width: 36, height: 10, rotation: -4 },
    { id: "right-terrace", left: 56, top: 52, width: 36, height: 10, rotation: 4 }
  ],
  riskHints: ["石漠化", "水土流失", "耕地破碎"]
};

const xinjiang = {
  backgroundKey: "xinjiang",
  sceneType: "desert-oasis",
  label: "荒漠绿洲灌溉农业",
  cropLayout: "irrigated_rows",
  cropZones: [
    { id: "front-oasis-field", left: 6, top: 58, width: 88, height: 32, rotation: 0 }
  ],
  riskHints: ["干旱", "盐渍化", "水资源不足"]
};

const sichuan = {
  backgroundKey: "sichuan",
  sceneType: "basin-mosaic",
  label: "四川盆地小块田地",
  cropLayout: "patchwork_fields",
  cropZones: [
    { id: "front-patch", left: 8, top: 62, width: 84, height: 22, rotation: 0 },
    { id: "middle-patch", left: 14, top: 50, width: 72, height: 12, rotation: 0 }
  ],
  riskHints: ["耕地破碎化", "水土流失", "建设占地"]
};

const southeast = {
  backgroundKey: "sichuan",
  sceneType: "southeast-hills",
  label: "丘陵水田与园地",
  cropLayout: "terrace_patches",
  cropZones: [
    { id: "front-hill-field", left: 8, top: 62, width: 84, height: 20, rotation: -2 },
    { id: "upper-hill-field", left: 14, top: 50, width: 70, height: 11, rotation: 3 }
  ],
  riskHints: ["红壤酸化", "水土流失", "坡地开发"]
};

export const farmSceneConfigs = {
  huabei,
  songnen,
  yangtze,
  yangtze_plain: yangtze,
  loess,
  loess_plateau: loess,
  yungui,
  yungui_plateau: yungui,
  xinjiang,
  xinjiang_oasis: xinjiang,
  sichuan,
  sichuan_basin: sichuan,
  southeast
};

export const defaultFarmSceneConfig = huabei;
