import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AseanMap from './components/AseanMap';
import CountryDetailPanel from './components/CountryDetailPanel';

// Same asset as the entrance page's logo (frontend/src/features/home/Home.page.jsx)
// — filename has a space, so it stays percent-encoded.
const LOGO_IMAGE = '/assets/logo/ASEAN%20explorer.png';

const BACK_BUTTON =
  'flex shrink-0 items-center justify-center gap-2 rounded-xl border-b-4 border-rose-700 bg-rose-500 px-4 py-2 text-white [text-shadow:_0_2px_4px_rgb(0_0_0_/_60%)] shadow-[0_3px_0_0_rgb(190,18,60)] transition-transform duration-100 ease-out active:translate-y-[3px] active:border-b-0 active:shadow-none';

function LearningPage() {
  const [selectedCountry, setSelectedCountry] = useState(null);
  const navigate = useNavigate();

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <header className="relative flex shrink-0 items-center justify-between gap-4 bg-sky-600 px-6 py-3 shadow-md">
        <Link to="/main-menu">
          <img src={LOGO_IMAGE} alt="ASEAN Explorer" className="h-12 w-auto drop-shadow" />
        </Link>
        <span className="absolute left-1/2 -translate-x-1/2 text-2xl font-extrabold uppercase tracking-wide text-white [text-shadow:_0_2px_4px_rgb(0_0_0_/_60%)]">
          Learn About ASEAN Countries!
        </span>
        <button type="button" onClick={() => navigate('/main-menu')} className={BACK_BUTTON}>
          Main Menu
        </button>
      </header>

      <div className="relative flex-1">
        <AseanMap selectedCountry={selectedCountry} onSelectCountry={setSelectedCountry} />
        {selectedCountry && (
          <div className="absolute right-4 top-4 w-full max-w-sm">
            <CountryDetailPanel
              countryName={selectedCountry}
              onClose={() => setSelectedCountry(null)}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default LearningPage;
