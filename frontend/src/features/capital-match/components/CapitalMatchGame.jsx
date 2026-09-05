import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Confetti from '../../guess-game/components/Confetti';
import CountryDragCard from './CountryDragCard';
import CapitalDropTarget from './CapitalDropTarget';
import { checkCapitalMatch } from '../capitalMatchApi';
import { KIKO } from '../../guess-game/clueOptions';
import { useGame } from '../../../shared/state/GameContext';
import { setTopicScore as postTopicScore } from '../../dashboard/dashboardApi';

// One board with all 10 ASEAN countries (Indonesia included) — country atoms
// and capitals must match backend/prolog/facts.pl.
const ALL_PAIRS = [
  { country: 'vietnam', capital: 'hanoi' },
  { country: 'thailand', capital: 'bangkok' },
  { country: 'laos', capital: 'vientiane' },
  { country: 'indonesia', capital: 'jakarta' },
  { country: 'myanmar', capital: 'naypyidaw' },
  { country: 'cambodia', capital: 'phnom_penh' },
  { country: 'brunei', capital: 'bandar_seri_begawan' },
  { country: 'malaysia', capital: 'kuala_lumpur' },
  { country: 'singapore', capital: 'singapore_city' },
  { country: 'philippines', capital: 'manila' },
];

// Capitals are shuffled per round so the answer isn't the same row position
// every time — the pairing is still graded by the Prolog engine.
function shuffle(items) {
  return [...items].sort(() => Math.random() - 0.5);
}

function mascotLine(selectedCountry, matchedCount, allMatched, isChecking, feedback) {
  if (allMatched) return 'All 10 capitals matched — amazing job!';
  if (isChecking) return 'Let me check the map…';
  if (feedback && feedback.result === 'incorrect') return "Oops, that's not right — try another one!";
  if (selectedCountry) return `Now tap the capital of ${selectedCountry.replace(/_/g, ' ')}!`;
  if (matchedCount > 0) return 'Keep going — tap the next country!';
  return 'Tap a country, then tap its capital!';
}

function mascotPose(selectedCountry, allMatched, isChecking, feedback) {
  if (allMatched) return KIKO.cheer;
  if (isChecking || selectedCountry) return KIKO.thinking;
  if (feedback && feedback.result === 'incorrect') return KIKO.oops;
  return KIKO.hello;
}

function CapitalMatchGame() {
  // Capitals reshuffle every new game, so "Play again" gets a fresh layout.
  const [capitals, setCapitals] = useState(() => shuffle(ALL_PAIRS.map(({ capital }) => capital)));
  const [selectedCountry, setSelectedCountry] = useState(null);
  // country -> capital once a pair is matched correctly; wrong guesses are
  // never locked in, so the child can retry the same pair.
  const [matched, setMatched] = useState({});
  const [feedback, setFeedback] = useState(null);
  const [isChecking, setIsChecking] = useState(false);
  const [error, setError] = useState(null);
  // Round accuracy for Progress: backend set_score/2 overwrites rather than
  // averages, so track the ratio locally and report the running percentage.
  const [stats, setStats] = useState({ correct: 0, attempted: 0 });
  const { setTopicScore } = useGame();

  const matchedCount = Object.keys(matched).length;
  const allMatched = matchedCount === ALL_PAIRS.length;

  const selectCountry = (country) => {
    if (isChecking || allMatched || matched[country]) return;
    setSelectedCountry((current) => (current === country ? null : country));
    setFeedback(null);
  };

  const handleDrop = async (capital) => {
    if (!selectedCountry || isChecking || allMatched) return;
    setIsChecking(true);
    setError(null);
    try {
      // Correctness always comes from the backend's check_capital_match/3 —
      // the frontend never decides it itself.
      const response = await checkCapitalMatch(selectedCountry, capital);
      const country = selectedCountry;
      setFeedback({ country, capital, result: response.result, key: Date.now() });
      if (response.result === 'correct') {
        setMatched((current) => ({ ...current, [country]: capital }));
      }
      // Progress: report the running percentage after every drop
      // (see docs/progress-page-wiring-plan.md).
      const newStats = {
        correct: stats.correct + (response.result === 'correct' ? 1 : 0),
        attempted: stats.attempted + 1,
      };
      setStats(newStats);
      const percentage = Math.round((newStats.correct / newStats.attempted) * 100);
      setTopicScore('countries_and_capitals', percentage);
      postTopicScore('countries_and_capitals', percentage).catch(() => {});
      setSelectedCountry(null);
    } catch {
      setError('The Capital Match backend is not available right now.');
    } finally {
      setIsChecking(false);
    }
  };

  const resetGame = () => {
    setSelectedCountry(null);
    setMatched({});
    setFeedback(null);
    setError(null);
    setStats({ correct: 0, attempted: 0 });
    setCapitals(shuffle(ALL_PAIRS.map(({ capital }) => capital)));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 26, scale: 0.96 }}
      animate={{ opacity: 1, y: [26, -5, 0], scale: [0.96, 1.01, 1] }}
      transition={{ duration: 0.55, times: [0, 0.7, 1], ease: 'easeOut' }}
      className="relative flex flex-col gap-[26px] rounded-[28px] border-[5px] border-[#fb7185] bg-[#fffdf3] bg-[radial-gradient(circle,#e7c9a0_1.5px,transparent_1.5px)] p-7 shadow-[0_12px_0_#f0deba,0_22px_40px_rgba(120,53,15,0.12)] [background-position:-4px_-4px] [background-size:22px_22px]"
    >
      {/* Mascot — same speech-bubble pattern as the other two games. */}
      <div className="relative flex items-center gap-4 rounded-[22px] bg-[#fef3c7] px-[18px] py-4">
        <span aria-hidden="true" className="absolute -left-2 top-8 h-4 w-4 rotate-45 bg-[#fef3c7]" />
        <motion.div
          className="relative flex h-[64px] w-[64px] flex-none items-center justify-center rounded-full bg-white shadow-[0_3px_0_#e7c9a0]"
          animate={{ rotate: [-4, 4, -4], y: [0, -3, 0] }}
          transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
        >
          <AnimatePresence mode="wait">
            <motion.img
              key={mascotPose(selectedCountry, allMatched, isChecking, feedback)}
              src={mascotPose(selectedCountry, allMatched, isChecking, feedback)}
              alt="Kiko the parrot mascot"
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.25 }}
              className="h-14 w-14 object-contain"
            />
          </AnimatePresence>
        </motion.div>
        <p className="m-0 text-xl font-bold text-[#7c2d12]">
          {mascotLine(selectedCountry, matchedCount, allMatched, isChecking, feedback)}
        </p>
      </div>

      {/* Progress: one dot per pair, filled as they get matched. */}
      <div className="flex items-center justify-center gap-3">
        <span className="text-lg font-extrabold text-[#7c2d12]">
          {matchedCount} of {ALL_PAIRS.length} matched
        </span>
        <div className="flex gap-1.5">
          {ALL_PAIRS.map(({ country }) => (
            <span
              key={country}
              className={`h-3.5 w-5 rounded-full ${matched[country] ? 'bg-green-500' : 'bg-stone-200'}`}
            />
          ))}
        </div>
      </div>

      {/* Step 1: pick a country */}
      <div className="flex flex-col items-center gap-3">
        <h2 className="m-0 text-2xl font-extrabold text-[#7c2d12]">1. Tap a country</h2>
        <div className="flex flex-wrap justify-center gap-3">
          {ALL_PAIRS.map(({ country }) => (
            <CountryDragCard
              key={country}
              name={country}
              selected={selectedCountry === country}
              matched={Boolean(matched[country])}
              onSelect={() => selectCountry(country)}
            />
          ))}
        </div>
      </div>

      {/* Step 2: tap its capital */}
      <div className="flex flex-col items-center gap-3">
        <h2 className="m-0 text-2xl font-extrabold text-[#7c2d12]">2. Tap its capital</h2>
        <div className="flex flex-wrap justify-center gap-3">
          {capitals.map((capital) => (
            <CapitalDropTarget
              key={capital}
              name={capital}
              matched={Object.values(matched).includes(capital)}
              onDrop={() => handleDrop(capital)}
            />
          ))}
        </div>
      </div>

      {/* Round complete */}
      <AnimatePresence mode="wait">
        {allMatched && (
          <motion.div
            key="capital-done"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative flex flex-col items-center gap-2.5 overflow-hidden rounded-[24px] bg-[#fef3c7] px-5 py-7"
          >
            <Confetti burstKey={matchedCount} />
            <div className="text-5xl leading-none">🏆</div>
            <p className="m-0 text-2xl font-extrabold text-[#7c2d12]">
              All 10 capitals matched — amazing job!
            </p>
            <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={resetGame}
                className="min-h-[56px] rounded-full bg-sky-500 px-8 py-[15px] text-lg font-extrabold text-white shadow-[0_6px_0_#0369a1] transition-transform hover:-translate-y-1 active:translate-y-[3px] active:shadow-[0_2px_0_#0369a1]"
              >
                🎉 Play again
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Per-drop feedback */}
      <AnimatePresence mode="wait">
        {feedback && feedback.result === 'incorrect' && !allMatched && (
          <motion.div
            key={`capital-wrong-${feedback.key}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, x: [0, -9, 8, -6, 5, -2, 2, 0] }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-center gap-3 rounded-[22px] border-[3px] border-[#fecaca] bg-[#fef2f2] px-5 py-[18px]"
          >
            <span className="text-3xl leading-none" aria-hidden="true">🙈</span>
            <p className="m-0 text-lg font-bold capitalize text-red-600">
              {feedback.capital} is not the capital of {feedback.country.replace(/_/g, ' ')} — try again!
            </p>
          </motion.div>
        )}
        {feedback && feedback.result === 'correct' && !allMatched && (
          <motion.div
            key={`capital-correct-${feedback.key}`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center justify-center gap-3 rounded-[22px] border-[3px] border-[#bbf7d0] bg-[#f0fdf4] px-5 py-[18px]"
          >
            <span className="text-3xl leading-none" aria-hidden="true">✅</span>
            <p className="m-0 text-lg font-bold capitalize text-green-700">
              Yes — {feedback.capital} is the capital of {feedback.country.replace(/_/g, ' ')}!
            </p>
          </motion.div>
        )}
        {error && (
          <motion.div
            key="capital-error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, x: [0, -9, 8, -6, 5, -2, 2, 0] }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-center gap-3 rounded-[22px] border-[3px] border-[#fecaca] bg-[#fef2f2] px-5 py-[18px]"
          >
            <span className="text-3xl leading-none" aria-hidden="true">🙈</span>
            <p className="m-0 text-xl font-bold text-red-600">{error}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default CapitalMatchGame;
