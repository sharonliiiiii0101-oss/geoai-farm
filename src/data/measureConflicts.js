export const measureConflictGroups = [
  {
    id: "irrigation",
    name: "灌溉方式",
    measures: ["合理灌溉", "过量灌溉", "节水灌溉"],
    reason: "同一年只能选择一种灌溉方式，不能同时合理灌溉、过量灌溉或节水灌溉。"
  },
  {
    id: "fertilization",
    name: "施肥方式",
    measures: ["合理施肥", "过量施肥"],
    reason: "合理施肥和过量施肥代表相反的施肥方式，不能同时选择。"
  },
  {
    id: "land_use_state",
    name: "土地利用状态",
    measures: ["正常耕作", "轮作休耕", "退耕还林还草"],
    reason: "正常耕作、轮作休耕和退耕还林还草代表不同土地利用状态，不能同一年同时选择。"
  },
  {
    id: "slope_governance",
    name: "坡地治理方式",
    measures: ["修筑梯田", "退耕还林还草"],
    reason: "修筑梯田表示继续农业利用，退耕还林还草表示退出农业利用，二者方向不同。"
  },
  {
    id: "crop_or_fallow",
    name: "作物适应与休耕",
    measures: ["耐旱作物", "轮作休耕"],
    reason: "耐旱作物表示本年度继续种植，轮作休耕表示减少或暂停种植，二者不应同时选择。"
  },
  {
    id: "farmland_construction_or_retreat",
    name: "农田建设与生态退耕",
    measures: ["建设高标准农田", "退耕还林还草"],
    reason: "建设高标准农田和退耕还林还草的土地利用方向相反，不能同时选择。"
  }
];
