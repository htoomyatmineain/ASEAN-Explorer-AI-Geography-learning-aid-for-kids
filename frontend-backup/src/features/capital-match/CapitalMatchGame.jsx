import React, { useState, useEffect, useContext } from 'react';
import { GameContext } from '../../state/GameContext';

const ALL_COUNTRIES = [
  'myanmar', 'thailand', 'laos', 'vietnam', 'cambodia',
  'malaysia', 'singapore', 'indonesia', 'philippines', 'brunei'
];

const CAPITAL_MAP = {
  myanmar: 'naypyidaw',
  thailand: 'bangkok',
  laos: 'vientiane',
  vietnam: 'hanoi',
  cambodia: 'phnom penh',
  malaysia: 'kuala lumpur',
  singapore: 'singapore',
  indonesia: 'jakarta',
  philippines: 'manila',
  brunei: 'bandar seri begawan'
};

const CapitalMatchGame = () => {
  const { scores, setScores } = useContext(GameContext);
  const [countries, setCountries] = useState([]);
  const [capitals, setCapitals] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedCapital, setSelectedCapital] = useState(null);
  const [pairs, setPairs] = useState({});
  const [feedback, setFeedback] = useState('');
  const [roundDone, setRoundDone] = useState(false);

  const loadRound = () => {
    const shuffled = [...ALL_COUNTRIES].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, 4);
    setCountries(selected);
    const caps = selected.map(c => CAPITAL_MAP[c]);
    const shuffledCaps = caps.sort(() => Math.random() - 0.5);
    setCapitals(shuffledCaps);
    setPairs({});
    setSelectedCountry(null);
    setSelectedCapital(null);
    setFeedback('');
    setRoundDone(false);
  };

  useEffect(() => {
    loadRound();
    // eslint-disable-next-line
  }, []);

  const attemptMatch = (country, capital) => {
    const isCorrect = (CAPITAL_MAP[country] === capital);
    if (isCorrect) {
      setPairs(prev => ({ ...prev, [country]: capital }));
      setFeedback(`✅ Correct! ${country} ↔ ${capital}`);
      setScores(prev => ({
        ...prev,
        countries_and_capitals: (prev.countries_and_capitals || 0) + 10
      }));
      setSelectedCountry(null);
      setSelectedCapital(null);
      if (Object.keys(pairs).length + 1 === countries.length) {
        setRoundDone(true);
        setFeedback('🎉 All matched! Great job!');
      }
    } else {
      setFeedback(`❌ Wrong! ${country} does not have capital ${capital}.`);
      setSelectedCountry(null);
      setSelectedCapital(null);
    }
  };

  const handleCountryClick = (country) => {
    if (roundDone || pairs[country]) return;
    setSelectedCountry(country);
    if (selectedCapital) {
      attemptMatch(country, selectedCapital);
    }
  };

  const handleCapitalClick = (capital) => {
    if (roundDone) return;
    if (Object.values(pairs).includes(capital)) return;
    setSelectedCapital(capital);
    if (selectedCountry) {
      attemptMatch(selectedCountry, capital);
    }
  };

  const isCountryMatched = (country) => !!pairs[country];
  const isCapitalMatched = (capital) => Object.values(pairs).includes(capital);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-4">🏙️ Match the Capitals</h2>
      <div className="grid grid-cols-2 gap-8">
        <div>
          <h3 className="font-semibold text-gray-600 mb-2">Countries</h3>
          <div className="space-y-2">
            {countries.map(country => (
              <div
                key={country}
                onClick={() => handleCountryClick(country)}
                className={`px-4 py-3 rounded-lg border-2 cursor-pointer transition uppercase font-medium
                  ${isCountryMatched(country) 
                    ? 'border-green-500 bg-green-50 text-green-700' 
                    : selectedCountry === country 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-300 hover:border-blue-400'
                  }
                `}
              >
                {country}
                {isCountryMatched(country) && <span className="ml-2 text-green-500">✓</span>}
              </div>
            ))}
          </div>
        </div>
        <div>
          <h3 className="font-semibold text-gray-600 mb-2">Capitals</h3>
          <div className="space-y-2">
            {capitals.map(capital => (
              <div
                key={capital}
                onClick={() => handleCapitalClick(capital)}
                className={`px-4 py-3 rounded-lg border-2 cursor-pointer transition capitalize
                  ${isCapitalMatched(capital) 
                    ? 'border-green-500 bg-green-50 text-green-700' 
                    : selectedCapital === capital 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-300 hover:border-blue-400'
                  }
                `}
              >
                {capital}
                {isCapitalMatched(capital) && <span className="ml-2 text-green-500">✓</span>}
              </div>
            ))}
          </div>
        </div>
      </div>
      {feedback && (
        <div className="mt-6 p-4 bg-gray-50 rounded border">
          <p className="mb-2">{feedback}</p>
          {roundDone && (
            <button
              onClick={loadRound}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              Next Round →
            </button>
          )}
        </div>
      )}
      <div className="mt-3 text-sm text-gray-500">
        Score (capitals): {scores.countries_and_capitals || 0}
      </div>
    </div>
  );
};

export default CapitalMatchGame;