import { useState } from 'react';
import AseanMap from './components/AseanMap';
import CountryDetailPanel from './components/CountryDetailPanel';

function LearningPage() {
  const [selectedCountry, setSelectedCountry] = useState(null);

  return (
    <div className="flex flex-col items-center gap-6">
      <h1 className="text-2xl font-extrabold text-sky-600">Explore ASEAN</h1>
      <div className="w-full max-w-3xl">
        <AseanMap selectedCountry={selectedCountry} onSelectCountry={setSelectedCountry} />
      </div>
      <div className="w-full max-w-sm">
        <CountryDetailPanel
          countryName={selectedCountry}
          onClose={() => setSelectedCountry(null)}
        />
      </div>
    </div>
  );
}

export default LearningPage;
