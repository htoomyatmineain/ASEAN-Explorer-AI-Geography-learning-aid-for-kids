import ScoreDashboard from './components/ScoreDashboard';
import { useI18n } from '../../shared/i18n/I18nContext';

function DashboardPage() {
  const { t } = useI18n();
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-extrabold text-sky-600">{t('dashboard.title')}</h1>
      <ScoreDashboard />
    </div>
  );
}

export default DashboardPage;
