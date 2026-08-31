import React, { createContext, useState, useContext } from 'react';

const GameContext = createContext();

export const GameProvider = ({ children }) => {
  const [scores, setScores] = useState({
    countries_and_capitals: 0,
    neighboring_countries: 0,
    asean_membership: 0,
    flags_and_currencies: 0,
  });

  const [selectedCountry, setSelectedCountry] = useState(null);
  const [activeGameState, setActiveGameState] = useState(null);
  const [weakestTopic, setWeakestTopic] = useState('none');
  const [recommendedActivity, setRecommendedActivity] = useState('explore_asean_game');

  const updateScore = (topic, newScore) => {
    setScores(prev => ({ ...prev, [topic]: newScore }));
  };

  const value = {
    scores,
    updateScore,
    selectedCountry,
    setSelectedCountry,
    activeGameState,
    setActiveGameState,
    weakestTopic,
    setWeakestTopic,
    recommendedActivity,
    setRecommendedActivity,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

export const useGame = () => useContext(GameContext);
