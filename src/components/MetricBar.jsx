function formatDelta(delta) {
  if (delta > 0) return `+${delta}`;
  if (delta < 0) return `${delta}`;
  return "+0";
}

export default function MetricBar({ label, value, previousValue, reason }) {
  const hasDelta = typeof previousValue === "number";
  const delta = hasDelta ? value - previousValue : 0;
  const deltaClass = delta > 0 ? "positive" : delta < 0 ? "negative" : "neutral";
  const showReason = hasDelta && Array.isArray(reason) && reason.length > 0;

  return (
    <div className={showReason ? "metric-bar has-reason" : "metric-bar"}>
      <div className="metric-label">
        <span>{label}</span>
        <span className="metric-value-group">
          <strong>{value}</strong>
          {hasDelta && <em className={`metric-delta ${deltaClass}`}>{formatDelta(delta)}</em>}
        </span>
      </div>
      <div className="bar-track">
        <span style={{ width: `${value}%` }} />
      </div>
      {showReason && (
        <div className="metric-reason" role="tooltip">
          <strong>{label}变化原因</strong>
          <ul>
            {reason.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
