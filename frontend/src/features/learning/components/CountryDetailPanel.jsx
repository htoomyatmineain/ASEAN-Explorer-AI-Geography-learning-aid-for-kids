import { useEffect, useState } from 'react';
import Card from '../../../shared/components/Card/Card';
import { getCountryInfo } from '../learningApi';

function CountryDetailPanel({ countryName, onClose }) {
  const [card, setCard] = useState(null);

  useEffect(() => {
    setCard(null);
    if (!countryName) return;
    getCountryInfo(countryName).then(setCard);
  }, [countryName]);

  if (!countryName || !card) return null;

  return (
    <Card className="relative flex flex-col items-center gap-2 border-b-[5px] border-sky-600 shadow-[0_4px_0_0_rgb(2,132,199)]">
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-sky-100 text-lg font-bold text-sky-700"
      >
        ×
      </button>
      <span className="text-5xl">{card.flag}</span>
      <h2 className="text-2xl font-extrabold capitalize">{card.country}</h2>
      <p>Capital: {card.capital}</p>
      <p>Currency: {card.currency}</p>
      <p>Region: {card.region}</p>
      {card.famous_for?.length > 0 && (
        <div className="mt-2 flex flex-wrap justify-center gap-2">
          {card.famous_for.map((fact) => (
            <span
              key={fact}
              className="rounded-full bg-lime-200 px-3 py-1 text-sm font-semibold capitalize text-lime-900"
            >
              {fact.replace(/_/g, ' ')}
            </span>
          ))}
        </div>
      )}
    </Card>
  );
}

export default CountryDetailPanel;
