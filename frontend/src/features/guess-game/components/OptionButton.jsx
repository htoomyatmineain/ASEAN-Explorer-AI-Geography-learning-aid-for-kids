import { motion } from 'framer-motion';

// Clue-type "card" button — step 1 of the picker. Big icon + label, tan/cream
// selected state, per the Guess the Country (Kids Edition) design handoff.
function OptionButton({ icon, iconSrc, label, selected, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative flex min-h-[104px] min-w-[140px] flex-1 flex-col items-center justify-center gap-2 rounded-[20px] border-4 px-3 py-4 font-bold transition-transform hover:-translate-y-1 hover:rotate-1 active:translate-y-0 ${
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
      <motion.span
        className="flex h-10 items-center justify-center text-4xl leading-none"
        aria-hidden="true"
        animate={selected ? { rotate: [0, -8, 8, 0], scale: [1, 1.15, 1] } : {}}
        transition={{ duration: 0.5 }}
      >
        {iconSrc ? (
          <img src={iconSrc} alt="" className="h-10 w-10 object-contain" />
        ) : (
          icon
        )}
      </motion.span>
      <span className="text-center text-lg leading-tight">{label}</span>
    </button>
  );
}

export default OptionButton;
