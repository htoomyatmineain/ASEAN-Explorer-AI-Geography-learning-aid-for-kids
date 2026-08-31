import CountryPin from './CountryPin';

// The 10 ASEAN member countries — atoms must match backend/prolog/facts.pl.
export const ASEAN_COUNTRIES = [
  { name: 'brunei', label: 'Brunei' },
  { name: 'cambodia', label: 'Cambodia' },
  { name: 'indonesia', label: 'Indonesia' },
  { name: 'laos', label: 'Laos' },
  { name: 'malaysia', label: 'Malaysia' },
  { name: 'myanmar', label: 'Myanmar' },
  { name: 'philippines', label: 'Philippines' },
  { name: 'singapore', label: 'Singapore' },
  { name: 'thailand', label: 'Thailand' },
  { name: 'vietnam', label: 'Vietnam' },
];

// Placeholder grid layout until real map artwork lands in public/assets/map/.
function Map({ onSelectCountry }) {
  return (
    <div className="grid grid-cols-2 gap-3 rounded-2xl bg-sky-100 p-6 sm:grid-cols-5">
      {ASEAN_COUNTRIES.map((country) => (
        <CountryPin
          key={country.name}
          name={country.name}
          label={country.label}
          onSelect={onSelectCountry}
        />
      ))}
    </div>
  );
}

export default Map;
