import React, { useState, useEffect, useContext } from 'react';
import { GameContext } from '../../state/GameContext';

// Import flag-icons CSS
import 'flag-icons/css/flag-icons.min.css';

// ALL 10 ASEAN countries
const ALL_COUNTRIES = [
  'myanmar', 'thailand', 'laos', 'vietnam', 'cambodia',
  'malaysia', 'singapore', 'indonesia', 'philippines', 'brunei'
];

// Country code mapping for flag-icons (ISO 3166-1 alpha-2)
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

const NeighborGame = () => {
  const { scores, setScores } = useContext(GameContext);
  const [target, setTarget] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [feedback, setFeedback] = useState('');
  const [correctAnswer, setCorrectAnswer] = useState(null);
  const [loading, setLoading] = useState(true);

  // Neighbour map (based on facts.pl)
  const neighbourMap = {
    myanmar: ['thailand', 'laos', 'china', 'india', 'bangladesh'],
    thailand: ['myanmar', 'laos', 'cambodia', 'malaysia'],
    laos: ['myanmar', 'thailand', 'cambodia', 'vietnam', 'china'],
    vietnam: ['laos', 'cambodia', 'china'],
    cambodia: ['thailand', 'laos', 'vietnam'],
    malaysia: ['thailand', 'indonesia', 'brunei'],
    singapore: [],
    indonesia: ['malaysia', 'philippines', 'brunei'],
    philippines: ['indonesia'],
    brunei: ['malaysia', 'indonesia']
  };

  const shuffle = (arr) => arr.sort(() => Math.random() - 0.5);

  const loadRound = () => {
    setLoading(true);
    setFeedback('');
    setCorrectAnswer(null);

    const randomTarget = ALL_COUNTRIES[Math.floor(Math.random() * ALL_COUNTRIES.length)];
    setTarget(randomTarget);

    // Get all other countries
    const others = ALL_COUNTRIES.filter(c => c !== randomTarget);
    const neighbors = neighbourMap[randomTarget] || [];

    // For the question "Which country IS a neighbour?" we want to show a mix.
    // We'll show 4 candidates: some neighbours and some non-neighbours.
    // We'll select up to 3 neighbours (or all if fewer) and fill with non-neighbours.
    const shuffledNeighbors = shuffle([...neighbors]);
    const selectedNeighbors = shuffledNeighbors.slice(0, Math.min(3, shuffledNeighbors.length));

    // Get non-neighbours from the list (excluding target)
    const nonNeighbors = others.filter(c => !neighbors.includes(c));
    const shuffledNon = shuffle([...nonNeighbors]);
    let needed = 4 - selectedNeighbors.length;
    if (needed < 0) needed = 0;
    const selectedNon = shuffledNon.slice(0, needed);

    // Combine and shuffle
    let candidateSet = [...selectedNeighbors, ...selectedNon];
    // Ensure we have exactly 4 (pad if needed)
    while (candidateSet.length < 4) {
      const extra = ALL_COUNTRIES.filter(c => c !== randomTarget && !candidateSet.includes(c));
      if (extra.length === 0) break;
      candidateSet.push(extra[Math.floor(Math.random() * extra.length)]);
    }
    setCandidates(shuffle(candidateSet));
    setLoading(false);
  };

  useEffect(() => {
    loadRound();
  }, []);

  const handleSelect = (selectedCountry) => {
    if (feedback) return;

    // Check if selected is a neighbour
    const isNeighbor = neighbourMap[target]?.includes(selectedCountry) || false;

    if (isNeighbor) {
      setFeedback(`✅ Correct! ${selectedCountry} is a neighbour of ${target}!`);
      setScores(prev => ({
        ...prev,
        neighboring_countries: (prev.neighboring_countries || 0) + 10
      }));
    } else {
      // Show the correct neighbours as feedback
      const correctNeighbors = candidates.filter(c => neighbourMap[target]?.includes(c));
      const correctAnswerText = correctNeighbors.length > 0
        ? correctNeighbors.join(', ')
        : 'none (this country has no neighbours)';
      setFeedback(`❌ Oops! The neighbour(s) of ${target} are: ${correctAnswerText}.`);
      setCorrectAnswer(correctNeighbors);
    }
  };

  if (loading) return <div className="text-center text-xl text-amber-200">Loading adventure...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-900 via-amber-800 to-stone-800 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-amber-200 drop-shadow-lg tracking-wider">
            🗺️ Who is My Neighbour?
          </h1>
          <p className="text-amber-300/80 mt-2 text-lg">Explore the borders of ASEAN!</p>
        </div>

        <div className="bg-amber-100/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border-4 border-amber-700/50">
          <div className="text-center mb-8">
            <p className="text-sm uppercase tracking-wider text-amber-800/70">Target Country</p>
            <div className="inline-block bg-amber-800/20 px-8 py-4 rounded-2xl mt-2 border-2 border-amber-700/30">
              <span className={`fi fi-${countryCodeMap[target]} text-6xl`}></span>
              <p className="text-3xl font-bold text-stone-800 capitalize mt-1">{target}</p>
            </div>
          </div>

          <p className="text-center text-lg text-stone-700 mb-6 font-medium">
            Which country <span className="text-green-600 font-bold">IS</span> a neighbour of {target}?
          </p>

          <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
            {candidates.map(country => {
              const isCorrectNeighbor = neighbourMap[target]?.includes(country) || false;
              return (
                <button
                  key={country}
                  onClick={() => handleSelect(country)}
                  disabled={!!feedback}
                  className={`
                    relative overflow-hidden group
                    px-4 py-4 rounded-2xl text-lg font-bold
                    transition-all duration-300 transform
                    ${feedback
                      ? (isCorrectNeighbor
                        ? 'bg-green-600 border-green-400 text-white scale-105 shadow-lg'
                        : 'bg-stone-300 border-stone-400 text-stone-500 opacity-60')
                      : 'bg-amber-700 hover:bg-amber-600 border-2 border-amber-500/50 text-amber-50 hover:scale-105 hover:shadow-xl'
                    }
                    capitalize
                    flex items-center justify-center gap-3
                  `}
                >
                  <span className={`fi fi-${countryCodeMap[country]} text-3xl`}></span>
                  {country}
                  {feedback && isCorrectNeighbor && (
                    <span className="absolute top-1 right-1 text-xl">⭐</span>
                  )}
                </button>
              );
            })}
          </div>

          {feedback && (
            <div className="mt-6 p-4 bg-amber-800/30 rounded-xl border border-amber-600/30 backdrop-blur-sm">
              <p className="text-amber-50 text-lg text-center">{feedback}</p>
              <button
                onClick={loadRound}
                className="mt-3 mx-auto block px-8 py-3 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl transition-all hover:scale-105 shadow-lg"
              >
                🚀 Next Adventure →
              </button>
            </div>
          )}

          <div className="mt-6 text-center text-amber-800/80 text-sm font-medium">
            🏆 Score: {scores.neighboring_countries || 0}
          </div>
        </div>

        <div className="text-center mt-6 text-amber-300/40 text-4xl">
          🧭 ✨ 🌍
        </div>
      </div>
    </div>
  );
};

export default NeighborGame;