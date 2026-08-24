import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { GameProvider } from '../shared/state/GameContext';
import Layout from '../shared/components/Layout/Layout';
import { routes } from './routes';

function App() {
  return (
    <GameProvider>
      <BrowserRouter>
        <Routes>
          {routes.map(({ path, element: Element, bare }) => (
            <Route
              key={path}
              path={path}
              element={bare ? <Element /> : <Layout><Element /></Layout>}
            />
          ))}
        </Routes>
      </BrowserRouter>
    </GameProvider>
  );
}

export default App;
