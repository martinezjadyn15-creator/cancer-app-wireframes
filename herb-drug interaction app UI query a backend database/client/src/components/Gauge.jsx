const SIZE = 200;
const CENTER = SIZE / 2;
const RADIUS = 90;
const NEEDLE_LENGTH = 70;

export default function Gauge({ value = 0 }) {
  const clamped = Math.max(0, Math.min(100, value));
  const angleDeg = 180 - (clamped / 100) * 180;
  const angleRad = (angleDeg * Math.PI) / 180;
  const needleX = CENTER + NEEDLE_LENGTH * Math.cos(angleRad);
  const needleY = CENTER - NEEDLE_LENGTH * Math.sin(angleRad);

  return (
    <div className="gauge-wrap">
      <svg viewBox={`0 0 ${SIZE} 110`} className="gauge" role="meter" aria-valuenow={clamped} aria-valuemin={0} aria-valuemax={100} aria-label="Confidence level">
        <defs>
          <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3fd66b" />
            <stop offset="50%" stopColor="#ffd23f" />
            <stop offset="100%" stopColor="#ff4d4d" />
          </linearGradient>
        </defs>
        <path
          d={`M10,${CENTER} A${RADIUS},${RADIUS} 0 0 1 ${SIZE - 10},${CENTER}`}
          fill="none"
          stroke="url(#gaugeGradient)"
          strokeWidth="16"
          strokeLinecap="round"
        />
        <line
          x1={CENTER}
          y1={CENTER}
          x2={needleX}
          y2={needleY}
          stroke="#2b2b2b"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <circle cx={CENTER} cy={CENTER} r="5" fill="#2b2b2b" />
      </svg>
      <p className="gauge-label">{clamped}% confidence</p>
    </div>
  );
}
