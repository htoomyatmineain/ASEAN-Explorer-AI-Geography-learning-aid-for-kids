// Tappable capital "drop target": kids tap the country first, then one of
// these. Once the pair is matched correctly the target locks green.
function CapitalDropTarget({ name, matched, onDrop }) {
  return (
    <button
      type="button"
      onClick={onDrop}
      disabled={matched}
      className={`relative flex flex-col items-center gap-1.5 rounded-[18px] border-4 px-5 py-3 font-bold capitalize transition-transform hover:-translate-y-1 active:translate-y-0 ${
        matched
          ? 'border-green-400 bg-green-50 text-green-700'
          : 'border-dashed border-amber-300 bg-amber-50 text-amber-800 hover:bg-amber-100'
      }`}
    >
      {matched && (
        <span
          className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-green-500 text-sm font-black text-white shadow-[0_2px_0_#15803d]"
          aria-hidden="true"
        >
          ✓
        </span>
      )}
      <span className="text-2xl leading-none" aria-hidden="true">🏛️</span>
      <span className="text-center text-base leading-tight">{name.replace(/_/g, ' ')}</span>
    </button>
  );
}

export default CapitalDropTarget;
