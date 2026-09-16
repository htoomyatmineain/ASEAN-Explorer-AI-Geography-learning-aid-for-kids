import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { GameProvider } from '../shared/state/GameContext';
import { I18nProvider } from '../shared/i18n/I18nContext';
import Layout from '../features/main-menu/components/Layout';
import { routes } from './routes';

function App() {
  return (
    <I18nProvider>
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
    </I18nProvider>
  );
}

export default App;
