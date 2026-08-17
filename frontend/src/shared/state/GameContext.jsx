import { createContext, useCallback, useContext, useState } from 'react';

// Shared score/progress state every feature reads or updates — the one piece
// of state that's genuinely cross-feature, so it lives in shared/, not in any
// single feature folder. See docs/02-asean-explorer-architecture.md §3.
const GameContext = createContext(null);

const initialScores = {
  countries_and_capitals: 0,
  neighboring_countries: 0,
  asean_membership: 0,
  flags_and_currencies: 0,
};

export function GameProvider({ children }) {
  const [scores, setScores] = useState(initialScores);

  const setTopicScore = useCallback((topic, score) => {
    setScores((prev) => ({ ...prev, [topic]: score }));
  }, []);

  const value = { scores, setTopicScore };
  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used inside a <GameProvider>');
  return ctx;
}
