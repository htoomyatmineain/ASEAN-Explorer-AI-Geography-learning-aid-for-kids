import { useI18n } from '../../shared/i18n/I18nContext';

// Real settings UI starts here with the language switcher — sound/reset
// progress can grow into this same page later.
function SettingsPage() {
  const { locale, setLocale, t } = useI18n();

  return (
    <div className="flex min-h-[60vh] flex-col items-center gap-8 pt-10">
      <h1 className="text-3xl font-extrabold text-sky-600">{t('settings.title')}</h1>

      <div className="flex flex-col items-center gap-3">
        <p className="font-bold text-slate-700">{t('settings.language')}</p>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setLocale('en')}
            className={`rounded-full px-6 py-3 font-bold shadow-md transition-colors ${
              locale === 'en' ? 'bg-sky-500 text-white' : 'bg-slate-100 text-slate-700'
            }`}
          >
            {t('settings.languageEnglish')}
          </button>
          <button
            type="button"
            onClick={() => setLocale('my')}
            className={`rounded-full px-6 py-3 font-bold shadow-md transition-colors ${
              locale === 'my' ? 'bg-sky-500 text-white' : 'bg-slate-100 text-slate-700'
            }`}
          >
            {t('settings.languageMyanmar')}
          </button>
        </div>
      </div>
    </div>
  );
}

export default SettingsPage;
