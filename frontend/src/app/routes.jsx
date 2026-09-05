import HomePage from '../features/home/Home.page';
import MainMenuPage from '../features/main-menu/MainMenu.page';
import PracticeSelectionPage from '../features/practice-selection/PracticeSelection.page';
import LearningPage from '../features/learning/Learning.page';
import JourneyPage from '../features/journey-mode/Journey.page';
import GuessCountryPage from '../features/guess-game/GuessCountry.page';
import NeighborQuizPage from '../features/neighbor-game/NeighborQuiz.page';
import CapitalMatchPage from '../features/capital-match/CapitalMatch.page';
import DashboardPage from '../features/dashboard/Dashboard.page';
import SettingsPage from '../features/settings/Settings.page';

// One entry per feature page — adding a feature means adding one line here,
// not editing a shared router file's internals.
// `bare: true` skips the shared header/nav Layout — for full-bleed screens
// like the entrance page.
export const routes = [
  { path: '/', element: HomePage, bare: true },
  { path: '/main-menu', element: MainMenuPage },
  { path: '/practice', element: PracticeSelectionPage },
  // bare: true — these pages build their own full-page header/layout instead
  // of the shared slim-header Layout, so each reads as its own dedicated
  // screen (and can be opened straight in a new browser tab via its URL).
  { path: '/explore', element: LearningPage, bare: true },
  { path: '/journey', element: JourneyPage },
  { path: '/guess', element: GuessCountryPage },
  { path: '/neighbors', element: NeighborQuizPage, bare: true },
  { path: '/capitals', element: CapitalMatchPage, bare: true },
  { path: '/dashboard', element: DashboardPage },
  { path: '/settings', element: SettingsPage },
];
