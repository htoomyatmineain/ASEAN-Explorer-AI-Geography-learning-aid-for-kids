import { motion } from 'framer-motion';

// Shown after the "Press ANY key to start" prompt is triggered — fills once,
// then hands off to onComplete (the entrance page navigates to /card-selection).
const LOAD_DURATION_SECONDS = 2.5;

function LoadingBar({ onComplete }) {
  return (
    <div className="w-[80vw] max-w-xs">
      <p className="mb-2 text-center text-xl font-extrabold uppercase tracking-wide text-white
                     [text-shadow:_0_2px_4px_rgb(0_0_0_/_60%)]">
        Loading...
      </p>
      <div className="h-5 w-full overflow-hidden rounded-full border-2 border-black bg-white/70">
        <motion.div
          initial={{ width: '0%' }}
          animate={{ width: '100%' }}
          transition={{ duration: LOAD_DURATION_SECONDS, ease: 'linear' }}
          onAnimationComplete={onComplete}
          className="h-full rounded-full bg-gradient-to-r from-yellow-400 via-amber-500 to-amber-600"
        />
      </div>
    </div>
  );
}

export default LoadingBar;
