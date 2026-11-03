import { useI18n } from '../../../shared/i18n/I18nContext';

// Placeholder — replace once level/2, unlocked_country/2, checkpoint_passed/2
// exist on the backend (see docs/04-asean-explorer-features.md "What's Still Open").
function ProgressMap() {
  const { t } = useI18n();
  return (
    <div className="rounded-2xl bg-slate-100 p-6 text-center text-slate-500">
      {t('journey.comingSoon')}
    </div>
  );
}

export default ProgressMap;
