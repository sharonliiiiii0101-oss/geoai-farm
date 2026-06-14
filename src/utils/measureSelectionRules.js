import { measures } from "../data/farmlandData.js";
import { measureConflictGroups } from "../data/measureConflicts.js";

const measureNameById = Object.fromEntries(measures.map((measure) => [measure.id, measure.name]));
const measureIdByName = Object.fromEntries(measures.map((measure) => [measure.name, measure.id]));

function toName(measureIdOrName) {
  return measureNameById[measureIdOrName] ?? measureIdOrName;
}

function toId(measureIdOrName) {
  return measureIdByName[measureIdOrName] ?? measureIdOrName;
}

export function getConflictGroups(measureNameOrId) {
  const name = toName(measureNameOrId);
  return measureConflictGroups.filter((group) => group.measures.includes(name));
}

export function getConflictGroup(measureNameOrId) {
  return getConflictGroups(measureNameOrId)[0] ?? null;
}

export function getConflictingMeasures(selectedMeasures, measureNameOrId) {
  const targetName = toName(measureNameOrId);
  const targetId = toId(measureNameOrId);
  const selectedNames = selectedMeasures.map(toName);
  const selectedIds = selectedMeasures.map(toId);

  if (selectedIds.includes(targetId)) {
    return { disabled: false, conflictWith: null, reason: "" };
  }

  for (const group of getConflictGroups(targetName)) {
    const conflictWith = selectedNames.find((name) => group.measures.includes(name));
    if (conflictWith) {
      return {
        disabled: true,
        conflictWith,
        group,
        reason: `已选择“${conflictWith}”，不能同时选择“${targetName}”。${group.reason}`
      };
    }
  }

  return { disabled: false, conflictWith: null, reason: "" };
}

export function canSelectMeasure(selectedMeasures, measureNameOrId, maxMeasures = 3) {
  const targetId = toId(measureNameOrId);
  const selectedIds = selectedMeasures.map(toId);
  if (selectedIds.includes(targetId)) {
    return { canSelect: true, disabled: false, reason: "", type: "selected" };
  }

  const conflict = getConflictingMeasures(selectedMeasures, targetId);
  if (conflict.disabled) {
    return { canSelect: false, disabled: true, reason: conflict.reason, type: "conflict", conflictWith: conflict.conflictWith };
  }

  if (selectedMeasures.length >= maxMeasures) {
    return {
      canSelect: false,
      disabled: true,
      reason: `本年度最多选择${maxMeasures}项经营措施。请先取消一个已选措施。`,
      type: "limit"
    };
  }

  return { canSelect: true, disabled: false, reason: "", type: "available" };
}

export function validateMeasureSelection(selectedMeasures) {
  const selectedNames = selectedMeasures.map(toName);
  if (selectedMeasures.length > 3) {
    return { valid: false, reason: "当前经营措施超过3项，请减少选择。" };
  }

  for (const group of measureConflictGroups) {
    const selectedInGroup = selectedNames.filter((name) => group.measures.includes(name));
    if (selectedInGroup.length > 1) {
      return {
        valid: false,
        reason: `当前经营措施存在冲突：“${selectedInGroup[0]}”和“${selectedInGroup[1]}”不能同时选择，请保留其中一项。`
      };
    }
  }

  return { valid: true, reason: "" };
}

export function getSelectionConstraintTips(selectedMeasures) {
  const selectedNames = selectedMeasures.map(toName);
  const tips = [];

  measureConflictGroups.forEach((group) => {
    const selectedInGroup = selectedNames.find((name) => group.measures.includes(name));
    if (!selectedInGroup) return;
    const blocked = group.measures.filter((name) => name !== selectedInGroup);
    tips.push(`你已选择“${selectedInGroup}”，因此本年度不能再选择“${blocked.join("”或“")}”。`);
  });

  return tips;
}
