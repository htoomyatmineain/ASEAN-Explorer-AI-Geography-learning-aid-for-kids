import React, { useState, useEffect, useContext } from 'react';
import { GameContext } from '../../state/GameContext';

import 'flag-icons/css/flag-icons.min.css';

const ALL_COUNTRIES = [
  'myanmar', 'thailand', 'laos', 'vietnam', 'cambodia',
  'malaysia', 'singapore', 'indonesia', 'philippines', 'brunei'
];

const countryCodeMap = {
  myanmar: 'mm',
  thailand: 'th',
  laos: 'la',
  vietnam: 'vn',
  cambodia: 'kh',
  malaysia: 'my',
  singapore: 'sg',
  indonesia: 'id',
  philippines: 'ph',
  brunei: 'bn'
};

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
  const [showAll, setShowAll] = useState(true);

  const loadRound = () => {
    let selected;
    if (showAll) {
      selected = [...ALL_COUNTRIES];
    } else {
      const shuffled = [...ALL_COUNTRIES].sort(() => Math.random() - 0.5);
      selected = shuffled.slice(0, 4);
    }
    
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
  }, [showAll]);

  const attemptMatch = (country, capital) => {
    const isCorrect = (CAPITAL_MAP[country] === capital);
    if (isCorrect) {
      setPairs(prev => ({ ...prev, [country]: capital }));
      setFeedback(`✅ Perfect! ${country} → ${capital}`);
      setScores(prev => ({
        ...prev,
        countries_and_capitals: (prev.countries_and_capitals || 0) + 10
      }));
      setSelectedCountry(null);
      setSelectedCapital(null);
      if (Object.keys(pairs).length + 1 === countries.length) {
        setRoundDone(true);
        setFeedback('🎉 All matched! You\'re a true explorer!');
      }
    } else {
      setFeedback(`❌ Not quite! ${country} does not have capital ${capital}.`);
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

  const toggleMode = () => {
    setShowAll(!showAll);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-900 via-amber-800 to-stone-800 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-5xl font-bold text-amber-200 drop-shadow-lg tracking-wider">
            🏙️ Match the Capitals
          </h1>
          <p className="text-amber-300/80 mt-2 text-lg">
            {showAll ? 'All 10 ASEAN countries' : '4 random countries per round'}
          </p>
          <button
            onClick={toggleMode}
            className="mt-2 px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl transition-all hover:scale-105 shadow-lg text-sm"
          >
            {showAll ? 'Switch to 4 per round' : 'Switch to all 10'}
          </button>
        </div>

        <div className="bg-amber-100/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border-4 border-amber-700/50">
          {/* Side-by-side layout: flex row */}
          <div className="flex flex-col md:flex-row gap-8">
            {/* Left: Countries */}
            <div className="flex-1">
              <h3 className="text-lg font-bold text-amber-800 mb-4 text-center uppercase tracking-wider">
                🌍 Countries ({countries.length})
              </h3>
              <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2">
                {countries.map(country => {
                  const isMatched = isCountryMatched(country);
                  const isSelected = selectedCountry === country;
                  return (
                    <div
                      key={country}
                      onClick={() => handleCountryClick(country)}
                      className={`
                        px-4 py-3 rounded-2xl text-lg font-bold capitalize
                        transition-all duration-200 transform cursor-pointer
                        hover:scale-105 hover:shadow-xl
                        ${isMatched
                          ? 'bg-green-600 border-green-400 text-white shadow-lg'
                          : isSelected
                            ? 'bg-amber-500 border-amber-300 text-white scale-105 shadow-xl ring-4 ring-amber-300/70'
                            : 'bg-amber-700 hover:bg-amber-600 border-2 border-amber-500/50 text-amber-50 hover:border-amber-300'
                        }
                        flex items-center gap-3
                      `}
                    >
                      <span className={`fi fi-${countryCodeMap[country]} text-3xl`}></span>
                      <span>{country}</span>
                      {isMatched && (
                        <span className="ml-auto text-2xl">✅</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right: Capitals */}
            <div className="flex-1">
              <h3 className="text-lg font-bold text-amber-800 mb-4 text-center uppercase tracking-wider">
                🏛️ Capitals ({capitals.length})
              </h3>
              <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2">
                {capitals.map(capital => {
                  const isMatched = isCapitalMatched(capital);
                  const isSelected = selectedCapital === capital;
                  return (
                    <div
                      key={capital}
                      onClick={() => handleCapitalClick(capital)}
                      className={`
                        px-4 py-3 rounded-2xl text-lg font-medium capitalize
                        transition-all duration-200 transform cursor-pointer
                        hover:scale-105 hover:shadow-xl
                        ${isMatched
                          ? 'bg-green-600 border-green-400 text-white shadow-lg'
                          : isSelected
                            ? 'bg-amber-500 border-amber-300 text-white scale-105 shadow-xl ring-4 ring-amber-300/70'
                            : 'bg-stone-600 hover:bg-stone-500 border-2 border-stone-400/50 text-amber-50 hover:border-amber-300'
                        }
                        flex items-center gap-3
                      `}
                    >
                      <span>{capital}</span>
                      {isMatched && (
                        <span className="ml-auto text-2xl">✅</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {feedback && (
            <div className="mt-6 p-4 bg-amber-800/30 rounded-xl border border-amber-600/30 backdrop-blur-sm">
              <p className="text-amber-50 text-lg text-center">{feedback}</p>
              {roundDone && (
                <button
                  onClick={loadRound}
                  className="mt-3 mx-auto block px-8 py-3 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl transition-all hover:scale-105 shadow-lg"
                >
                  🚀 Next Round →
                </button>
              )}
            </div>
          )}

          <div className="mt-6 text-center text-amber-800/80 text-sm font-medium">
            🏆 Score: {scores.countries_and_capitals || 0}
          </div>
        </div>

        <div className="text-center mt-6 text-amber-300/40 text-4xl">
          🏰 🌊 ⛵
        </div>
      </div>
    </div>
  );
};

export default CapitalMatchGame;