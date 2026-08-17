import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { GameProvider } from '../shared/state/GameContext';
import Layout from '../shared/components/Layout/Layout';
import { routes } from './routes';

function App() {
  return (
    <GameProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            {routes.map(({ path, element: Element }) => (
              <Route key={path} path={path} element={<Element />} />
            ))}
          </Routes>
        </Layout>
      </BrowserRouter>
    </GameProvider>
  );
}

export default App;
