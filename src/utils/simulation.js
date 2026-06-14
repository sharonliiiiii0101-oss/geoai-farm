import { climateEvents, crops, intensityOptions, measures } from "../data/farmlandData.js";
import { getCropAlternatives, getCropSuitabilityInfo } from "../data/cropSuitability.js";
import { getMeasureAdaptation, getRegionalMeasureEffect } from "../data/measureEffects.js";
import { getSelectionConstraintTips, validateMeasureSelection } from "./measureSelectionRules.js";

export function clamp(value, min = 0, max = 100) {
  return Math.max(min, Math.min(max, Math.round(value)));
}

function signed(value) {
  return value > 0 ? `+${value}` : `${value}`;
}

function describeEffect(value, positiveText, negativeText, zeroText = "基本没有直接影响") {
  if (value > 0) return `${positiveText}（${signed(value)}）`;
  if (value < 0) return `${negativeText}（${signed(value)}）`;
  return zeroText;
}

function reasonLine(label, detail, value) {
  return `${label}：${detail}（${signed(value)}）`;
}

function balanceReasonLines(totalDelta, items, remainderLabel) {
  const visibleItems = items.filter((item) => item.value !== 0);
  const subtotal = visibleItems.reduce((sum, item) => sum + item.value, 0);
  const remainder = totalDelta - subtotal;
  const balancedItems =
    remainder === 0
      ? visibleItems
      : [
          ...visibleItems,
          {
            label: remainderLabel,
            detail: remainder > 0 ? "抵消前面不利影响后的综合提升" : "受上下限、基础状态或综合权重影响后的修正",
            value: remainder
          }
        ];

  if (balancedItems.length === 0) {
    return [reasonLine("总体变化", "本年经营后与上一年基本持平", 0)];
  }

  return balancedItems.map((item) => reasonLine(item.label, item.detail, item.value));
}

function getSlopeNumber(region) {
  const match = region.slope.match(/\d+/);
  return match ? Number(match[0]) : 0;
}

function isFlatRegion(region) {
  return getSlopeNumber(region) <= 5;
}

function isSlopeRegion(region) {
  return getSlopeNumber(region) >= 6;
}

export function createInitialFarmState(region) {
  return {
    year: 1,
    yield: Math.round(region.initial.yieldPotential * 0.72),
    fertility: region.initial.fertility,
    water: region.initial.water,
    ecology: region.initial.ecology,
    foodSecurity: clamp(
      region.initial.yieldPotential * 0.5 + region.initial.fertility * 0.25 + region.initial.ecology * 0.25
    ),
    previousMetrics: null,
    metricReasons: null,
    riskLabels: region.risks.slice(0, 2),
    activeVisuals: isSlopeRegion(region) ? ["slope"] : [],
    persistentVisuals: [],
    lastFeedback: "请选择作物、开发强度和经营措施，完成第一年的耕地经营。",
    lastEvent: climateEvents.normal,
    history: []
  };
}

function pickWeightedEvent(region) {
  const entries = Object.entries(region.eventWeights).filter(([, weight]) => weight > 0);
  const total = entries.reduce((sum, [, weight]) => sum + weight, 0);
  let random = Math.random() * total;

  for (const [eventId, weight] of entries) {
    random -= weight;
    if (random <= 0) return climateEvents[eventId] ?? climateEvents.normal;
  }

  return climateEvents.normal;
}

function sumMeasureEffects(region, selectedMeasureIds) {
  return selectedMeasureIds.reduce(
    (total, measureId) => {
      const measure = measures.find((item) => item.id === measureId);
      if (!measure) return total;
      const regional = getRegionalMeasureEffect(region.id, measureId);
      total.yield += regional.effects.yield ?? 0;
      total.fertility += regional.effects.fertility ?? 0;
      total.water += regional.effects.water ?? 0;
      total.ecology += regional.effects.ecology ?? 0;
      total.safety += regional.effects.safety ?? 0;
      total.details.push({
        id: measureId,
        name: measure.name,
        category: regional.category,
        effects: regional.effects,
        note: regional.note,
        risks: regional.risks
      });
      Object.entries(regional.risks ?? {}).forEach(([risk, value]) => {
        total.risks[risk] = (total.risks[risk] ?? 0) + value;
      });
      return total;
    },
    { yield: 0, fertility: 0, water: 0, ecology: 0, safety: 0, details: [], risks: {} }
  );
}

function hasMeasure(selectedMeasureIds, measureName) {
  return selectedMeasureIds.some((id) => measures.find((measure) => measure.id === id)?.name === measureName);
}

function getCropSuitability(region, crop) {
  return getCropSuitabilityInfo(region.id, crop.name).effects.yield;
}

function getMeasureFit(region, selectedMeasureIds) {
  return selectedMeasureIds.reduce((score, id) => {
    const measure = measures.find((item) => item.id === id);
    if (!measure) return score;
    return region.suitableMeasures.includes(measure.name) ? score + 4 : score;
  }, 0);
}

function getMismatchPenalty(region, selectedMeasureIds) {
  let penalty = 0;
  const flatRegion = isFlatRegion(region);
  if (flatRegion && hasMeasure(selectedMeasureIds, "修筑梯田")) penalty -= 5;
  if ((region.id === "huabei" || region.id === "xinjiang") && hasMeasure(selectedMeasureIds, "过量灌溉")) {
    penalty -= 8;
  }
  if ((region.id === "loess" || region.id === "yungui" || region.id === "southeast") && selectedMeasureIds.length === 1 && hasMeasure(selectedMeasureIds, "正常耕作")) {
    penalty -= 5;
  }
  return penalty;
}

function buildVisuals(region, nextState, selectedMeasureIds, event) {
  const visuals = new Set(nextState.persistentVisuals);
  if (nextState.fertility < 55) visuals.add("low-fertility");
  if (nextState.water < 40 || event.id === "drought") visuals.add("drought");
  if (nextState.water > 85 || event.id === "flood") visuals.add("flood");
  if (event.id === "salinization" || nextState.riskLabels.includes("盐渍化")) visuals.add("salinization");
  if (event.id === "stormErosion" || nextState.riskLabels.includes("水土流失")) visuals.add("erosion");
  if (hasMeasure(selectedMeasureIds, "轮作休耕") || hasMeasure(selectedMeasureIds, "退耕还林还草")) visuals.add("fallow");
  if (hasMeasure(selectedMeasureIds, "修筑梯田")) visuals.add("terrace");
  if (hasMeasure(selectedMeasureIds, "建设高标准农田")) visuals.add("high-standard");
  if (hasMeasure(selectedMeasureIds, "建设排水渠")) visuals.add("drainage");
  if (hasMeasure(selectedMeasureIds, "种植防护林")) visuals.add("shelterbelt");
  if (isSlopeRegion(region)) visuals.add("slope");
  return Array.from(visuals);
}

function buildRisks(region, state, selectedMeasureIds, event) {
  const risks = new Set();
  if (state.fertility < 60) risks.add("土壤肥力下降");
  if (state.water < 40) risks.add("干旱缺水");
  if (state.water > 88) risks.add("积水或洪涝");
  if (state.ecology < 55) risks.add("生态健康下降");
  if (event.id === "salinization" || hasMeasure(selectedMeasureIds, "过量灌溉")) risks.add("盐渍化");
  if (event.id === "blackSoilLoss") risks.add("黑土退化");
  if (event.id === "stormErosion") risks.add("水土流失");
  if (event.id === "urbanOccupation") risks.add("建设占用耕地");
  if (event.id === "windSand") risks.add("风蚀");
  if (risks.size === 0) risks.add("风险较低");
  return Array.from(risks);
}

export function simulateNextYear(region, previousState, selection) {
  const crop = crops.find((item) => item.id === selection.cropId) ?? crops[0];
  const intensity = intensityOptions.find((item) => item.id === selection.intensityId) ?? intensityOptions[1];
  const selectedMeasureIds = selection.measureIds.length ? selection.measureIds : ["normal"];
  const measureEffects = sumMeasureEffects(region, selectedMeasureIds);
  const event = pickWeightedEvent(region);
  const cropFit = getCropSuitabilityInfo(region.id, crop.name);
  const suitability = cropFit.effects.yield;
  const measureFit = 0;
  const mismatchPenalty = 0;

  const waterStress = previousState.water < crop.waterNeed - 10 ? -9 : previousState.water > crop.waterNeed + 28 ? -5 : 3;
  const fertilityStress = previousState.fertility < crop.fertilityNeed ? -7 : 4;
  const highIntensityPenalty = selection.intensityId === "high" && previousState.ecology < 55 ? -6 : 0;

  let fertility = previousState.fertility + cropFit.effects.fertility + intensity.effects.fertility + measureEffects.fertility + event.effects.fertility;
  let water = previousState.water + cropFit.effects.water + intensity.effects.water + measureEffects.water + event.effects.water;
  let ecology = previousState.ecology + cropFit.effects.ecology + intensity.effects.ecology + measureEffects.ecology + event.effects.ecology;

  fertility = clamp(fertility);
  water = clamp(water);
  ecology = clamp(ecology);

  const baseYield = region.initial.yieldPotential * 0.48;
  const yieldScore = clamp(
    baseYield +
      suitability +
      intensity.effects.yield +
      measureEffects.yield +
      event.effects.yield +
      waterStress +
      fertilityStress +
      measureFit +
      mismatchPenalty +
      highIntensityPenalty +
      fertility * 0.18 +
      ecology * 0.08
  );

  const nextState = {
    ...previousState,
    year: previousState.year + 1,
    yield: yieldScore,
    fertility,
    water,
    ecology,
    foodSecurity: clamp(yieldScore * 0.46 + fertility * 0.27 + ecology * 0.27 + measureEffects.safety + cropFit.effects.safety),
    previousMetrics: {
      yield: previousState.yield,
      fertility: previousState.fertility,
      water: previousState.water,
      ecology: previousState.ecology,
      foodSecurity: previousState.foodSecurity
    },
    lastEvent: event,
    persistentVisuals: Array.from(
      new Set([
        ...previousState.persistentVisuals,
        ...(hasMeasure(selectedMeasureIds, "修筑梯田") ? ["terrace"] : []),
        ...(hasMeasure(selectedMeasureIds, "建设高标准农田") ? ["high-standard"] : []),
        ...(hasMeasure(selectedMeasureIds, "建设排水渠") ? ["drainage"] : []),
        ...(hasMeasure(selectedMeasureIds, "种植防护林") ? ["shelterbelt"] : [])
      ])
    )
  };

  const cropRiskLabels = Object.entries(cropFit.effects.risks ?? {})
    .filter(([, value]) => value > 0)
    .map(([risk]) => risk);
  const risks = Array.from(new Set([...buildRisks(region, nextState, selectedMeasureIds, event), ...cropRiskLabels]))
    .filter((risk, _, allRisks) => !(risk === "风险较低" && allRisks.length > 1));
  const visuals = buildVisuals(region, { ...nextState, riskLabels: risks }, selectedMeasureIds, event);
  const measureNames = selectedMeasureIds.map((id) => measures.find((item) => item.id === id)?.name).filter(Boolean);
  const yieldDelta = yieldScore - previousState.yield;
  const fertilityDelta = fertility - previousState.fertility;
  const waterDelta = water - previousState.water;
  const ecologyDelta = ecology - previousState.ecology;
  const foodSecurityDelta = nextState.foodSecurity - previousState.foodSecurity;
  const metricReasons = {
    yield: balanceReasonLines(
      yieldDelta,
      [
        { label: "作物适宜性", detail: `${crop.name}在${region.name}属于“${cropFit.label}”作物：${cropFit.note}`, value: suitability },
        { label: "开发强度", detail: intensity.name, value: intensity.effects.yield },
        { label: "经营措施", detail: measureEffects.details.map((item) => `${item.name}${item.category === "suitable" ? "（推荐）" : item.category === "unsuitable" ? "（慎用）" : ""}`).join("、"), value: measureEffects.yield },
        { label: "区域措施适配", detail: region.suitableMeasures.some((name) => measureNames.includes(name)) ? "措施与区域问题较匹配" : "措施适配性一般", value: measureFit },
        { label: "措施不匹配惩罚", detail: "部分措施与地形或水资源条件不完全匹配", value: mismatchPenalty },
        { label: "年度事件", detail: event.name, value: event.effects.yield },
        { label: "水分状态", detail: "作物需水与当前水分匹配程度", value: waterStress },
        { label: "肥力状态", detail: "作物需肥与当前肥力匹配程度", value: fertilityStress },
        { label: "生态压力", detail: "生态健康偏低时高强度开发会压低产量", value: highIntensityPenalty }
      ],
      "基础产能与综合权重修正"
    ),
    fertility: balanceReasonLines(
      fertilityDelta,
      [
        { label: "作物适宜性", detail: `${crop.name}对本区地力条件的影响`, value: cropFit.effects.fertility },
        { label: "开发强度", detail: intensity.name, value: intensity.effects.fertility },
        { label: "经营措施", detail: measureEffects.details.map((item) => item.name).join("、"), value: measureEffects.fertility },
        { label: "年度事件", detail: event.name, value: event.effects.fertility },
      ],
      "肥力上下限修正"
    ),
    water: balanceReasonLines(
      waterDelta,
      [
        { label: "作物适宜性", detail: `${crop.name}对本区水分条件的影响`, value: cropFit.effects.water },
        { label: "开发强度", detail: intensity.name, value: intensity.effects.water },
        { label: "经营措施", detail: measureEffects.details.map((item) => item.name).join("、"), value: measureEffects.water },
        { label: "年度事件", detail: event.name, value: event.effects.water },
      ],
      "水分上下限修正"
    ),
    ecology: balanceReasonLines(
      ecologyDelta,
      [
        { label: "作物适宜性", detail: `${crop.name}对本区生态压力的影响`, value: cropFit.effects.ecology },
        { label: "开发强度", detail: intensity.name, value: intensity.effects.ecology },
        { label: "经营措施", detail: measureEffects.details.map((item) => item.name).join("、"), value: measureEffects.ecology },
        { label: "年度事件", detail: event.name, value: event.effects.ecology },
      ],
      "生态上下限修正"
    ),
    foodSecurity: balanceReasonLines(
      foodSecurityDelta,
      [
        { label: "产量贡献", detail: "粮食产量在综合分中权重较高", value: Math.round(yieldDelta * 0.46) },
        { label: "肥力贡献", detail: "土壤肥力代表长期生产基础", value: Math.round(fertilityDelta * 0.27) },
        { label: "生态贡献", detail: "生态健康影响耕地可持续利用", value: Math.round(ecologyDelta * 0.27) },
        { label: "作物适宜性贡献", detail: `${crop.name}在本区属于“${cropFit.label}”作物`, value: cropFit.effects.safety },
        { label: "措施适配贡献", detail: "适宜措施加分，不适宜措施扣分", value: measureEffects.safety }
      ],
      "综合分取整修正"
    )
  };

  const feedback = `第${previousState.year}年：你在${region.name}种植了${crop.name}，选择“${intensity.name}”和“${measureNames.join("、")}”。本年事件为“${event.name}”。产量${yieldScore >= previousState.yield ? "提升或保持" : "下降"}，主要风险为${risks.join("、")}。`;

  return {
    ...nextState,
    activeVisuals: visuals,
    riskLabels: risks,
    measureAdaptation: measureEffects.details,
    cropSuitability: cropFit,
    riskAdjustments: { ...measureEffects.risks, ...(cropFit.effects.risks ?? {}) },
    metricReasons,
    lastFeedback: feedback,
    history: [
      ...previousState.history,
      {
        year: previousState.year,
        crop: crop.name,
        intensity: intensity.name,
        measures: measureNames,
        event: event.name,
        yield: yieldScore,
        fertility,
        water,
        ecology,
        foodSecurity: nextState.foodSecurity,
        cropSuitability: cropFit.status,
        cropSuitabilityLabel: cropFit.label,
        cropSuitabilityNote: cropFit.note,
        cropAlternatives: cropFit.recommended,
        cropEffects: cropFit.effects,
        measureAdaptation: measureEffects.details,
        riskAdjustments: { ...measureEffects.risks, ...(cropFit.effects.risks ?? {}) },
        risks
      }
    ]
  };
}

export function buildDiagnosis(region, state, currentSelection) {
  const tips = [];
  const currentCrop = crops.find((crop) => crop.id === currentSelection.cropId);
  const currentCropFit = currentCrop ? getCropSuitabilityInfo(region.id, currentCrop.name) : null;

  if (currentCropFit?.status === "notRecommended") {
    tips.push(`当前选择的${currentCrop.name}在${region.name}属于“不推荐”作物。${currentCropFit.note} 建议优先选择${getCropAlternatives(region.id).join("、")}。如果继续种植，系统会降低产量、生态健康和粮食安全贡献。`);
  } else if (currentCropFit?.status === "recommended") {
    tips.push(`${currentCrop.name}是${region.name}的推荐作物。${currentCropFit.note} 选择适宜作物有利于提高产量和粮食安全贡献。`);
  } else if (currentCropFit) {
    tips.push(`${currentCrop.name}在${region.name}属于“可选”作物。${currentCropFit.note} 可以种植，但不是最优选择；可与推荐作物${getCropAlternatives(region.id).join("、")}进行比较。`);
  }

  const selectedMeasures = currentSelection.measureIds.map((id) => measures.find((measure) => measure.id === id)?.name);
  getSelectionConstraintTips(currentSelection.measureIds).slice(0, 2).forEach((tip) => {
    tips.push(`${tip} 请选择其他类型的经营措施进行组合。`);
  });
  const unsuitableMeasures = currentSelection.measureIds
    .map((id) => ({
      id,
      name: measures.find((measure) => measure.id === id)?.name,
      category: getMeasureAdaptation(region.id, id),
      note: getRegionalMeasureEffect(region.id, id).note
    }))
    .filter((item) => item.category === "unsuitable");

  unsuitableMeasures.forEach((item) => {
    tips.push(`该措施与当前区域不匹配：${item.name}。${item.note}`);
  });

  if (state.fertility < 60) {
    tips.push("你的耕地肥力正在下降，可能与高强度开发、连续种植或有机质补充不足有关。建议尝试轮作休耕、秸秆还田或保护性耕作。");
  }

  if (state.water < 40) {
    tips.push("当前土壤水分不足，作物可能减产。可以进行合理灌溉；若位于华北平原或新疆绿洲农业区，要优先考虑节水灌溉，避免地下水超采。");
  }

  if (state.water > 85) {
    tips.push("当前水分偏高，低洼田块可能积水。建设排水渠或选择水分适应性较强的作物，可以降低洪涝影响。");
  }

  if (state.ecology < 55) {
    tips.push("生态健康偏低，说明耕地承载压力较大。防护林、退耕还林还草、轮作休耕等措施能帮助恢复土地系统。");
  }

  if (selectedMeasures.includes("修筑梯田") && isFlatRegion(region)) {
    tips.push("该地区地势较平坦，修筑梯田的必要性较低。梯田更适合坡度较大的丘陵山区，用于减少水土流失。");
  }

  if (selectedMeasures.includes("修筑梯田") && (region.id === "loess" || region.id === "yungui" || region.id === "southeast")) {
    tips.push("修筑梯田可以减缓坡面径流，减少水土流失，提高坡耕地的保水保土能力，是坡耕地保护的重要措施。");
  }

  if (selectedMeasures.includes("过量灌溉") && (region.id === "huabei" || region.id === "xinjiang")) {
    tips.push("在水资源紧张或蒸发强的地区，过量灌溉会增加地下水超采和盐渍化风险。更推荐节水灌溉与排水配套。");
  }

  if (state.lastEvent.id === "blackSoilLoss") {
    tips.push("黑土退化提醒我们：高肥力耕地也需要保护。有机质补充、秸秆还田和轮作能延缓黑土层变薄。");
  }

  if (tips.length === 0) {
    tips.push("当前经营总体平稳。可以比较不同作物和措施组合，观察短期产量与长期地力保护之间的权衡。");
  }

  return tips;
}

export function evaluateFinalReport(region, farmState) {
  const history = farmState.history;
  const latest = history[history.length - 1] ?? farmState;
  const averageYield = history.length
    ? history.reduce((sum, record) => sum + record.yield, 0) / history.length
    : farmState.yield;
  const usedMeasures = Array.from(new Set(history.flatMap((record) => record.measures ?? [])));
  const majorRisks = Array.from(new Set(history.flatMap((record) => record.risks ?? []))).filter((risk) => risk !== "风险较低");
  const adaptationRecords = history.flatMap((record) => record.measureAdaptation ?? []);
  const suitableMeasures = adaptationRecords.filter((item) => item.category === "suitable");
  const unsuitableMeasures = adaptationRecords.filter((item) => item.category === "unsuitable");
  const matchedMeasures = Array.from(new Set(suitableMeasures.map((item) => item.name)));
  const penaltyMeasures = Array.from(new Set(unsuitableMeasures.map((item) => item.name)));
  const conflictRecords = history.filter((record) => !validateMeasureSelection(record.measures ?? []).valid);
  const cropRecords = history.map((record) => ({
    crop: record.crop,
    status: record.cropSuitability ?? "optional",
    label: record.cropSuitabilityLabel ?? "可选",
    note: record.cropSuitabilityNote ?? "",
    alternatives: record.cropAlternatives ?? getCropAlternatives(region.id),
    effects: record.cropEffects ?? {}
  }));
  const cropRecommendedCount = cropRecords.filter((record) => record.status === "recommended").length;
  const cropOptionalCount = cropRecords.filter((record) => record.status === "optional").length;
  const cropNotRecommendedCount = cropRecords.filter((record) => record.status === "notRecommended").length;
  const notRecommendedCrops = Array.from(new Set(cropRecords.filter((record) => record.status === "notRecommended").map((record) => record.crop)));
  const recommendedCropsUsed = Array.from(new Set(cropRecords.filter((record) => record.status === "recommended").map((record) => record.crop)));

  let grade = "稳定保护型";
  if (averageYield >= 78 && latest.fertility >= 70 && latest.ecology >= 70) grade = "可持续高产型";
  if (averageYield >= 72 && (latest.fertility < 58 || latest.ecology < 55)) grade = "短期高产但退化型";
  if (latest.ecology < 45 || latest.fertility < 45) grade = "生态风险较高型";
  if (averageYield < 38 || farmState.foodSecurity < 40) grade = "经营失败型";

  const narrative = `你选择了${region.name}进行经营。${
    averageYield >= 70 ? "整体粮食产出较好" : "粮食产出仍有提升空间"
  }，最终肥力为${latest.fertility}，生态健康为${latest.ecology}。${
    usedMeasures.length ? `经营中采取过${usedMeasures.join("、")}等措施。` : "经营措施较少。"
  }总体来看，你的经营方式属于“${grade}”。这说明保障粮食安全不仅要追求粮食产量，还要重视耕地质量保护。`;

  return {
    averageYield: Math.round(averageYield),
    usedMeasures,
    majorRisks,
    grade,
    adaptation: {
      suitableCount: suitableMeasures.length,
      unsuitableCount: unsuitableMeasures.length,
      matchedMeasures,
      penaltyMeasures,
      summary:
        unsuitableMeasures.length === 0
          ? `你在${region.name}的措施选择总体较符合区域条件，体现了因地制宜的经营思路。`
          : `你在${region.name}选择了${matchedMeasures.join("、") || "部分适宜措施"}等较匹配措施；但${penaltyMeasures.join("、")}与本区条件不完全匹配，造成一定扣分。`
    },
    cropSuitability: {
      recommendedCount: cropRecommendedCount,
      optionalCount: cropOptionalCount,
      notRecommendedCount: cropNotRecommendedCount,
      recommendedCropsUsed,
      notRecommendedCrops,
      summary:
        cropNotRecommendedCount === 0
          ? `你在${region.name}的作物选择总体较因地制宜，主要围绕${cropRecords[0]?.alternatives.join("、") || region.suitableCrops.join("、")}等适宜作物展开，有利于稳定产量和粮食安全贡献。`
          : `你在${region.name}选择过${notRecommendedCrops.join("、")}等不推荐作物。${cropRecords.find((record) => record.status === "notRecommended")?.note ?? ""} 这类选择会降低产量、生态健康和粮食安全贡献，建议优先选择${getCropAlternatives(region.id).join("、")}。`
    },
    combination: {
      conflictCount: conflictRecords.length,
      summary:
        conflictRecords.length === 0
          ? "本次经营过程中，系统已限制互斥措施的同时选择，保证经营决策更加符合实际农业生产逻辑。"
          : `经营记录中出现过${conflictRecords.length}次互斥措施组合，说明同一年度的灌溉、施肥或土地利用状态需要进一步区分。`
    },
    narrative
  };
}
