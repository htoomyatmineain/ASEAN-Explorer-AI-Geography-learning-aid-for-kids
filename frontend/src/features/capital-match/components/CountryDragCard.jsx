import { FLAG_IMAGE_BY_COUNTRY } from '../../guess-game/clueOptions';

function CountryDragCard({ name, selected, onSelect }) {
  return (
    <button
      onClick={() => onSelect(name)}
      className={`flex items-center gap-2 rounded-xl px-4 py-2 font-semibold capitalize shadow ${
        selected ? 'bg-sky-500 text-white' : 'bg-white text-slate-800'
      }`}
    >
      <img src={FLAG_IMAGE_BY_COUNTRY[name]} alt="" className="h-6 w-9 rounded object-cover" />
      {name}
    </button>
  );
}

export default CountryDragCard;
