import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { GameProvider } from './state/GameContext';

// Import your components (Person #4)
import NeighborGame from './features/neighbor-game/NeighborGame';
import CapitalMatchGame from './features/capital-match/CapitalMatchGame';

// (Other features can be imported later by other teammates)

function App() {
  return (
    <GameProvider>
      <BrowserRouter>
        {/* Simple navigation bar */}
        <nav className="p-4 bg-gray-100 shadow-sm flex gap-4 flex-wrap items-center">
          <Link to="/" className="text-blue-600 hover:underline font-medium">🏠 Home</Link>
          <Link to="/explore" className="text-blue-600 hover:underline">🗺️ Explore</Link>
          <Link to="/guess" className="text-blue-600 hover:underline">🔍 Guess</Link>
          <Link to="/neighbor-quiz" className="text-blue-600 hover:underline">🤝 Neighbors</Link>
          <Link to="/capital-match" className="text-blue-600 hover:underline">🏙️ Capitals</Link>
          <Link to="/dashboard" className="text-blue-600 hover:underline">📊 Dashboard</Link>
        </nav>

        <div className="container mx-auto p-4">
          <Routes>
            {/* Home page placeholder */}
            <Route path="/" element={<div className="text-center text-2xl font-bold mt-10">🌏 ASEAN Explorer</div>} />

            {/* Other team members' pages (placeholders) */}
            <Route path="/explore" element={<div className="p-4">🗺️ Explore ASEAN – (Person 2)</div>} />
            <Route path="/guess" element={<div className="p-4">🔍 Guess the Country – (Person 3)</div>} />

            {/* ========== YOUR ROUTES (Person #4) ========== */}
            <Route path="/neighbor-quiz" element={<NeighborGame />} />
            <Route path="/capital-match" element={<CapitalMatchGame />} />

            {/* Dashboard placeholder (Person #5) */}
            <Route path="/dashboard" element={<div className="p-4">📊 Dashboard & Explanations – (Person 5)</div>} />
          </Routes>
        </div>
      </BrowserRouter>
    </GameProvider>
  );
}

export default App;