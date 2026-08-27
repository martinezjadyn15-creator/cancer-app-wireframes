const SEGMENTS = 5;
const SEGMENT_COLORS = ['#3fd66b', '#8bd646', '#ffd23f', '#ff9a3f', '#ff4d4d'];

export default function SignalBar({ degree = 0 }) {
  const clamped = Math.max(0, Math.min(SEGMENTS, degree));

  return (
    <div className="signal-bar-wrap">
      <div
        className="signal-bar"
        role="meter"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={SEGMENTS}
        aria-label="Interaction degree"
      >
        {Array.from({ length: SEGMENTS }, (_, i) => (
          <span
            key={i}
            className="signal-segment"
            style={{
              height: `${14 + i * 7}px`,
              background: i < clamped ? SEGMENT_COLORS[i] : '#e2e2e2',
            }}
          />
        ))}
      </div>
      <p className="signal-bar-label">{clamped}/5</p>
      <p className="signal-bar-title">Degrees of Interaction</p>
    </div>
  );
}
