import { Link } from 'react-router-dom';

// Backend activity atom -> app route (backend/prolog/features/dashboard/session.pl).
const ROUTE_BY_ACTIVITY = {
  match_the_capitals_game: '/capitals',
  who_is_my_neighbor_game: '/neighbors',
  guess_the_country_game: '/guess',
  explore_asean_game: '/explore',
};

function RecommendedActivityCard({ recommendation }) {
  if (!recommendation) return null;

  const route = ROUTE_BY_ACTIVITY[recommendation.recommended_activity];

  return (
    <div className="flex flex-col gap-3 rounded-xl bg-yellow-100 p-4">
      <div>
        <p className="m-0 font-semibold text-stone-800">
          Weakest topic:{' '}
          <span className="capitalize">{recommendation.weakest_topic?.replace(/_/g, ' ')}</span>
        </p>
        <p className="m-0 text-stone-700">
          Try next:{' '}
          <span className="font-bold capitalize">
            {recommendation.recommended_activity?.replace(/_/g, ' ')}
          </span>
        </p>
      </div>
      {route && (
        <Link
          to={route}
          className="self-start rounded-full bg-sky-500 px-5 py-2 font-extrabold text-white shadow-[0_5px_0_#0369a1] transition-transform hover:-translate-y-0.5 active:translate-y-[3px] active:shadow-none"
        >
          ▶ Play now
        </Link>
      )}
    </div>
  );
}

export default RecommendedActivityCard;
