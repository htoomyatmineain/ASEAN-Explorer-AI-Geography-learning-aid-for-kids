import { Link, useNavigate } from 'react-router-dom';
import { useI18n } from '../../shared/i18n/I18nContext';

const LOGO_IMAGE = '/assets/logo/ASEAN%20explorer.png';
const SETTINGS_ICON = '/assets/icons/settings.png';
// Same background photo + dark scrim as the main menu (Layout.jsx) and the
// other bare pages, for a consistent look across menu-level screens.
const BACKGROUND_IMAGE = '/assets/background/learning.png';

const BACK_BUTTON =
  'flex shrink-0 items-center justify-center gap-2 rounded-xl border-b-4 border-rose-700 bg-rose-500 px-6 py-3.5 text-xl font-extrabold uppercase tracking-wide text-white [text-shadow:_0_2px_4px_rgb(0_0_0_/_60%)] shadow-[0_3px_0_0_rgb(190,18,60)] transition-transform duration-100 ease-out active:translate-y-[3px] active:border-b-0 active:shadow-none';

const SETTINGS_BUTTON =
  'flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-xl border-b-4 border-lime-600 bg-lime-400 shadow-[0_3px_0_0_rgb(101,163,13)] transition-transform duration-100 ease-out active:translate-y-[3px] active:border-b-0 active:shadow-none';

// A single sliding pill (like a big toy switch) instead of two separate
// buttons — the highlight glides between languages rather than two buttons
// independently swapping color, which reads as more "cartoon toggle" than
// "pair of filter chips".
function LanguageToggle({ locale, setLocale, t }) {
  const isMyanmar = locale === 'my';
  return (
    <div className="relative flex w-full rounded-full border-4 border-sky-500 bg-white p-1.5 shadow-inner">
      <div
        className="absolute inset-y-1.5 w-[calc(50%-0.375rem)] rounded-full bg-sky-400 shadow-[0_3px_0_0_rgb(2,132,199)] transition-transform duration-300 ease-out"
        style={{ transform: isMyanmar ? 'translateX(calc(100% + 0.75rem))' : 'translateX(0)' }}
      />
      <button
        type="button"
        onClick={() => setLocale('en')}
        className={`relative z-10 flex-1 rounded-full py-3 font-comic font-bold transition-colors ${
          isMyanmar ? 'text-slate-400' : 'text-white'
        }`}
      >
        {t('settings.languageEnglish')}
      </button>
      <button
        type="button"
        onClick={() => setLocale('my')}
        className={`relative z-10 flex-1 rounded-full py-3 font-comic font-bold transition-colors ${
          isMyanmar ? 'text-white' : 'text-slate-400'
        }`}
      >
        {t('settings.languageMyanmar')}
      </button>
    </div>
  );
}

// Dedicated page (route is `bare`) — own header, own background, no shared
// nav, matching Learning/PracticeSelection's pattern instead of the header
// used by menu-level pages.
function SettingsPage() {
  const { locale, setLocale, t } = useI18n();
  const navigate = useNavigate();

  return (
    <div className="relative flex h-screen flex-col overflow-hidden">
      <div
        className="absolute inset-0 -z-10 bg-cover bg-no-repeat"
        style={{ backgroundImage: `url('${BACKGROUND_IMAGE}')`, backgroundPosition: 'center bottom' }}
      />
      <div className="absolute inset-0 -z-10 bg-black/50" />

      <header className="relative z-20 flex shrink-0 items-center px-6 py-4">
        <Link to="/main-menu">
          <img src={LOGO_IMAGE} alt="ASEAN Explorer" className="h-16 w-auto drop-shadow" />
        </Link>
      </header>

      <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-6">
        <div className="w-full max-w-sm rounded-[2rem] border-4 border-sky-400 bg-white/95 p-6 shadow-[0_6px_0_0_rgb(2,132,199)]">
          <h1 className="mb-5 text-center text-3xl font-extrabold uppercase tracking-wide text-sky-600">
            {t('settings.title')}
          </h1>

          <div className="flex items-center gap-4">
            <p className="shrink-0 font-comic text-lg font-bold text-slate-700">{t('settings.language')}</p>
            <LanguageToggle locale={locale} setLocale={setLocale} t={t} />
          </div>
        </div>
      </main>

      <div className="absolute bottom-4 right-4 z-20 flex items-center gap-3">
        <button type="button" onClick={() => navigate('/main-menu')} className={BACK_BUTTON}>
          {t('common.back')}
        </button>
        <Link to="/settings" aria-label={t('common.settingsAria')} className={SETTINGS_BUTTON}>
          <img src={SETTINGS_ICON} alt="" className="h-7 w-7" />
        </Link>
      </div>
    </div>
  );
}

export default SettingsPage;
