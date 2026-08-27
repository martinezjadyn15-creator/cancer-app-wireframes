import { useState, useEffect, useRef } from 'react';
import { fetchDrugs } from '../api.js';
import { useInteraction } from '../hooks/useInteraction.js';
import { mockInteractionDegree } from '../utils/interactionDegree.js';
import { interactionConfidence } from '../utils/confidence.js';
import TrafficLight from './TrafficLight.jsx';
import SignalBar from './SignalBar.jsx';
import Gauge from './Gauge.jsx';

const MIN_QUERY_LENGTH = 1;

export default function QuickCheck() {
  const [drugOptions, setDrugOptions] = useState([]);
  const [drugQuery, setDrugQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const drugFieldRef = useRef(null);

  useEffect(() => {
    fetchDrugs().then(setDrugOptions);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    function handleClickOutside(e) {
      if (drugFieldRef.current && !drugFieldRef.current.contains(e.target)) setIsOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const trimmedQuery = drugQuery.trim();
  const suggestions = trimmedQuery.length >= MIN_QUERY_LENGTH
    ? drugOptions.filter((d) => d.toLowerCase().startsWith(trimmedQuery.toLowerCase()))
    : [];
  const confirmedDrug = drugOptions.find(
    (d) => d.toLowerCase() === trimmedQuery.toLowerCase()
  ) || '';
  const showSuggestions = isOpen && !confirmedDrug && suggestions.length > 0;
  const showNoMatchHint = !confirmedDrug && trimmedQuery.length >= MIN_QUERY_LENGTH && suggestions.length === 0;

  const { data, loading, error } = useInteraction(confirmedDrug);

  function handleDrugQueryChange(e) {
    const value = e.target.value;
    setDrugQuery(value);
    setIsOpen(value.trim().length >= MIN_QUERY_LENGTH);
  }

  function handleDrugFocus() {
    if (trimmedQuery.length >= MIN_QUERY_LENGTH) setIsOpen(true);
  }

  function handleSelectSuggestion(name) {
    setDrugQuery(name);
    setIsOpen(false);
  }

  function handleDrugKeyDown(e) {
    if (e.key === 'Escape') {
      setIsOpen(false);
    } else if (e.key === 'Enter' && suggestions.length === 1) {
      handleSelectSuggestion(suggestions[0]);
    }
  }

  return (
    <div className="quick-check">
      <h2>Quick Check</h2>
      <div className="quick-check-controls">
        <label className="drug-field" ref={drugFieldRef}>
          Drug
          <input
            type="text"
            value={drugQuery}
            onChange={handleDrugQueryChange}
            onFocus={handleDrugFocus}
            onBlur={() => setIsOpen(false)}
            onKeyDown={handleDrugKeyDown}
            placeholder="Type at least 1 letter…"
            autoComplete="off"
          />
          {showSuggestions && (
            <ul className="drug-suggestions">
              {suggestions.map((name) => (
                <li
                  key={name}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleSelectSuggestion(name);
                  }}
                >
                  {name}
                </li>
              ))}
            </ul>
          )}
          {showNoMatchHint && <p className="drug-no-match">No matching drug found.</p>}
        </label>
      </div>

      {loading && <p className="status-text">Checking…</p>}
      {!loading && error && !data && <p className="status-text error">{error}</p>}
      {!loading && data && (
        <div className="quick-check-result">
          <TrafficLight status={data.risk_level} />
          <SignalBar degree={mockInteractionDegree(data)} />
          <Gauge value={interactionConfidence(data)} />
          <p className="detail-mechanism">{data.mechanism_note}</p>
        </div>
      )}
    </div>
  );
}
