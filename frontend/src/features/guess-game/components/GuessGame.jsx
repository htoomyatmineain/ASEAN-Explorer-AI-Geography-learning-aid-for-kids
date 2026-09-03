import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import ClueCard from './ClueCard';
import Confetti from './Confetti';
import { guessCountry } from '../guessGameApi';
import { FLAG_IMAGE_BY_COUNTRY, COUNTRY_CARD_IMAGE, KIKO } from '../clueOptions';
import { CHALLENGE_ROUNDS, GUESSABLE_COUNTRIES } from '../challengeRounds';

function mascotLine(guess, result, isChecking) {
  if (isChecking) return 'Let me check with the map…';
  if (result?.correct) return 'Ta-da! You got it! 🎉';
  if (result && !result.correct) return "Ooh, so close! Let's see the answer.";
  if (guess) return 'Locked it in — hit "Check my guess" when ready!';
  return 'Look at the clues, then pick the country you think it is!';
}

function mascotPose(guess, result, isChecking) {
  if (result?.correct) return KIKO.cheer;
  if (result && !result.correct) return KIKO.oops;
  if (isChecking || guess) return KIKO.thinking;
  return KIKO.hello;
}

function GuessGame() {
  const [roundIndex, setRoundIndex] = useState(0);
  const [guess, setGuess] = useState(null);
  const [result, setResult] = useState(null);
  const [resultKey, setResultKey] = useState(0);
  const [isChecking, setIsChecking] = useState(false);

  const clues = CHALLENGE_ROUNDS[roundIndex];

  const pickGuess = (country) => {
    if (isChecking) return;
    setGuess(country);
    setResult(null);
  };

  const nextRound = () => {
    setRoundIndex((i) => (i + 1) % CHALLENGE_ROUNDS.length);
    setGuess(null);
    setResult(null);
  };

  const checkGuess = async () => {
    if (isChecking || !guess) return;
    setIsChecking(true);
    try {
      // The real answer always comes from the backend's guess_country/2 —
      // we never decide correctness ourselves, only compare against it.
      const response = await guessCountry(clues);
      if (response?.answer) {
        const correct = response.answer === guess;
        setResult({ correct, answer: response.answer });
      } else {
        setResult({ error: response?.error || 'The Guess the Country backend is not available right now.' });
      }
    } catch (err) {
      setResult({ error: 'The Guess the Country backend is not available right now.' });
    } finally {
      setIsChecking(false);
      setResultKey((k) => k + 1);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 26, scale: 0.96 }}
      animate={{ opacity: 1, y: [26, -5, 0], scale: [0.96, 1.01, 1] }}
      transition={{ duration: 0.55, times: [0, 0.7, 1], ease: 'easeOut' }}
      className="relative flex flex-col gap-[26px] rounded-[28px] border-[5px] border-[#d6a35c] bg-[#fffdf3] bg-[radial-gradient(circle,#e7c9a0_1.5px,transparent_1.5px)] p-7 shadow-[0_12px_0_#f0deba,0_22px_40px_rgba(120,53,15,0.12)] [background-position:-4px_-4px] [background-size:22px_22px]"
    >
      <motion.span
        aria-hidden="true"
        className="pointer-events-none absolute -left-4 -top-5 text-4xl"
        animate={{ y: [0, -8, 0], rotate: [-8, 4, -8] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      >
        ☀️
      </motion.span>
      <motion.span
        aria-hidden="true"
        className="pointer-events-none absolute -right-3 -top-4 text-3xl"
        animate={{ y: [0, 7, 0], rotate: [6, -6, 6] }}
        transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
      >
        ☁️
      </motion.span>

      {/* Mascot */}
      <div className="relative flex items-center gap-4 rounded-[22px] bg-[#fef3c7] px-[18px] py-4">
        <span aria-hidden="true" className="absolute -left-2 top-8 h-4 w-4 rotate-45 bg-[#fef3c7]" />
        <motion.div
          className="relative flex h-[64px] w-[64px] flex-none items-center justify-center rounded-full bg-white shadow-[0_3px_0_#e7c9a0]"
          animate={{ rotate: [-4, 4, -4], y: [0, -3, 0] }}
          transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
        >
          <AnimatePresence mode="wait">
            <motion.img
              key={mascotPose(guess, result, isChecking)}
              src={mascotPose(guess, result, isChecking)}
              alt="Kiko the parrot mascot"
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.25 }}
              className="h-14 w-14 object-contain"
            />
          </AnimatePresence>
        </motion.div>
        <p className="m-0 text-xl font-bold text-[#7c2d12]">{mascotLine(guess, result, isChecking)}</p>
      </div>

      {/* Step 1: the clues (read-only) */}
      <div className="flex flex-col gap-3.5">
        <div className="flex items-center gap-2.5">
          <span className="flex h-[38px] w-[38px] flex-none items-center justify-center rounded-full bg-sky-500 text-lg font-extrabold text-white">
            1
          </span>
          <h2 className="m-0 text-2xl font-extrabold text-[#7c2d12]">Here are your clues</h2>
          <span className="rounded-full bg-[#fef3c7] px-4 py-1 text-sm font-bold text-[#7c2d12]">
            Round {roundIndex + 1} of {CHALLENGE_ROUNDS.length}
          </span>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3.5 rounded-[22px] border-4 border-dashed border-[#e7c9a0] bg-white p-[18px]">
          {clues.map((clue, index) => (
            <ClueCard key={`${clue.type}-${clue.value}`} clue={clue} index={index} />
          ))}
        </div>
      </div>

      {/* Step 2: pick your guess */}
      <div className="flex flex-col gap-3.5">
        <div className="flex items-center gap-2.5">
          <span className="flex h-[38px] w-[38px] flex-none items-center justify-center rounded-full bg-sky-500 text-lg font-extrabold text-white">
            2
          </span>
          <h2 className="m-0 text-2xl font-extrabold text-[#7c2d12]">Which country is it?</h2>
        </div>
        <div className="grid gap-3 [grid-template-columns:repeat(auto-fit,minmax(120px,1fr))]">
          {GUESSABLE_COUNTRIES.map((country) => {
            const selected = guess === country;
            return (
              <button
                key={country}
                type="button"
                onClick={() => pickGuess(country)}
                className={`relative flex flex-col items-center justify-center gap-2 rounded-[20px] border-4 px-3 py-4 font-bold capitalize transition-transform hover:-translate-y-1 active:translate-y-0 ${
                  selected
                    ? 'border-[#d6a35c] bg-[#fef3c7] text-[#7c2d12] shadow-[0_5px_0_#d6a35c]'
                    : 'border-[#f1f5f9] bg-white text-slate-600 shadow-[0_5px_0_#f1f5f9]'
                }`}
              >
                {selected && (
                  <motion.span
                    initial={{ scale: 0, rotate: -20 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 14 }}
                    className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-[#facc15] text-sm shadow-[0_2px_0_#d4a300]"
                    aria-hidden="true"
                  >
                    ⭐
                  </motion.span>
                )}
                <img src={FLAG_IMAGE_BY_COUNTRY[country]} alt="" className="h-10 w-14 rounded object-cover" />
                <span className="text-center text-base leading-tight">{country.replace(/_/g, ' ')}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center gap-3.5">
        <button
          type="button"
          onClick={checkGuess}
          disabled={!guess || isChecking}
          className={`flex min-h-[56px] items-center gap-3 rounded-full px-[34px] py-4 text-xl font-extrabold text-white transition-transform hover:-translate-y-1 active:translate-y-[3px] ${
            guess && !isChecking
              ? 'bg-sky-500 shadow-[0_6px_0_#0369a1] active:shadow-[0_2px_0_#0369a1]'
              : 'cursor-not-allowed bg-stone-300 shadow-[0_6px_0_#a8a29e]'
          }`}
        >
          {isChecking && (
            <span className="h-[22px] w-[22px] animate-spin rounded-full border-4 border-white/40 border-t-white" />
          )}
          {isChecking ? 'Checking…' : '✅ Check my guess'}
        </button>
        <button
          type="button"
          onClick={nextRound}
          className="min-h-[56px] rounded-full bg-[#fef3c7] px-7 py-[15px] text-lg font-extrabold text-[#7c2d12] shadow-[0_6px_0_#e7c9a0] transition-transform hover:-translate-y-1 active:translate-y-[3px] active:shadow-[0_2px_0_#e7c9a0]"
        >
          ➡️ Next round
        </button>
      </div>

      {/* Result */}
      <AnimatePresence mode="wait">
        {result?.correct && (
          <motion.div
            key={`correct-${resultKey}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative flex flex-col items-center gap-2.5 overflow-hidden rounded-[24px] bg-[#fef3c7] px-5 py-7"
          >
            <Confetti burstKey={resultKey} />
            <div className="text-5xl leading-none">🎉</div>
            <p className="m-0 text-xl font-bold text-[#7c2d12]">You're right! It was</p>
            <p className="m-0 text-center text-4xl font-extrabold capitalize leading-tight text-sky-600">
              {result.answer.replace(/_/g, ' ')}
            </p>
            {COUNTRY_CARD_IMAGE[result.answer] && (
              <img
                src={COUNTRY_CARD_IMAGE[result.answer]}
                alt={`${result.answer} illustrated card`}
                className="mt-2 w-40 rounded-2xl border-4 border-white shadow-lg"
              />
            )}
          </motion.div>
        )}
        {result && result.correct === false && (
          <motion.div
            key={`wrong-${resultKey}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, x: [0, -9, 8, -6, 5, -2, 2, 0] }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center gap-2 rounded-[22px] border-[3px] border-[#fecaca] bg-[#fef2f2] px-5 py-[18px]"
          >
            <div className="flex items-center gap-3">
              <span className="text-3xl leading-none" aria-hidden="true">🙈</span>
              <p className="m-0 text-lg font-bold text-red-600">
                Not quite! You guessed {guess?.replace(/_/g, ' ')}, but it was actually{' '}
                {result.answer.replace(/_/g, ' ')}.
              </p>
            </div>
            {COUNTRY_CARD_IMAGE[result.answer] && (
              <img
                src={COUNTRY_CARD_IMAGE[result.answer]}
                alt={`${result.answer} illustrated card`}
                className="mt-1 w-32 rounded-2xl border-4 border-white shadow"
              />
            )}
          </motion.div>
        )}
        {result?.error && (
          <motion.div
            key={`error-${resultKey}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, x: [0, -9, 8, -6, 5, -2, 2, 0] }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-center gap-3 rounded-[22px] border-[3px] border-[#fecaca] bg-[#fef2f2] px-5 py-[18px]"
          >
            <span className="text-3xl leading-none" aria-hidden="true">🙈</span>
            <p className="m-0 text-xl font-bold text-red-600">{result.error}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default GuessGame;
