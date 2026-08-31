import { useState } from 'react';
import Card from '../../../shared/components/Card/Card';
import CountryDragCard from './CountryDragCard';
import CapitalDropTarget from './CapitalDropTarget';
import { checkCapitalMatch } from '../capitalMatchApi';

// A small round — country atoms and capitals must match backend/prolog/facts.pl.
const ROUND = [
  { country: 'vietnam', capital: 'hanoi' },
  { country: 'thailand', capital: 'bangkok' },
  { country: 'laos', capital: 'vientiane' },
];

function CapitalMatchGame() {
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const handleDrop = async (capital) => {
    if (!selectedCountry) return;
    const response = await checkCapitalMatch(selectedCountry, capital);
    setFeedback({ country: selectedCountry, capital, result: response.result });
    setSelectedCountry(null);
  };

  return (
    <Card className="flex flex-col items-center gap-6">
      <div className="flex flex-wrap justify-center gap-3">
        {ROUND.map(({ country }) => (
          <CountryDragCard
            key={country}
            name={country}
            selected={selectedCountry === country}
            onSelect={setSelectedCountry}
          />
        ))}
      </div>
      <div className="flex flex-wrap justify-center gap-3">
        {ROUND.map(({ capital }) => (
          <CapitalDropTarget key={capital} name={capital} onDrop={handleDrop} />
        ))}
      </div>
      {feedback && (
        <p
          className={`font-bold capitalize ${
            feedback.result === 'correct' ? 'text-green-600' : 'text-red-500'
          }`}
        >
          {feedback.country} → {feedback.capital}: {feedback.result}
        </p>
      )}
    </Card>
  );
}

export default CapitalMatchGame;
