import { useState } from 'react';
import Card from '../../../shared/components/Card/Card';
import Button from '../../../shared/components/Button/Button';
import ClueCard from './ClueCard';
import { guessCountry } from '../guessGameApi';

// Matches the KB doc §5.2 worked example.
const SAMPLE_CLUES = [
  { type: 'member_of', value: 'asean' },
  { type: 'capital', value: 'bangkok' },
  { type: 'famous_for', value: 'elephants' },
  { type: 'borders', value: 'myanmar' },
];

function GuessGame() {
  const [result, setResult] = useState(null);

  const handleGuess = async () => {
    const response = await guessCountry(SAMPLE_CLUES);
    setResult(response);
  };

  return (
    <Card className="flex flex-col items-center gap-4">
      <div className="flex flex-wrap justify-center gap-2">
        {SAMPLE_CLUES.map((clue) => (
          <ClueCard key={`${clue.type}-${clue.value}`} clue={clue} />
        ))}
      </div>
      <Button onClick={handleGuess}>Reveal the Country</Button>
      {result?.answer && (
        <p className="text-xl font-bold capitalize text-sky-600">{result.answer}</p>
      )}
      {result?.error && <p className="font-semibold text-red-500">{result.error}</p>}
    </Card>
  );
}

export default GuessGame;
