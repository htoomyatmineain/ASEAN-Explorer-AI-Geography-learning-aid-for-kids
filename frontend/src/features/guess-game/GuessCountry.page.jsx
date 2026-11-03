import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import GuessGame from './components/GuessGame';
import { useI18n } from '../../shared/i18n/I18nContext';

// Same asset as the entrance page's logo (frontend/src/features/home/Home.page.jsx)
// — filename has a space, so it stays percent-encoded.
const LOGO_IMAGE = '/assets/logo/ASEAN%20explorer.png';
// Same background as the shared Layout (frontend/src/features/main-menu/components/Layout.jsx).
const BACKGROUND_IMAGE = '/assets/background/learning.png';

const BACK_BUTTON =
  'flex shrink-0 items-center justify-center gap-2 rounded-xl border-b-4 border-rose-700 bg-rose-500 px-6 py-3.5 text-xl font-extrabold uppercase tracking-wide text-white [text-shadow:_0_2px_4px_rgb(0_0_0_/_60%)] shadow-[0_3px_0_0_rgb(190,18,60)] transition-transform duration-100 ease-out active:translate-y-[3px] active:border-b-0 active:shadow-none';

// Dedicated page for Guess the Country (route is `bare`, so this owns the
// whole screen: background, header and back button) — mirrors the Neighbor
// Quiz / Capital Match pages so all practice modes read as their own
// screens. Its URL (/guess) can also be opened directly in a new browser tab.
function GuessCountryPage() {
  const navigate = useNavigate();
  const { t } = useI18n();

  return (
    <div className="relative min-h-screen">
      {/* Background layers copied from the shared Layout — kept inline because
          this page is `bare` and renders without that Layout. */}
      <div
        className="fixed inset-0 -z-10 bg-cover bg-no-repeat"
        style={{ backgroundImage: `url('${BACKGROUND_IMAGE}')`, backgroundPosition: 'center bottom' }}
      />
      <div className="fixed inset-0 -z-10 bg-black/50" />

      <header className="relative flex items-center gap-4 px-6 py-3">
        <Link to="/main-menu">
          <img src={LOGO_IMAGE} alt="ASEAN Explorer" className="h-14 w-auto drop-shadow-lg" />
        </Link>
      </header>

      <div className="fixed bottom-4 right-4 z-20">
        <button type="button" onClick={() => navigate('/practice')} className={BACK_BUTTON}>
          {t('common.back')}
        </button>
      </div>

      <main className="mx-auto max-w-3xl px-6 py-8">
        <div className="flex flex-col gap-6">
          <div
            className="relative flex flex-wrap items-center gap-4 overflow-hidden rounded-[24px] px-6 py-5"
            style={{
              backgroundImage: "url('/assets/guess-game/learning-bg.png')",
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div className="absolute inset-0 bg-white/55" aria-hidden="true" />
            <motion.span
              className="relative text-5xl leading-none"
              aria-hidden="true"
              animate={{ rotate: [-6, 6, -6] }}
              transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut' }}
            >
              🧭
            </motion.span>
            <div className="relative">
              <h1 className="m-0 text-4xl font-extrabold leading-tight text-[#7c2d12]">
                {t('guess.title')}
              </h1>
              <p className="mt-0.5 text-xl font-semibold text-[#a16207]">
                {t('guess.subtitle')}
              </p>
            </div>
          </div>
          <GuessGame />
        </div>
      </main>
    </div>
  );
}

export default GuessCountryPage;
