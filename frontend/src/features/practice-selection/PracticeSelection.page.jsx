import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { KIKO, FLAG_IMAGE_BY_COUNTRY } from '../guess-game/clueOptions';

const LOGO_IMAGE = '/assets/logo/ASEAN%20explorer.png';
const SETTINGS_ICON = '/assets/icons/nav-03.png';

const GAME_MODES = [
  {
    to: '/journey',
    label: 'Journey Mode',
    emoji: '🗺️',
    className: 'border-sky-600 bg-sky-400 shadow-[0_6px_0_0_rgb(2,132,199)]',
  },
  {
    to: '/guess',
    label: 'Guess the Country',
    image: KIKO.hello,
    imageAlt: 'Kiko the parrot mascot waving hello',
    className: 'border-lime-600 bg-lime-400 shadow-[0_6px_0_0_rgb(101,163,13)]',
  },
  {
    to: '/neighbors',
    label: 'Neighbor Quiz',
    emoji: '🧭',
    className: 'border-amber-600 bg-amber-400 shadow-[0_6px_0_0_rgb(217,119,6)]',
  },
  {
    to: '/capitals',
    label: 'Capital Match',
    flagPreview: 'thailand',
    className: 'border-rose-700 bg-rose-500 shadow-[0_6px_0_0_rgb(190,18,60)]',
  },
];

// Floating pencils/books drifting behind the cards — purely decorative, kept
// out of the tab order and out of hit-testing.
const FLOATING_ICONS = [
  { emoji: '📖', top: '8%', left: '6%', size: '3.5rem', duration: '9s', delay: '0s', driftX: '30px', rotate: '10deg' },
  { emoji: '✏️', top: '18%', left: '85%', size: '3rem', duration: '7s', delay: '0.5s', driftX: '-24px', rotate: '-14deg' },
  { emoji: '📚', top: '70%', left: '10%', size: '4rem', duration: '10s', delay: '1s', driftX: '20px', rotate: '8deg' },
  { emoji: '📝', top: '78%', left: '80%', size: '3rem', duration: '8s', delay: '0.3s', driftX: '-18px', rotate: '-10deg' },
  { emoji: '🖍️', top: '40%', left: '92%', size: '3rem', duration: '11s', delay: '1.4s', driftX: '-22px', rotate: '16deg' },
  { emoji: '🔖', top: '50%', left: '3%', size: '3rem', duration: '9s', delay: '0.8s', driftX: '26px', rotate: '-8deg' },
  { emoji: '📏', top: '10%', left: '45%', size: '2.5rem', duration: '8s', delay: '1.1s', driftX: '18px', rotate: '12deg' },
];

const NAV_ARROW =
  'flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border-b-4 border-sky-600 bg-sky-400 text-3xl font-extrabold text-white shadow-[0_5px_0_0_rgb(2,132,199)] transition-transform duration-100 ease-out active:translate-y-[5px] active:border-b-0 active:shadow-none';

const BACK_BUTTON =
  'flex shrink-0 items-center justify-center gap-2 rounded-xl border-b-4 border-rose-700 bg-rose-500 px-5 py-3 font-comic font-bold text-white [text-shadow:_0_2px_4px_rgb(0_0_0_/_60%)] shadow-[0_3px_0_0_rgb(190,18,60)] transition-transform duration-100 ease-out active:translate-y-[3px] active:border-b-0 active:shadow-none';

const SETTINGS_BUTTON =
  'flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-xl border-b-4 border-lime-600 bg-lime-400 shadow-[0_3px_0_0_rgb(101,163,13)] transition-transform duration-100 ease-out active:translate-y-[3px] active:border-b-0 active:shadow-none';

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
    <div className="relative flex h-screen flex-col overflow-hidden bg-gradient-to-b from-amber-200 via-yellow-300 to-amber-300">
      {FLOATING_ICONS.map((icon, i) => (
        <span
          key={i}
          aria-hidden="true"
          className="floating-icon pointer-events-none absolute select-none opacity-40"
          style={{
            top: icon.top,
            left: icon.left,
            fontSize: icon.size,
            animationDuration: icon.duration,
            animationDelay: icon.delay,
            '--drift-x': icon.driftX,
            '--drift-rotate': icon.rotate,
          }}
        >
          {icon.emoji}
        </span>
      ))}

      <header className="relative z-20 flex shrink-0 items-center px-6 py-4">
        <Link to="/main-menu">
          <img src={LOGO_IMAGE} alt="ASEAN Explorer" className="h-16 w-auto drop-shadow" />
        </Link>
      </header>

      <main className="relative z-10 flex flex-1 flex-col items-center justify-center gap-8 px-6 pb-8">
        <h1 className="font-display text-center text-4xl uppercase tracking-wide text-amber-900 [text-shadow:_0_2px_0_rgb(255_255_255_/_50%)] sm:text-6xl">
          Choose a Practice Mode
        </h1>

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
                  className={`flex h-full w-full flex-col items-center justify-center gap-8 rounded-[2.5rem] border-b-[10px] text-center text-white transition-transform duration-100 ease-out active:translate-y-2 active:border-b-0 active:shadow-none ${mode.className}`}
                >
                  {mode.image ? (
                    <img src={mode.image} alt={mode.imageAlt ?? ''} className="h-40 w-40 object-contain drop-shadow-lg" />
                  ) : mode.flagPreview ? (
                    <span className="relative flex h-40 w-40 items-center justify-center">
                      <img
                        src={FLAG_IMAGE_BY_COUNTRY[mode.flagPreview]}
                        alt=""
                        className="h-28 w-40 rounded-xl object-cover shadow-lg"
                      />
                      <span className="absolute -bottom-3 -right-3 flex h-14 w-14 items-center justify-center rounded-full bg-white text-3xl shadow">
                        🏛️
                      </span>
                    </span>
                  ) : (
                    <span className="text-9xl">{mode.emoji}</span>
                  )}
                  <span className="font-display text-3xl uppercase tracking-wide [text-shadow:_0_2px_4px_rgb(0_0_0_/_60%)] sm:text-4xl">
                    {mode.label}
                  </span>
                </Link>
              </motion.div>
            </AnimatePresence>
          </div>

          <button type="button" onClick={() => goTo(1)} aria-label="Next" className={NAV_ARROW}>
            ›
          </button>
        </div>
      </main>

      <div className="absolute bottom-4 right-4 z-20 flex items-center gap-3">
        <button type="button" onClick={() => navigate('/main-menu')} className={BACK_BUTTON}>
          ← Back
        </button>
        <Link to="/settings" aria-label="Settings" className={SETTINGS_BUTTON}>
          <img src={SETTINGS_ICON} alt="" className="h-7 w-7" />
        </Link>
      </div>
    </div>
  );
}

export default PracticeSelectionPage;
