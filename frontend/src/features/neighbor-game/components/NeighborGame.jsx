import { useState } from 'react';
import Card from '../../../shared/components/Card/Card';
import Button from '../../../shared/components/Button/Button';
import NeighborMapHighlight from './NeighborMapHighlight';
import { checkNeighbors } from '../neighborGameApi';

// Matches the KB doc §5.3 worked example — includes vietnam, a genuine
// non-neighbor of myanmar, so the round always has a valid "odd one out".
const COUNTRY = 'myanmar';
const CANDIDATES = ['china', 'india', 'bangladesh', 'thailand', 'laos', 'vietnam'];

function NeighborGame() {
  const [nonNeighbors, setNonNeighbors] = useState(null);

  const handleCheck = async () => {
    const response = await checkNeighbors(COUNTRY, CANDIDATES);
    setNonNeighbors(response.non_neighbors);
  };

  return (
    <Card className="flex flex-col items-center gap-4">
      <p className="font-semibold capitalize">Which of these does NOT border {COUNTRY}?</p>
      <NeighborMapHighlight candidates={CANDIDATES} nonNeighbors={nonNeighbors} />
      <Button onClick={handleCheck}>Check Neighbors</Button>
    </Card>
  );
}

export default NeighborGame;
