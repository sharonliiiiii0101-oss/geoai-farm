// 当前 path 为教学演示用近似范围，依据“中国主要地形区分布图”手工描绘。
// 后续可替换为真实 GIS/GeoJSON 边界。坐标与 china-landform-map.jpg 对齐，viewBox 为 1179 x 901。
export const landformMapViewBox = {
  width: 1179,
  height: 901
};

export const landFeatureLegend = [
  { key: "paddy", label: "水田为主", color: "#29B6F6", swatchClass: "legend-paddy" },
  { key: "dry", label: "旱地为主", color: "#F6A13A", swatchClass: "legend-dry" },
  { key: "irrigated", label: "水浇地 / 灌溉农业", color: "#26A69A", swatchClass: "legend-irrigated" },
  { key: "oasis", label: "绿洲农业", color: "#2FBF71", swatchClass: "legend-oasis" },
  { key: "terrace", label: "坡耕地 / 梯田", color: "#C68642", swatchClass: "legend-terrace" },
  { key: "mixed", label: "水田与旱地镶嵌", color: "url(#paddyDryPattern)", swatchClass: "legend-mixed" }
];

export const landformRegions = [
  {
    id: "songnen",
    name: "松嫩平原",
    subtitle: "东北平原北部",
    landFeature: "旱地为主",
    soil: "黑土",
    slope: "<2°",
    terrainType: "平原",
    farmlandType: "旱地为主，局部水田",
    color: "#F6A13A",
    strokeColor: "#B86B1D",
    fill: "#F6A13A",
    crops: ["玉米", "大豆", "水稻"],
    risks: ["黑土退化", "风蚀", "过度开发"],
    path:
      "M906 112 L952 92 L1008 101 L1056 132 L1092 184 L1083 244 L1047 296 L988 329 L929 318 L884 276 L861 217 L874 160 Z",
    label: { x: 1000, y: 196 }
  },
  {
    id: "huabei",
    name: "华北平原",
    subtitle: "黄淮海平原",
    landFeature: "旱地为主 / 灌溉农业",
    soil: "潮土、褐土",
    slope: "<3°",
    terrainType: "平原",
    farmlandType: "旱地为主，灌溉农业发达",
    color: "#F6A13A",
    strokeColor: "#B86B1D",
    fill: "#F6A13A",
    crops: ["小麦", "玉米", "棉花"],
    risks: ["干旱", "地下水超采", "盐渍化"],
    path:
      "M780 332 L826 301 L882 308 L932 344 L961 403 L946 470 L894 519 L827 527 L776 492 L748 434 L753 373 Z",
    label: { x: 866, y: 415 }
  },
  {
    id: "yangtze",
    name: "长江中下游平原",
    subtitle: "水田为主",
    landFeature: "水田为主",
    soil: "水稻土、冲积土",
    slope: "<2°",
    terrainType: "平原",
    farmlandType: "水田为主",
    color: "#29B6F6",
    strokeColor: "#0277BD",
    fill: "#29B6F6",
    crops: ["水稻", "油菜", "小麦"],
    risks: ["洪涝", "土地污染", "城市占用耕地"],
    paths: [
      "M765 522 L815 506 L862 520 L884 556 L864 594 L812 607 L765 586 L744 550 Z",
      "M838 572 L897 555 L950 570 L1006 602 L1057 631 L1040 669 L970 667 L904 642 L846 622 Z",
      "M984 534 L1041 529 L1085 560 L1102 606 L1062 628 L1016 607 L980 573 Z"
    ],
    label: { x: 966, y: 608 }
  },
  {
    id: "sichuan",
    name: "四川盆地",
    subtitle: "水田与旱地镶嵌",
    landFeature: "水田与旱地镶嵌",
    soil: "紫色土、水稻土",
    slope: "盆地平原<5°，丘陵区较大",
    terrainType: "盆地",
    farmlandType: "水田和旱地镶嵌，田块较细碎",
    color: "#29B6F6",
    strokeColor: "#8A5A1D",
    fill: "url(#paddyDryPattern)",
    crops: ["水稻", "小麦", "油菜"],
    risks: ["耕地破碎化", "水土流失", "建设占地"],
    path:
      "M622 535 L679 517 L739 528 L773 564 L765 610 L714 640 L646 635 L598 604 L586 563 Z",
    label: { x: 690, y: 575 }
  },
  {
    id: "loess",
    name: "黄土高原",
    subtitle: "坡耕地 / 梯田",
    landFeature: "坡耕地 / 梯田",
    soil: "黄土、黄绵土",
    slope: "8°-25°",
    terrainType: "高原",
    farmlandType: "旱地和坡耕地较多",
    color: "#C68642",
    strokeColor: "#8A5724",
    fill: "#C68642",
    crops: ["玉米", "马铃薯"],
    risks: ["水土流失", "土层变薄", "坡耕地退化"],
    path:
      "M604 282 L668 257 L735 274 L785 323 L783 386 L748 446 L688 468 L626 444 L583 386 L568 326 Z",
    label: { x: 690, y: 360 }
  },
  {
    id: "yungui",
    name: "云贵高原",
    subtitle: "坡耕地、梯田",
    landFeature: "坡耕地 / 梯田",
    soil: "红壤、石灰土",
    slope: "10°-30°",
    terrainType: "高原",
    farmlandType: "坡耕地、梯田和小块耕地并存",
    color: "#C68642",
    strokeColor: "#8A5724",
    fill: "url(#terracePattern)",
    crops: ["玉米", "马铃薯", "茶叶"],
    risks: ["石漠化", "水土流失", "耕地破碎"],
    path:
      "M583 626 L642 638 L701 680 L742 738 L718 801 L651 832 L574 807 L523 752 L525 686 Z",
    label: { x: 622, y: 724 }
  },
  {
    id: "southeast",
    name: "东南丘陵",
    subtitle: "丘陵水田 / 园地",
    landFeature: "丘陵水田 / 园地",
    soil: "红壤",
    slope: "6°-20°",
    terrainType: "丘陵",
    farmlandType: "丘陵水田、旱地和园地交错",
    color: "#29B6F6",
    strokeColor: "#0277BD",
    fill: "url(#paddyDryPattern)",
    crops: ["水稻", "茶叶"],
    risks: ["红壤酸化", "水土流失", "坡地开发"],
    paths: [
      "M872 640 L938 644 L1004 681 L1030 744 L1004 805 L938 830 L875 798 L842 734 Z",
      "M982 718 L1052 715 L1110 760 L1125 826 L1075 865 L1012 850 L972 790 Z",
      "M804 617 L852 630 L874 678 L845 718 L792 707 L768 662 Z"
    ],
    label: { x: 984, y: 752 }
  },
  {
    id: "xinjiang",
    name: "新疆绿洲农业区",
    subtitle: "绿洲农业",
    landFeature: "绿洲农业",
    soil: "灌淤土、荒漠土改良耕地",
    slope: "绿洲边缘平地为主",
    terrainType: "盆地边缘绿洲",
    farmlandType: "灌溉农业、绿洲农业",
    color: "#2FBF71",
    strokeColor: "#087A3D",
    fill: "url(#oasisPattern)",
    crops: ["棉花", "小麦", "瓜果"],
    risks: ["干旱", "盐渍化", "水资源不足"],
    paths: [
      "M166 300 L238 281 L329 291 L421 319 L402 340 L312 324 L224 318 L158 330 Z",
      "M190 370 L291 353 L396 365 L486 402 L461 424 L360 397 L260 389 L184 396 Z",
      "M216 493 L306 477 L410 488 L507 531 L480 553 L363 524 L252 517 Z",
      "M438 292 L506 284 L578 304 L561 327 L487 321 L430 310 Z"
    ],
    label: { x: 308, y: 374 }
  }
];
