export default function AIDiagnosis({ region, tips, farmState }) {
  return (
    <aside className="ai-panel">
      <div className="ai-avatar">AI</div>
      <h2>AI土地诊断员</h2>
      <p className="compact-text">结合当前指标、年度事件和{region.name}区域特征生成课堂提示。</p>
      <div className="event-card">
        <strong>{farmState.lastEvent.name}</strong>
        <span>{farmState.lastEvent.description}</span>
      </div>
      <ul className="diagnosis-list">
        {tips.map((tip) => (
          <li key={tip}>{tip}</li>
        ))}
      </ul>
    </aside>
  );
}
