function CountryDragCard({ name, selected, onSelect }) {
  return (
    <button
      onClick={() => onSelect(name)}
      className={`rounded-xl px-4 py-2 font-semibold capitalize shadow ${
        selected ? 'bg-sky-500 text-white' : 'bg-white text-slate-800'
      }`}
    >
      {name}
    </button>
  );
}

export default CountryDragCard;
