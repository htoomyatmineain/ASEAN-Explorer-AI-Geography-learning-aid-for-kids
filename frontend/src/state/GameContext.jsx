import React, { createContext, useState, useContext } from 'react';

const GameContext = createContext();

export const GameProvider = ({ children }) => {
  const [scores, setScores] = useState({
    explore: 0,
    guessCountry: 0,
    neighborQuiz: 0,
    capitalMatch: 0,
  });

  const [selectedCountry, setSelectedCountry] = useState(null);
  const [activeGameState, setActiveGameState] = useState(null);
  const [weakestTopic, setWeakestTopic] = useState('none');
  const [recommendedActivity, setRecommendedActivity] = useState('ExploreASEAN');

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
