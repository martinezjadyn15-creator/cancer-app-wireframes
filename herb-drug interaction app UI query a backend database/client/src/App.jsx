import DisclaimerBanner from './components/DisclaimerBanner.jsx';
import QuickCheck from './components/QuickCheck.jsx';

export default function App() {
  return (
    <div className="app">
      <header>
        <h1 className="app-title">Curcumin-Drug Interaction Checker</h1>
      </header>
      <DisclaimerBanner />
      <QuickCheck />
    </div>
  );
}
