import { Link, useNavigate } from 'react-router-dom';
import CapitalMatchGame from './components/CapitalMatchGame';

// Same asset as the entrance page's logo (frontend/src/features/home/Home.page.jsx)
// — filename has a space, so it stays percent-encoded.
const LOGO_IMAGE = '/assets/logo/ASEAN%20explorer.png';
// Same background as the shared Layout (frontend/src/features/main-menu/components/Layout.jsx).
const BACKGROUND_IMAGE = '/assets/background/learning.png';

const BACK_BUTTON =
  'flex shrink-0 items-center justify-center gap-2 rounded-xl border-b-4 border-rose-700 bg-rose-500 px-4 py-2 text-white [text-shadow:_0_2px_4px_rgb(0_0_0_/_60%)] shadow-[0_3px_0_0_rgb(190,18,60)] transition-transform duration-100 ease-out active:translate-y-[3px] active:border-b-0 active:shadow-none';

// Dedicated page for Match the Capitals (route is `bare`, so this owns the
// whole screen: background, header and back button) — mirrors the Neighbor
// Quiz page layout so both Person 4 games read as their own screens. Its URL
// (/capitals) can also be opened directly in a new browser tab.
function CapitalMatchPage() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen">
      {/* Background layers copied from the shared Layout — kept inline because
          this page is `bare` and renders without that Layout. */}
      <div
        className="fixed inset-0 -z-10 bg-cover bg-no-repeat"
        style={{ backgroundImage: `url('${BACKGROUND_IMAGE}')`, backgroundPosition: 'center bottom' }}
      />
      <div className="fixed inset-0 -z-10 bg-black/50" />

      <header className="relative flex items-center justify-between gap-4 px-6 py-3">
        <Link to="/main-menu">
          <img src={LOGO_IMAGE} alt="ASEAN Explorer" className="h-14 w-auto drop-shadow-lg" />
        </Link>
        <span className="absolute left-1/2 hidden -translate-x-1/2 text-3xl font-extrabold uppercase tracking-wide text-white [text-shadow:_0_2px_4px_rgb(0_0_0_/_60%)] md:block">
          Match the Capitals
        </span>
        <button type="button" onClick={() => navigate('/practice')} className={BACK_BUTTON}>
          ← Practice
        </button>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-8">
        <CapitalMatchGame />
      </main>
    </div>
  );
}

export default CapitalMatchPage;
