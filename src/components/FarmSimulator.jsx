import { useState } from "react";
import ActionPanel from "./ActionPanel.jsx";
import AIDiagnosis from "./AIDiagnosis.jsx";
import CropAreaEditor from "./CropAreaEditor.jsx";
import FarmCanvas from "./FarmCanvas.jsx";
import MetricBar from "./MetricBar.jsx";
import { crops, intensityOptions } from "../data/farmlandData.js";
import { buildDiagnosis, simulateNextYear } from "../utils/simulation.js";
import { validateMeasureSelection } from "../utils/measureSelectionRules.js";

const ENABLE_CROP_AREA_EDITOR = true;

export default function FarmSimulator({ region, farmState, setFarmState, onBack, onFinish }) {
  const [selection, setSelection] = useState({
    cropId: crops[0].id,
    intensityId: intensityOptions[1].id,
    measureIds: ["normal"]
  });
  const [selectionWarning, setSelectionWarning] = useState("");
  const [showCropAreaEditor, setShowCropAreaEditor] = useState(false);

  const diagnosis = buildDiagnosis(region, farmState, selection);
  const currentCrop = crops.find((crop) => crop.id === selection.cropId);

  function handleNextYear() {
    const validation = validateMeasureSelection(selection.measureIds);
    if (!validation.valid) {
      setSelectionWarning(validation.reason);
      return;
    }

    setSelectionWarning("");
    const nextState = simulateNextYear(region, farmState, selection);
    setFarmState(nextState);
    if (nextState.history.length >= 5) {
      onFinish();
    }
  }

  if (showCropAreaEditor) {
    return <CropAreaEditor region={region} onClose={() => setShowCropAreaEditor(false)} />;
  }

  return (
    <section className="simulator-page">
      <header className="sim-header">
        <div>
          <p className="eyebrow">第三步：动态经营模拟</p>
          <h1>{region.name} · 第 {farmState.year} 年经营</h1>
        </div>
        <div className="header-actions">
          {ENABLE_CROP_AREA_EDITOR && (
            <button className="ghost-button" onClick={() => setShowCropAreaEditor(true)}>编辑种植区域</button>
          )}
          <button className="ghost-button" onClick={onBack}>查看档案</button>
          <button className="ghost-button" onClick={onFinish}>结束经营</button>
        </div>
      </header>

      <div className="sim-grid">
        <aside className="side-panel">
          <h2>耕地档案</h2>
          <p className="compact-text">{region.soil} · {region.landType}</p>
          <p className="compact-text">{region.climate}</p>
          <div className="tag-row">
            {region.suitableCrops.map((crop) => <span className="tag good" key={crop}>{crop}</span>)}
          </div>

          <h2>当前指标</h2>
          <MetricBar label="粮食产量" value={farmState.yield} previousValue={farmState.previousMetrics?.yield} reason={farmState.metricReasons?.yield} />
          <MetricBar label="土壤肥力" value={farmState.fertility} previousValue={farmState.previousMetrics?.fertility} reason={farmState.metricReasons?.fertility} />
          <MetricBar label="土壤水分" value={farmState.water} previousValue={farmState.previousMetrics?.water} reason={farmState.metricReasons?.water} />
          <MetricBar label="生态健康" value={farmState.ecology} previousValue={farmState.previousMetrics?.ecology} reason={farmState.metricReasons?.ecology} />
          <MetricBar label="粮食安全贡献" value={farmState.foodSecurity} previousValue={farmState.previousMetrics?.foodSecurity} reason={farmState.metricReasons?.foodSecurity} />
          <div className="risk-box">
            <strong>当前风险</strong>
            <p>{farmState.riskLabels.join("、")}</p>
          </div>
        </aside>

        <section className="farm-stage">
          <div className="stage-toolbar">
            <span>当前作物：{currentCrop?.name}</span>
            <span>年度事件：{farmState.lastEvent.name}</span>
          </div>
          <FarmCanvas region={region} farmState={farmState} currentCrop={currentCrop} selectedMeasures={selection.measureIds} />
          <p className="feedback-line">{farmState.lastFeedback}</p>
        </section>

        <AIDiagnosis region={region} tips={diagnosis} farmState={farmState} />
      </div>

      <ActionPanel
        region={region}
        selection={selection}
        setSelection={(updater) => {
          setSelectionWarning("");
          setSelection(updater);
        }}
        onNextYear={handleNextYear}
        onFinish={onFinish}
        year={farmState.year}
        selectionWarning={selectionWarning}
      />
    </section>
  );
}
