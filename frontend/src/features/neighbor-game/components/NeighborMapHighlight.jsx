function NeighborMapHighlight({ candidates, nonNeighbors }) {
  return (
    <div className="flex flex-wrap gap-2">
      {candidates.map((candidate) => {
        const isNonNeighbor = nonNeighbors?.includes(candidate);
        return (
          <span
            key={candidate}
            className={`rounded-full px-4 py-2 font-semibold capitalize ${
              isNonNeighbor ? 'bg-red-200 text-red-800' : 'bg-green-200 text-green-800'
            }`}
          >
            {candidate}
          </span>
        );
      })}
    </div>
  );
}

export default NeighborMapHighlight;
