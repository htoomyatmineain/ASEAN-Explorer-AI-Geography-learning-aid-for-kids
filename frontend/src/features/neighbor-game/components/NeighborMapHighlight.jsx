import { motion } from 'framer-motion';
import { FLAG_IMAGE_BY_COUNTRY } from '../../guess-game/clueOptions';

// One chip per candidate country: flag + name. Before checking, chips are
// tappable (the child picks the odd one out); after checking, the backend's
// non_neighbors answer key colors them — green ✓ = real neighbor, red ✗ = the
// non-neighbor(s), i.e. the correct pick(s).
function NeighborMapHighlight({ candidates, pick, nonNeighbors, status, onPick }) {
  const done = status === 'done';

  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      {candidates.map((candidate) => {
        const isPick = !done && pick === candidate;
        const isNonNeighbor = done && nonNeighbors?.includes(candidate);
        const isNeighbor = done && !nonNeighbors?.includes(candidate);

        return (
          <button
            key={candidate}
            type="button"
            onClick={() => onPick(candidate)}
            disabled={done}
            className={`relative flex flex-col items-center gap-1.5 rounded-[18px] border-4 px-4 py-3 font-bold capitalize transition-transform hover:-translate-y-1 active:translate-y-0 ${
              isNonNeighbor
                ? 'border-red-300 bg-red-100 text-red-700'
                : isNeighbor
                  ? 'border-green-300 bg-green-100 text-green-700'
                  : isPick
                    ? 'border-amber-400 bg-amber-100 text-amber-800 shadow-[0_5px_0_#f59e0b]'
                    : 'border-[#f1f5f9] bg-white text-slate-600 shadow-[0_5px_0_#f1f5f9]'
            }`}
          >
            {isPick && (
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
            {done && (
              <span
                className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white text-sm font-black shadow-[0_2px_0_#cbd5e1]"
                aria-hidden="true"
              >
                {isNonNeighbor ? '✗' : '✓'}
              </span>
            )}
            <img
              src={FLAG_IMAGE_BY_COUNTRY[candidate]}
              alt=""
              className="h-10 w-14 rounded object-cover"
            />
            <span className="text-center text-base leading-tight">{candidate}</span>
          </button>
        );
      })}
    </div>
  );
}

export default NeighborMapHighlight;
