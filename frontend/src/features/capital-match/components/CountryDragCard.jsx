import { motion } from 'framer-motion';
import { FLAG_IMAGE_BY_COUNTRY } from '../../guess-game/clueOptions';

// Tappable country card: flag + name. Selected = picked for matching;
// matched = its capital was found and the pair is locked in.
function CountryDragCard({ name, selected, matched, onSelect }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      disabled={matched}
      className={`relative flex flex-col items-center gap-2 rounded-[18px] border-4 px-5 py-3 font-bold capitalize transition-transform hover:-translate-y-1 active:translate-y-0 ${
        matched
          ? 'border-green-400 bg-green-50 text-green-700'
          : selected
            ? 'border-rose-400 bg-rose-50 text-rose-700 shadow-[0_5px_0_#fb7185]'
            : 'border-[#f1f5f9] bg-white text-slate-600 shadow-[0_5px_0_#f1f5f9]'
      }`}
    >
      {selected && !matched && (
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
      {matched && (
        <span
          className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-green-500 text-sm font-black text-white shadow-[0_2px_0_#15803d]"
          aria-hidden="true"
        >
          ✓
        </span>
      )}
      <img src={FLAG_IMAGE_BY_COUNTRY[name]} alt="" className="h-10 w-14 rounded object-cover" />
      <span className="text-center text-base leading-tight">{name.replace(/_/g, ' ')}</span>
    </button>
  );
}

export default CountryDragCard;
