import { useEffect, useState } from 'react';
import Card from '../../../shared/components/Card/Card';
import TopicScoreBar from './TopicScoreBar';
import RecommendedActivityCard from './RecommendedActivityCard';
import { getAllScores, getRecommendation } from '../dashboardApi';
import { useI18n } from '../../../shared/i18n/I18nContext';

// Overall = average of the recorded topic scores, rounded for display.
function averageScore(scores) {
  if (!scores.length) return null;
  const total = scores.reduce((sum, { score }) => sum + score, 0);
  return Math.round(total / scores.length);
}

function ScoreDashboard() {
  const { t } = useI18n();
  // null = still loading; [] = loaded with nothing recorded yet.
  const [scores, setScores] = useState(null);
  const [recommendation, setRecommendation] = useState(null);

  useEffect(() => {
    getAllScores()
      .then((res) => setScores(res.scores ?? []))
      .catch(() => setScores([]));
    getRecommendation().then(setRecommendation).catch(() => setRecommendation(null));
  }, []);

  const overall = scores ? averageScore(scores) : null;

  return (
    <Card className="flex flex-col gap-4">
      {scores === null ? (
        <p className="m-0 text-center text-lg font-semibold text-stone-500">
          {t('dashboard.loading')}
        </p>
      ) : scores.length === 0 ? (
        <p className="m-0 text-center text-lg font-semibold text-stone-500">
          {t('dashboard.empty')}
        </p>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <h2 className="m-0 text-lg font-extrabold text-stone-800">{t('dashboard.topicScores')}</h2>
            <span className="rounded-full bg-sky-100 px-3 py-1 text-sm font-extrabold text-sky-700">
              {t('dashboard.overall', { percent: overall })}
            </span>
          </div>
          {scores.map(({ topic, score }) => (
            <TopicScoreBar key={topic} topic={topic} score={score} />
          ))}
        </>
      )}
      <RecommendedActivityCard recommendation={recommendation} />
    </Card>
  );
}

export default ScoreDashboard;
