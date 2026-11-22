import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ASEAN_COUNTRIES } from './countryCodes';
import { FLAG_IMAGE_BY_COUNTRY } from '../guess-game/clueOptions';
import AseanMap from './components/AseanMap';
import CountryDetailPanel from './components/CountryDetailPanel';
import { useI18n } from '../../shared/i18n/I18nContext';

// Same asset as the entrance page's logo (frontend/src/features/home/Home.page.jsx)
// — filename has a space, so it stays percent-encoded.
const LOGO_IMAGE = '/assets/logo/ASEAN%20explorer.png';
const SETTINGS_ICON = '/assets/icons/settings.png';

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
  const { t, tWord } = useI18n();

  return (
    <div className={"explore-page relative h-[100dvh] w-full overflow-hidden " + (selectedCountry ? "has-selection" : "")}>
      <div className="explore-map"><AseanMap selectedCountry={selectedCountry} onSelectCountry={setSelectedCountry} /></div>

      <Link to="/main-menu" className="absolute left-6 top-4 z-20">
        <img src={LOGO_IMAGE} alt="ASEAN Explorer" className="h-16 w-auto drop-shadow" />
      </Link>

      {/* Hint text, top-right corner. */}
      <div className="pointer-events-none absolute right-6 top-6 z-20 hidden md:block">
        <span className="inline-flex items-center gap-2 rounded-2xl border-2 border-b-[5px] border-sky-400 bg-white/90 px-4 py-2.5 font-comic text-base font-bold text-sky-800 shadow-[0_3px_0_0_rgb(14,165,233)]">
          <span aria-hidden="true" className="inline-block animate-bounce">👆</span>
          {t('learning.hint')}
        </span>
      </div>

      {/* Detail card sits on the left, gapped from the top/left edges. Its
          own height comes from its content (see CountryDetailPanel, which
          caps itself against the viewport and scrolls internally only if
          content is ever actually taller than that) rather than being
          stretched to fill a fixed box — that stretch used to leave a big
          empty gap under shorter cards. */}
      {selectedCountry && (
        <div className="explore-detail absolute z-20">
          <CountryDetailPanel countryName={selectedCountry} onClose={() => setSelectedCountry(null)} />
        </div>
      )}

      <div className="absolute bottom-4 right-4 z-20 flex max-w-[calc(100%-2rem)] items-center gap-3">
      <nav aria-label={t('learning.chooseCountry')} className="explore-picker flex min-w-0 gap-2 overflow-x-auto rounded-2xl border-2 border-b-[5px] border-sky-400 bg-white/90 p-2 shadow-[0_3px_0_0_rgb(14,165,233)]">
        {ASEAN_COUNTRIES.map((country) => (
          <button key={country} type="button" aria-pressed={selectedCountry === country}
            onClick={() => setSelectedCountry(country)}
            className={"flex min-h-11 shrink-0 items-center gap-2 rounded-xl border-2 border-b-4 px-3 py-2 font-comic text-sm capitalize text-sky-950 focus-visible:outline focus-visible:outline-4 focus-visible:outline-sky-700 " + (selectedCountry === country ? 'border-amber-500 bg-amber-100' : 'border-sky-100 border-b-sky-300 bg-white hover:bg-sky-100')}>
            <img src={FLAG_IMAGE_BY_COUNTRY[country]} alt="" className="h-4 w-6 rounded-sm object-cover" />
            {tWord(country)}
          </button>
        ))}
      </nav>
      {/* Bottom nav bar. */}
      <div className="flex shrink-0 items-center gap-3">
        <button type="button" onClick={() => navigate('/main-menu')} className={BACK_BUTTON}>
          {t('common.back')}
        </button>
        <Link to="/settings" aria-label={t('common.settingsAria')} className={SETTINGS_BUTTON}>
          <img src={SETTINGS_ICON} alt="" className="h-7 w-7" />
        </Link>
      </div>
      </div>
    </div>
  );
}

export default LearningPage;
