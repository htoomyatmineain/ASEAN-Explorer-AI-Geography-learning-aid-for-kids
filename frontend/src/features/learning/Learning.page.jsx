import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AseanMap from './components/AseanMap';
import CountryDetailPanel from './components/CountryDetailPanel';

// Same asset as the entrance page's logo (frontend/src/features/home/Home.page.jsx)
// — filename has a space, so it stays percent-encoded.
const LOGO_IMAGE = '/assets/logo/ASEAN%20explorer.png';
const SETTINGS_ICON = '/assets/icons/nav-03.png';

const BACK_BUTTON =
  'flex shrink-0 items-center justify-center gap-2 rounded-xl border-b-4 border-rose-700 bg-rose-500 px-6 py-3.5 text-xl font-extrabold uppercase tracking-wide text-white [text-shadow:_0_2px_4px_rgb(0_0_0_/_60%)] shadow-[0_3px_0_0_rgb(190,18,60)] transition-transform duration-100 ease-out active:translate-y-[3px] active:border-b-0 active:shadow-none';

const SETTINGS_BUTTON =
  'flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-xl border-b-4 border-lime-600 bg-lime-400 shadow-[0_3px_0_0_rgb(101,163,13)] transition-transform duration-100 ease-out active:translate-y-[3px] active:border-b-0 active:shadow-none';

// The map fills the entire viewport — logo, hint text, the detail card and
// the bottom nav are all overlays floating on top of it, not a separate
// header bar (which used to leave an empty colored strip above the map).
function LearningPage() {
  const [selectedCountry, setSelectedCountry] = useState(null);
  const navigate = useNavigate();

  return (
    <div className="relative h-screen w-full overflow-hidden">
      <AseanMap selectedCountry={selectedCountry} onSelectCountry={setSelectedCountry} />

      <Link to="/main-menu" className="absolute left-6 top-4 z-20">
        <img src={LOGO_IMAGE} alt="ASEAN Explorer" className="h-16 w-auto drop-shadow" />
      </Link>

      {/* Hint text, top-right corner. */}
      <div className="pointer-events-none absolute right-6 top-6 z-20">
        <span className="inline-flex items-center gap-2 rounded-2xl border-2 border-b-[5px] border-sky-400 bg-white/90 px-4 py-2.5 font-comic text-base font-bold text-sky-800 shadow-[0_3px_0_0_rgb(14,165,233)]">
          <span aria-hidden="true" className="inline-block animate-bounce">👆</span>
          Tap a country to learn about it!
        </span>
      </div>

      {/* Detail card sits on the left, gapped from every edge. Bounded top
          and bottom so it can never render partly below the viewport — the
          page itself doesn't scroll (root is h-screen/overflow-hidden), so
          unbounded card growth was clipping the bottom of longer cards with
          no way to reach it. The card only scrolls internally, and only if
          its content is actually taller than this box. */}
      {selectedCountry && (
        <div className="absolute left-6 top-32 bottom-6 z-20 w-[calc(100%-3rem)] sm:w-[30%]">
          <CountryDetailPanel countryName={selectedCountry} onClose={() => setSelectedCountry(null)} />
        </div>
      )}

      {/* Bottom nav bar. */}
      <div className="absolute bottom-4 right-4 z-20 flex items-center gap-3">
        <button type="button" onClick={() => navigate('/main-menu')} className={BACK_BUTTON}>
          Back
        </button>
        <Link to="/settings" aria-label="Settings" className={SETTINGS_BUTTON}>
          <img src={SETTINGS_ICON} alt="" className="h-7 w-7" />
        </Link>
      </div>
    </div>
  );
}

export default LearningPage;
