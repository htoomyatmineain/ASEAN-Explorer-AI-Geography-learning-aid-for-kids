function ClueCard({ clue }) {
  return (
    <div className="rounded-xl bg-yellow-100 px-4 py-2 font-semibold shadow-sm">
      {clue.type.replace('_', ' ')}: {clue.value.replace('_', ' ')}
    </div>
  );
}

export default ClueCard;
