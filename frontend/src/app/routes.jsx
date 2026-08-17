import HomePage from '../features/home/Home.page';
import ExploreASEANPage from '../features/explore-map/ExploreASEAN.page';
import JourneyPage from '../features/journey-mode/Journey.page';
import GuessCountryPage from '../features/guess-game/GuessCountry.page';
import NeighborQuizPage from '../features/neighbor-game/NeighborQuiz.page';
import CapitalMatchPage from '../features/capital-match/CapitalMatch.page';
import DashboardPage from '../features/dashboard/Dashboard.page';

// One entry per feature page — adding a feature means adding one line here,
// not editing a shared router file's internals.
export const routes = [
  { path: '/', element: HomePage },
  { path: '/explore', element: ExploreASEANPage },
  { path: '/journey', element: JourneyPage },
  { path: '/guess', element: GuessCountryPage },
  { path: '/neighbors', element: NeighborQuizPage },
  { path: '/capitals', element: CapitalMatchPage },
  { path: '/dashboard', element: DashboardPage },
];
