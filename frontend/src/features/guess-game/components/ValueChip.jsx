import { motion } from 'framer-motion';

// Clue-value "chip" button — step 2 of the picker. Sky-blue selected state, per
// the Guess the Country (Kids Edition) design handoff. `imageSrc` (a flag or
// landmark thumbnail) is optional — most value types are text-only.
function ValueChip({ label, imageSrc, selected, onClick }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileTap={{ scale: 0.94 }}
      animate={selected ? { scale: [1, 1.08, 1] } : { scale: 1 }}
      transition={{ duration: 0.35 }}
      className={`flex min-h-[48px] items-center gap-2 rounded-full border-[3px] py-2.5 pl-2.5 pr-5 text-lg font-bold capitalize transition-colors hover:-translate-y-1 active:translate-y-0 ${
        selected
          ? 'border-[#0369a1] bg-sky-500 text-white'
          : 'border-slate-200 bg-white text-slate-700'
      } ${imageSrc ? '' : 'pl-5'}`}
    >
      {imageSrc && (
        <img
          src={imageSrc}
          alt=""
          className="h-7 w-7 flex-none rounded-full border-2 border-white/70 object-cover"
        />
      )}
      {selected && (
        <span aria-hidden="true" className="text-base leading-none">
          ✓
        </span>
      )}
      {label}
    </motion.button>
  );
}

export default ValueChip;
