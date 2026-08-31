import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GameProvider } from './state/GameContext';
import Home from './pages/Home';
import ExploreASEAN from './pages/ExploreASEAN';
import GuessCountry from './pages/GuessCountry';
import NeighborQuiz from './pages/NeighborQuiz';
import CapitalMatch from './pages/CapitalMatch';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <GameProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/explore" element={<ExploreASEAN />} />
          <Route path="/guess" element={<GuessCountry />} />
          <Route path="/neighbor" element={<NeighborQuiz />} />
          <Route path="/capital" element={<CapitalMatch />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Router>
    </GameProvider>
  );
}

export default App;
