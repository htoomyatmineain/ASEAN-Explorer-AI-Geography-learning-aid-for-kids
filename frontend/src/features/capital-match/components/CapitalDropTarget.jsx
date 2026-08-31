function CapitalDropTarget({ name, onDrop }) {
  return (
    <button
      onClick={() => onDrop(name)}
      className="rounded-xl bg-yellow-200 px-4 py-2 font-semibold capitalize shadow hover:bg-yellow-300"
    >
      {name}
    </button>
  );
}

export default CapitalDropTarget;
