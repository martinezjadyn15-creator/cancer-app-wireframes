const ORDER = ['RED', 'YELLOW', 'GREEN', 'GRAY'];

const STATUS_TEXT = {
  RED: 'High risk — strongly contraindicated',
  YELLOW: 'Moderate risk — use with caution, monitor',
  GREEN: 'Minimal risk — generally safe',
  GRAY: 'Undetermined — insufficient data to classify',
};

export default function TrafficLight({ status }) {
  return (
    <div className="traffic-light-wrap">
      <div className="traffic-light">
        {ORDER.map((level) => (
          <span
            key={level}
            className={`light light-${level.toLowerCase()} ${status === level ? 'lit' : ''}`}
          />
        ))}
      </div>
      <p className="traffic-light-status">
        {status ? STATUS_TEXT[status] : 'No status'}
      </p>
    </div>
  );
}
