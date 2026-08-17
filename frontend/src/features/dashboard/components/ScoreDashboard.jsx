import { useEffect, useState } from 'react';
import Card from '../../../shared/components/Card/Card';
import TopicScoreBar from './TopicScoreBar';
import RecommendedActivityCard from './RecommendedActivityCard';
import { getAllScores, getRecommendation } from '../dashboardApi';

function ScoreDashboard() {
  const [scores, setScores] = useState([]);
  const [recommendation, setRecommendation] = useState(null);

  useEffect(() => {
    getAllScores().then((res) => setScores(res.scores));
    getRecommendation().then(setRecommendation).catch(() => setRecommendation(null));
  }, []);

  return (
    <Card className="flex flex-col gap-4">
      {scores.map(({ topic, score }) => (
        <TopicScoreBar key={topic} topic={topic} score={score} />
      ))}
      <RecommendedActivityCard recommendation={recommendation} />
    </Card>
  );
}

export default ScoreDashboard;
