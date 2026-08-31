import { useEffect, useState } from 'react';
import Card from '../../../shared/components/Card/Card';
import { getCountryInfo } from '../exploreMapApi';

function CountryCard({ countryName }) {
  const [card, setCard] = useState(null);

  useEffect(() => {
    if (!countryName) return;
    getCountryInfo(countryName).then(setCard);
  }, [countryName]);

  if (!card) return null;

  return (
    <Card className="flex flex-col items-center gap-2">
      <span className="text-5xl">{card.flag}</span>
      <h2 className="text-2xl font-extrabold capitalize">{card.country}</h2>
      <p>Capital: {card.capital}</p>
      <p>Currency: {card.currency}</p>
      <p>Region: {card.region}</p>
      <p>ASEAN member: {card.asean_member}</p>
      {card.famous_for?.length > 0 && (
        <p>Famous for: {card.famous_for.join(', ')}</p>
      )}
    </Card>
  );
}

export default CountryCard;
