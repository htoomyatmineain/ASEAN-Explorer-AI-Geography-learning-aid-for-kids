function RecommendedActivityCard({ recommendation }) {
  if (!recommendation) return null;

  return (
    <div className="rounded-xl bg-yellow-100 p-4">
      <p className="font-semibold">
        Weakest topic: <span className="capitalize">{recommendation.weakest_topic?.replace(/_/g, ' ')}</span>
      </p>
      <p>
        Try next:{' '}
        <span className="font-bold capitalize">
          {recommendation.recommended_activity?.replace(/_/g, ' ')}
        </span>
      </p>
    </div>
  );
}

export default RecommendedActivityCard;
