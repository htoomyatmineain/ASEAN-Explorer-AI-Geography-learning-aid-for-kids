import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

const LOGO_IMAGE = '/assets/logo/ASEAN%20explorer.png';
// Same background photo + dark scrim as the main menu (Layout.jsx) instead
// of this page's own gradient, for a consistent look across menu pages.
const BACKGROUND_IMAGE = '/assets/background/learning.png';

// Each illustrated card already has its own title art baked in, so the
// card just frames that image — no separate icon/emoji/text layer needed.
const GAME_MODES = [
  {
    to: '/guess',
    label: 'Guess the Country',
    cardImage: '/assets/background/practice-card-1.png',
    className: 'border-lime-600 shadow-[0_6px_0_0_rgb(101,163,13)]',
  },
  {
    to: '/neighbors',
    label: 'Neighbor Quiz',
    cardImage: '/assets/background/practice-card-2.png',
    className: 'border-amber-600 shadow-[0_6px_0_0_rgb(217,119,6)]',
  },
  {
    to: '/capitals',
    label: 'Capital Match',
    cardImage: '/assets/background/practice-card-3.png',
    className: 'border-rose-700 shadow-[0_6px_0_0_rgb(190,18,60)]',
  },
];

const NAV_ARROW =
  'flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border-b-4 border-sky-600 bg-sky-400 text-3xl font-extrabold text-white shadow-[0_5px_0_0_rgb(2,132,199)] transition-transform duration-100 ease-out active:translate-y-[5px] active:border-b-0 active:shadow-none';

const BACK_BUTTON =
  'flex shrink-0 items-center justify-center gap-2 rounded-xl border-b-4 border-rose-700 bg-rose-500 px-6 py-3.5 text-xl font-extrabold uppercase tracking-wide text-white [text-shadow:_0_2px_4px_rgb(0_0_0_/_60%)] shadow-[0_3px_0_0_rgb(190,18,60)] transition-transform duration-100 ease-out active:translate-y-[3px] active:border-b-0 active:shadow-none';

// Dedicated page (route is `bare`) — own header, own background, no shared
// nav. One big card at a time instead of a small scrolling strip.
function PracticeSelectionPage() {
  const [index, setIndex] = useState(0);
  const navigate = useNavigate();

  const goTo = (direction) => {
    setIndex((current) => (current + direction + GAME_MODES.length) % GAME_MODES.length);
  };

  const mode = GAME_MODES[index];

  return (
    <div className="relative flex h-screen flex-col overflow-hidden">
      <div
        className="absolute inset-0 -z-10 bg-cover bg-no-repeat"
        style={{ backgroundImage: `url('${BACKGROUND_IMAGE}')`, backgroundPosition: 'center bottom' }}
      />
      <div className="absolute inset-0 -z-10 bg-black/50" />

      <header className="relative z-20 flex shrink-0 items-center px-6 py-4">
        <Link to="/main-menu">
          <img src={LOGO_IMAGE} alt="ASEAN Explorer" className="h-16 w-auto drop-shadow" />
        </Link>
      </header>

      <main className="relative z-10 flex flex-1 flex-col items-center justify-center gap-8 px-6 pb-8 pt-2">
        <div className="flex w-full max-w-5xl items-center justify-center gap-4 sm:gap-8">
          <button type="button" onClick={() => goTo(-1)} aria-label="Previous" className={NAV_ARROW}>
            ‹
          </button>

          <div className="relative h-[58vh] w-full max-w-2xl overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={mode.to}
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.92 }}
                transition={{ type: 'spring', stiffness: 260, damping: 24 }}
                className="absolute inset-0"
              >
                <Link
                  to={mode.to}
                  className={`block h-full w-full overflow-hidden rounded-[2.5rem] border-b-[10px] transition-transform duration-100 ease-out active:translate-y-2 active:border-b-0 active:shadow-none ${mode.className}`}
                >
                  <img src={mode.cardImage} alt={mode.label} className="h-full w-full object-cover" />
                </Link>
              </motion.div>
            </AnimatePresence>
          </div>

          <button type="button" onClick={() => goTo(1)} aria-label="Next" className={NAV_ARROW}>
            ›
          </button>
        </div>

        <motion.h1
          animate={{ opacity: [1, 0.25, 1] }}
          transition={{ repeat: Infinity, duration: 1.4, ease: 'easeInOut' }}
          className="font-comic text-center text-sm uppercase tracking-wide text-white [text-shadow:_0_2px_4px_rgb(0_0_0_/_60%)] sm:text-lg"
        >
          Please Choose a Practice Mode....
        </motion.h1>
      </main>

      <div className="absolute bottom-4 right-4 z-20 flex items-center gap-3">
        <button type="button" onClick={() => navigate('/main-menu')} className={BACK_BUTTON}>
          Back
        </button>
      </div>
    </div>
  );
}

export default PracticeSelectionPage;
