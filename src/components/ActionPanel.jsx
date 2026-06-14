import { crops, intensityOptions, measures } from "../data/farmlandData.js";
import { getCropSuitabilityInfo } from "../data/cropSuitability.js";
import { getMeasureAdaptation, getMeasureNote } from "../data/measureEffects.js";
import { canSelectMeasure, getSelectionConstraintTips } from "../utils/measureSelectionRules.js";

const maxMeasures = 3;

export default function ActionPanel({ region, selection, setSelection, onNextYear, onFinish, year, selectionWarning }) {
  const constraintTips = getSelectionConstraintTips(selection.measureIds).slice(0, 2);

  function toggleMeasure(measureId) {
    setSelection((current) => {
      const exists = current.measureIds.includes(measureId);
      if (exists) {
        return { ...current, measureIds: current.measureIds.filter((id) => id !== measureId) };
      }

      const selectionRule = canSelectMeasure(current.measureIds, measureId, maxMeasures);
      if (!selectionRule.canSelect) return current;

      return { ...current, measureIds: [...current.measureIds, measureId] };
    });
  }

  return (
    <section className="action-panel">
      <div className="action-group">
        <h2>A. 作物</h2>
        <div className="button-grid crop-grid">
          {crops.map((crop) => {
            const cropFit = getCropSuitabilityInfo(region.id, crop.name);
            const isActive = selection.cropId === crop.id;
            const badge =
              cropFit.status === "recommended"
                ? "推荐"
                : cropFit.status === "notRecommended"
                  ? "慎选"
                  : "";

            return (
              <button
                key={crop.id}
                className={[
                  "choice",
                  "crop-choice",
                  isActive ? "active" : "",
                  cropFit.status === "recommended" ? "recommended" : "",
                  cropFit.status === "notRecommended" ? "caution" : "",
                  `crop-fit-${cropFit.status}`
                ].join(" ")}
                onClick={() => setSelection((current) => ({ ...current, cropId: crop.id }))}
                title={`${cropFit.label}：${cropFit.note}`}
              >
                <span>{crop.name}</span>
                {badge && <em>{badge}</em>}
              </button>
            );
          })}
        </div>
      </div>

      <div className="action-group">
        <h2>B. 开发强度</h2>
        <div className="button-grid intensity-grid">
          {intensityOptions.map((option) => (
            <button
              key={option.id}
              className={selection.intensityId === option.id ? "choice active" : "choice"}
              onClick={() => setSelection((current) => ({ ...current, intensityId: option.id }))}
              title={option.description}
            >
              {option.name}
            </button>
          ))}
        </div>
      </div>

      <div className="action-group wide-actions">
        <div className="group-title-row">
          <h2>C. 经营措施</h2>
          <span>可同时选择最多 {maxMeasures} 项</span>
        </div>
        <div className="button-grid measure-grid">
          {measures.map((measure) => {
            const adaptation = getMeasureAdaptation(region.id, measure.id);
            const note = getMeasureNote(region.id, measure.id);
            const isActive = selection.measureIds.includes(measure.id);
            const selectionRule = canSelectMeasure(selection.measureIds, measure.id, maxMeasures);
            const isDisabled = selectionRule.disabled;
            const badge =
              selectionRule.type === "conflict"
                ? "冲突"
                : selectionRule.type === "limit"
                  ? "已达上限"
                  : adaptation === "suitable"
                    ? "推荐"
                    : adaptation === "unsuitable"
                      ? "慎用"
                      : "";
            const title =
              selectionRule.reason ||
              note ||
              (adaptation === "suitable" ? "适合该区域" : adaptation === "unsuitable" ? "该区域慎用" : measure.tags.join("、"));
            return (
              <button
                key={measure.id}
                className={[
                  "choice",
                  isActive ? "active" : "",
                  isDisabled ? "disabled" : "",
                  selectionRule.type === "conflict" ? "conflict-disabled" : "",
                  selectionRule.type === "limit" ? "limit-disabled" : "",
                  adaptation === "suitable" ? "recommended" : "",
                  adaptation === "unsuitable" ? "caution" : ""
                ].join(" ")}
                onClick={() => toggleMeasure(measure.id)}
                disabled={isDisabled}
                title={title}
              >
                <span>{measure.name}</span>
                {badge && <em>{badge}</em>}
              </button>
            );
          })}
        </div>
        {(selectionWarning || constraintTips.length > 0) && (
          <div className={selectionWarning ? "measure-conflict-hint warning" : "measure-conflict-hint"}>
            {selectionWarning && <p>{selectionWarning}</p>}
            {!selectionWarning && constraintTips.map((tip) => <p key={tip}>{tip}</p>)}
          </div>
        )}
      </div>

      <div className="simulation-controls">
        <button className="primary-button" onClick={onNextYear}>{year >= 5 ? "生成经营报告" : "进入下一年"}</button>
        <button className="ghost-button" onClick={onFinish}>结束经营</button>
      </div>
    </section>
  );
}
