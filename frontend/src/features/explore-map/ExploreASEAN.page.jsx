import { useState } from 'react';
import Map from './components/Map';
import CountryCard from './components/CountryCard';

function ExploreASEANPage() {
  const [selectedCountry, setSelectedCountry] = useState(null);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-extrabold text-sky-600">Explore ASEAN</h1>
      <Map onSelectCountry={setSelectedCountry} />
      <CountryCard countryName={selectedCountry} />
    </div>
  );
}

export default ExploreASEANPage;
