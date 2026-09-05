import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import NeighborMapHighlight from './NeighborMapHighlight';
import { checkNeighbors } from '../neighborGameApi';
import { KIKO } from '../../guess-game/clueOptions';

// Matches the KB doc §5.3 worked example — includes vietnam, a genuine
// non-neighbor of myanmar, so the round always has a valid "odd one out".
const COUNTRY = 'myanmar';
const CANDIDATES = ['china', 'india', 'bangladesh', 'thailand', 'laos', 'vietnam'];

function mascotLine(status, pick, correct) {
  if (status === 'checking') return 'Let me check the map…';
  if (status === 'done' && correct) return 'You found it! Great spotting!';
  if (status === 'done') return 'Good try! The green ones are real neighbors.';
  if (pick) return 'Locked in — press "Check my answer" when ready!';
  return `Tap the country you think does NOT touch ${COUNTRY}!`;
}

function mascotPose(status, pick, correct) {
  if (status === 'done' && correct) return KIKO.cheer;
  if (status === 'done') return KIKO.oops;
  if (status === 'checking' || pick) return KIKO.thinking;
  return KIKO.hello;
}

function NeighborGame() {
  const [pick, setPick] = useState(null);
  const [status, setStatus] = useState('idle'); // idle | checking | done
  const [nonNeighbors, setNonNeighbors] = useState(null);
  const [error, setError] = useState(null);

  const pickCountry = (candidate) => {
    if (status !== 'idle') return;
    setPick(candidate);
  };

  const handleCheck = async () => {
    if (!pick || status === 'checking') return;
    setStatus('checking');
    setError(null);
    try {
      // The answer key always comes from the backend's find_non_neighbors/3 —
      // we only compare the child's pick against it.
      const response = await checkNeighbors(COUNTRY, CANDIDATES);
      setNonNeighbors(response.non_neighbors);
      setStatus('done');
    } catch {
      setError('The Neighbor Quiz backend is not available right now.');
      setStatus('idle');
    }
  };

  const playAgain = () => {
    setPick(null);
    setNonNeighbors(null);
    setError(null);
    setStatus('idle');
  };

  const correct = status === 'done' && nonNeighbors?.includes(pick);

  return (
    <motion.div
      initial={{ opacity: 0, y: 26, scale: 0.96 }}
      animate={{ opacity: 1, y: [26, -5, 0], scale: [0.96, 1.01, 1] }}
      transition={{ duration: 0.55, times: [0, 0.7, 1], ease: 'easeOut' }}
      className="relative flex flex-col gap-[26px] rounded-[28px] border-[5px] border-[#fbbf24] bg-[#fffdf3] bg-[radial-gradient(circle,#e7c9a0_1.5px,transparent_1.5px)] p-7 shadow-[0_12px_0_#f0deba,0_22px_40px_rgba(120,53,15,0.12)] [background-position:-4px_-4px] [background-size:22px_22px]"
    >
      {/* Mascot — same speech-bubble pattern as GuessGame, so the two quizzes
          feel like part of the same family of games. */}
      <div className="relative flex items-center gap-4 rounded-[22px] bg-[#fef3c7] px-[18px] py-4">
        <span aria-hidden="true" className="absolute -left-2 top-8 h-4 w-4 rotate-45 bg-[#fef3c7]" />
        <motion.div
          className="relative flex h-[64px] w-[64px] flex-none items-center justify-center rounded-full bg-white shadow-[0_3px_0_#e7c9a0]"
          animate={{ rotate: [-4, 4, -4], y: [0, -3, 0] }}
          transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
        >
          <AnimatePresence mode="wait">
            <motion.img
              key={mascotPose(status, pick, correct)}
              src={mascotPose(status, pick, correct)}
              alt="Kiko the parrot mascot"
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.25 }}
              className="h-14 w-14 object-contain"
            />
          </AnimatePresence>
        </motion.div>
        <p className="m-0 text-xl font-bold text-[#7c2d12]">{mascotLine(status, pick, correct)}</p>
      </div>

      {/* The question */}
      <div className="flex flex-col items-center gap-2 text-center">
        <h2 className="m-0 text-3xl font-extrabold leading-tight text-[#7c2d12]">
          Which of these does <span className="capitalize text-sky-600">NOT</span> border{' '}
          <span className="capitalize text-sky-600">{COUNTRY}</span>?
        </h2>
        <p className="m-0 text-lg font-semibold text-[#a16207]">
          Tap the odd one out, then press the button!
        </p>
      </div>

      {/* Step 1: the candidates */}
      <NeighborMapHighlight
        candidates={CANDIDATES}
        pick={pick}
        nonNeighbors={nonNeighbors}
        status={status}
        onPick={pickCountry}
      />

      {/* Actions */}
      <div className="flex flex-wrap items-center justify-center gap-3.5">
        <button
          type="button"
          onClick={handleCheck}
          disabled={!pick || status === 'checking'}
          className={`flex min-h-[56px] items-center gap-3 rounded-full px-[34px] py-4 text-xl font-extrabold text-white transition-transform hover:-translate-y-1 active:translate-y-[3px] ${
            pick && status !== 'checking'
              ? 'bg-amber-500 shadow-[0_6px_0_#b45309] active:shadow-[0_2px_0_#b45309]'
              : 'cursor-not-allowed bg-stone-300 shadow-[0_6px_0_#a8a29e]'
          }`}
        >
          {status === 'checking' && (
            <span className="h-[22px] w-[22px] animate-spin rounded-full border-4 border-white/40 border-t-white" />
          )}
          {status === 'checking' ? 'Checking…' : '🧭 Check my answer'}
        </button>
        {status === 'done' && (
          <button
            type="button"
            onClick={playAgain}
            className="min-h-[56px] rounded-full bg-[#fef3c7] px-7 py-[15px] text-lg font-extrabold text-[#7c2d12] shadow-[0_6px_0_#e7c9a0] transition-transform hover:-translate-y-1 active:translate-y-[3px] active:shadow-[0_2px_0_#e7c9a0]"
          >
            🔄 Play again
          </button>
        )}
      </div>

      {/* Result */}
      <AnimatePresence mode="wait">
        {status === 'done' && correct && (
          <motion.div
            key="neighbor-correct"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center gap-2.5 rounded-[24px] bg-[#dcfce7] px-5 py-7 text-center"
          >
            <div className="text-5xl leading-none">🎉</div>
            <p className="m-0 text-2xl font-extrabold capitalize leading-tight text-green-700">
              You're right — {pick} doesn't border {COUNTRY}!
            </p>
          </motion.div>
        )}
        {status === 'done' && !correct && (
          <motion.div
            key="neighbor-wrong"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, x: [0, -9, 8, -6, 5, -2, 2, 0] }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center gap-2 rounded-[22px] border-[3px] border-[#fecaca] bg-[#fef2f2] px-5 py-[18px] text-center"
          >
            <p className="m-0 text-lg font-bold text-red-600">
              Not quite — {pick} does border {COUNTRY}. The{' '}
              <span className="text-green-600">green ones are its neighbors</span>; the{' '}
              <span className="text-red-500">red one is the odd one out</span>!
            </p>
          </motion.div>
        )}
        {error && (
          <motion.div
            key="neighbor-error"
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

export default NeighborGame;
