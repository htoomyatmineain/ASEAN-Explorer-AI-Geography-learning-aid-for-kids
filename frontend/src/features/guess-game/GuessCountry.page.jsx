import { motion } from 'framer-motion';
import GuessGame from './components/GuessGame';

function GuessCountryPage() {
  return (
    <div className="flex flex-col gap-6">
      <div
        className="relative flex flex-wrap items-center gap-4 overflow-hidden rounded-[24px] px-6 py-5"
        style={{
          backgroundImage: "url('/assets/guess-game/learning-bg.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-white/55" aria-hidden="true" />
        <motion.span
          className="relative text-5xl leading-none"
          aria-hidden="true"
          animate={{ rotate: [-6, 6, -6] }}
          transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut' }}
        >
          🧭
        </motion.span>
        <div className="relative">
          <h1 className="m-0 text-4xl font-extrabold leading-tight text-[#7c2d12]">
            Guess the Country
          </h1>
          <p className="mt-0.5 text-xl font-semibold text-[#a16207]">
            I'll give you clues — you guess the country!
          </p>
        </div>
      </div>
      <GuessGame />
    </div>
  );
}

export default GuessCountryPage;
