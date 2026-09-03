import React, { useState, useEffect, useContext } from 'react';
import { GameContext } from '../../state/GameContext';

// Hardcoded list of all ASEAN countries (matches facts.pl)
const ALL_COUNTRIES = [
  'myanmar', 'thailand', 'laos', 'vietnam', 'cambodia',
  'malaysia', 'singapore', 'indonesia', 'philippines', 'brunei'
];

const NeighborGame = () => {
  const { scores, setScores } = useContext(GameContext);
  const [target, setTarget] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [feedback, setFeedback] = useState('');
  const [correctAnswer, setCorrectAnswer] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mock neighbour map (same as facts.pl)
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

    const neighbors = neighbourMap[randomTarget] || [];
    const nonNeighbors = ALL_COUNTRIES.filter(c => c !== randomTarget && !neighbors.includes(c));

    const shuffledNeighbors = shuffle([...neighbors]);
    const selectedNeighbors = shuffledNeighbors.slice(0, Math.min(3, shuffledNeighbors.length));

    const shuffledNon = shuffle([...nonNeighbors]);
    let selectedNon = [];
    if (selectedNeighbors.length < 4) {
      const needed = 4 - selectedNeighbors.length;
      selectedNon = shuffledNon.slice(0, needed);
    } else {
      selectedNon = shuffledNon.slice(0, 1);
    }

    let candidateSet = [...selectedNeighbors, ...selectedNon];
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
    // eslint-disable-next-line
  }, []);

  const handleSelect = (selectedCountry) => {
    if (feedback) return;

    const nonNeighbors = candidates.filter(c => !neighbourMap[target]?.includes(c));
    const correct = nonNeighbors.length === 1 ? nonNeighbors[0] : null;

    if (selectedCountry === correct) {
      setFeedback('✅ Correct! Well done.');
      setScores(prev => ({
        ...prev,
        neighboring_countries: (prev.neighboring_countries || 0) + 10
      }));
    } else {
      setFeedback(`❌ Oops! The correct answer was "${correct}".`);
      setCorrectAnswer(correct);
    }
  };

  if (loading) return <div className="p-4 text-center">Loading neighbour challenge...</div>;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-4">🤝 Who is My Neighbour?</h2>
      <p className="text-lg mb-2">
        <span className="font-semibold">Target country:</span>{' '}
        <span className="uppercase bg-blue-100 px-3 py-1 rounded">{target}</span>
      </p>
      <p className="mb-4 text-gray-700">
        Which of these countries is <strong>NOT</strong> a neighbour of {target}?
      </p>
      <div className="grid grid-cols-2 gap-3">
        {candidates.map(country => (
          <button
            key={country}
            onClick={() => handleSelect(country)}
            disabled={!!feedback}
            className={`px-4 py-3 rounded-lg border-2 transition-all uppercase font-medium
              ${feedback
                ? (country === correctAnswer ? 'border-green-500 bg-green-100' : 'border-gray-300 bg-gray-100')
                : 'border-blue-300 hover:bg-blue-50 hover:border-blue-500'
              }
              ${feedback && country === correctAnswer ? 'ring-2 ring-green-400' : ''}
            `}
          >
            {country}
          </button>
        ))}
      </div>
      {feedback && (
        <div className="mt-4 p-3 bg-gray-50 rounded border">
          <p className="mb-2">{feedback}</p>
          <button
            onClick={loadRound}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Next Round →
          </button>
        </div>
      )}
      <div className="mt-3 text-sm text-gray-500">
        Score (neighbouring): {scores.neighboring_countries || 0}
      </div>
    </div>
  );
};

export default NeighborGame;