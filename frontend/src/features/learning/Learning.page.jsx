import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AseanMap from './components/AseanMap';
import CountryDetailPanel from './components/CountryDetailPanel';

// Same asset as the entrance page's logo (frontend/src/features/home/Home.page.jsx)
// — filename has a space, so it stays percent-encoded.
const LOGO_IMAGE = '/assets/logo/ASEAN%20explorer.png';
// Same illustrated background as the shared Layout and the game pages
// (frontend/src/features/main-menu/components/Layout.jsx).
const BACKGROUND_IMAGE = '/assets/background/learning.png';

const BACK_BUTTON =
  'flex shrink-0 items-center justify-center gap-2 rounded-xl border-b-4 border-rose-700 bg-rose-500 px-4 py-2 text-white [text-shadow:_0_2px_4px_rgb(0_0_0_/_60%)] shadow-[0_3px_0_0_rgb(190,18,60)] transition-transform duration-100 ease-out active:translate-y-[3px] active:border-b-0 active:shadow-none';

// Only the map fills the page. Tapping a country opens its info popup
// (flag, name, capital, animal, foods, attractions) as an overlay.
function LearningPage() {
  const [selectedCountry, setSelectedCountry] = useState(null);
  const navigate = useNavigate();

  return (
    <div className="relative flex h-screen flex-col overflow-hidden">
      {/* Illustrated background behind everything; the map container paints
          a near-opaque teal wash over it so the map stays fully readable. */}
      <div
        className="fixed inset-0 -z-10 bg-cover bg-no-repeat"
        style={{ backgroundImage: `url('${BACKGROUND_IMAGE}')`, backgroundPosition: 'center bottom' }}
      />

      <header className="relative flex shrink-0 items-center justify-between gap-4 px-6 py-3">
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

      {/* Full-page map */}
      <div className="relative flex-1 overflow-hidden">
        <AseanMap selectedCountry={selectedCountry} onSelectCountry={setSelectedCountry} />
        {selectedCountry && (
          <div className="absolute right-4 top-4 z-20 w-full max-w-sm">
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
