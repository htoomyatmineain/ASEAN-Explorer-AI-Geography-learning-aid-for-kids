import { useEffect, useState } from 'react';
import Card from '../../../shared/components/Card/Card';
import { getCountryInfo } from '../learningApi';
import { FLAG_IMAGE_BY_COUNTRY, LANDMARK_IMAGE_BY_VALUE } from '../../guess-game/clueOptions';

// Popup shown when a country is tapped on the full-page map: flag, name,
// capital, currency, membership year, representative animal, famous foods
// and attraction places. All facts come from the Prolog backend's
// /country/:name endpoint.
function CountryDetailPanel({ countryName, onClose }) {
  const [card, setCard] = useState(null);

  useEffect(() => {
    setCard(null);
    if (!countryName) return;
    getCountryInfo(countryName).then(setCard).catch(() => setCard(null));
  }, [countryName]);

  if (!countryName || !card) return null;

  const countryLabel = card.country.replace(/_/g, ' ');
  const flagImage = FLAG_IMAGE_BY_COUNTRY[countryName];
  const animals = card.animals ?? [];
  const foods = card.foods ?? [];
  const famousFor = card.famous_for ?? [];

  return (
    <Card className="relative flex max-h-[calc(100vh-9rem)] flex-col gap-3 overflow-y-auto border-b-[5px] border-sky-600 shadow-[0_4px_0_0_rgb(2,132,199)]">
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-sky-100 text-lg font-bold text-sky-700 transition-transform hover:scale-110 active:scale-95"
      >
        ×
      </button>

      {/* Flag + country name */}
      <div className="flex items-center gap-3 pr-8">
        {flagImage ? (
          <img
            src={flagImage}
            alt={`${countryLabel} flag`}
            className="h-11 w-16 flex-none rounded-md border border-slate-200 object-cover shadow"
          />
        ) : (
          <span className="text-5xl leading-none">{card.flag}</span>
        )}
        <div className="flex flex-col gap-0.5">
          <h2 className="m-0 text-2xl font-extrabold capitalize leading-tight text-stone-900">
            {countryLabel}
          </h2>
          {card.asean_member === 'yes' && (
            <span className="w-fit rounded-full bg-sky-100 px-2 py-0.5 text-xs font-extrabold uppercase tracking-wide text-sky-700">
              ✓ ASEAN Member{card.member_since ? ` since ${card.member_since}` : ''}
            </span>
          )}
        </div>
      </div>

      {/* Capital + currency */}
      <div className="grid grid-cols-1 gap-1.5 rounded-xl bg-sky-50 p-3">
        <p className="m-0 text-sm font-semibold text-stone-700">
          <span aria-hidden="true" className="mr-1.5">🏙️</span>
          Capital: <span className="capitalize">{card.capital.replace(/_/g, ' ')}</span>
        </p>
        <p className="m-0 text-sm font-semibold text-stone-700">
          <span aria-hidden="true" className="mr-1.5">💰</span>
          Currency: <span className="capitalize">{card.currency.replace(/_/g, ' ')}</span>
        </p>
      </div>

      {/* Representative animal */}
      {animals.length > 0 && (
        <div className="flex flex-col gap-1.5">
          <p className="m-0 text-xs font-extrabold uppercase tracking-wide text-stone-500">
            🐾 National animal
          </p>
          <div className="flex flex-wrap gap-2">
            {animals.map((animal) => (
              <span
                key={animal}
                className="rounded-full bg-orange-100 px-3 py-1 text-sm font-semibold capitalize text-orange-900"
              >
                {animal.replace(/_/g, ' ')}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Famous foods */}
      {foods.length > 0 && (
        <div className="flex flex-col gap-1.5">
          <p className="m-0 text-xs font-extrabold uppercase tracking-wide text-stone-500">
            🍜 Famous foods
          </p>
          <div className="flex flex-wrap gap-2">
            {foods.map((food) => (
              <span
                key={food}
                className="rounded-full bg-amber-100 px-3 py-1 text-sm font-semibold capitalize text-amber-900"
              >
                {food.replace(/_/g, ' ')}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Attractions */}
      {famousFor.length > 0 && (
        <div className="flex flex-col gap-1.5">
          <p className="m-0 text-xs font-extrabold uppercase tracking-wide text-stone-500">
            📍 Attractions
          </p>
          <div className="flex flex-wrap gap-2">
            {famousFor.map((fact) => (
              <span
                key={fact}
                className="flex items-center gap-1.5 rounded-full bg-lime-100 py-1 pl-1 pr-3 text-sm font-semibold capitalize text-lime-900"
              >
                {LANDMARK_IMAGE_BY_VALUE[fact] ? (
                  <img
                    src={LANDMARK_IMAGE_BY_VALUE[fact]}
                    alt=""
                    className="h-6 w-6 rounded-full bg-white object-contain"
                  />
                ) : (
                  <span aria-hidden="true" className="text-base">⭐</span>
                )}
                {fact.replace(/_/g, ' ')}
              </span>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}

export default CountryDetailPanel;
