import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { KIKO, FLAG_IMAGE_BY_COUNTRY } from '../guess-game/clueOptions';

const GAME_MODES = [
  {
    to: '/journey',
    label: 'Journey Mode',
    emoji: '🗺️',
    className: 'border-sky-600 bg-sky-400 shadow-[0_4px_0_0_rgb(2,132,199)]',
  },
  {
    to: '/guess',
    label: 'Guess the Country',
    // Guess the Country got its own mascot art ("Kiko" the parrot) — use it
    // here instead of a generic emoji so the card previews the actual game.
    image: KIKO.hello,
    imageAlt: 'Kiko the parrot mascot waving hello',
    className: 'border-lime-600 bg-lime-400 shadow-[0_4px_0_0_rgb(101,163,13)]',
  },
  {
    to: '/neighbors',
    label: 'Neighbor Quiz',
    emoji: '🧭',
    className: 'border-amber-600 bg-amber-400 shadow-[0_4px_0_0_rgb(217,119,6)]',
  },
  {
    to: '/capitals',
    label: 'Capital Match',
    // No dedicated mascot for this game yet, but it now shows real flags —
    // preview one here (Thailand, the round's first country) with a capital
    // badge instead of the plain 🏛️ emoji.
    flagPreview: 'thailand',
    className: 'border-rose-700 bg-rose-500 shadow-[0_4px_0_0_rgb(190,18,60)]',
  },
];

const ARROW_BUTTON =
  'flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-b-4 border-sky-600 bg-sky-400 text-2xl font-extrabold text-white shadow-[0_4px_0_0_rgb(2,132,199)] transition-transform duration-100 ease-out active:translate-y-[4px] active:border-b-0 active:shadow-none';

function PracticeSelectionPage() {
  const trackRef = useRef(null);

  const scrollByCard = (direction) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.firstElementChild;
    const distance = card ? card.getBoundingClientRect().width + 24 : track.clientWidth;
    track.scrollBy({ left: direction * distance, behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <h1 className="text-2xl font-extrabold uppercase tracking-wide text-white [text-shadow:_0_2px_4px_rgb(0_0_0_/_60%)]">
        Choose a Practice Mode
      </h1>
      <div className="flex w-full max-w-4xl items-center gap-3">
        <button type="button" onClick={() => scrollByCard(-1)} aria-label="Previous" className={ARROW_BUTTON}>
          ‹
        </button>
        <div
          ref={trackRef}
          className="flex flex-1 snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth px-1 py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {GAME_MODES.map((mode) => (
            <Link
              key={mode.to}
              to={mode.to}
              className={`flex w-56 shrink-0 snap-center flex-col items-center gap-3 rounded-2xl border-b-[5px] px-6 py-8 text-center text-white transition-transform duration-100 ease-out active:translate-y-[5px] active:border-b-0 active:shadow-none ${mode.className}`}
            >
              {mode.image ? (
                <img src={mode.image} alt={mode.imageAlt ?? ''} className="h-16 w-16 object-contain drop-shadow" />
              ) : mode.flagPreview ? (
                <span className="relative flex h-16 w-16 items-center justify-center">
                  <img
                    src={FLAG_IMAGE_BY_COUNTRY[mode.flagPreview]}
                    alt=""
                    className="h-11 w-16 rounded-md object-cover shadow"
                  />
                  <span className="absolute -bottom-1.5 -right-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-white text-base shadow">
                    🏛️
                  </span>
                </span>
              ) : (
                <span className="text-5xl">{mode.emoji}</span>
              )}
              <span className="text-lg font-extrabold uppercase tracking-wide [text-shadow:_0_2px_4px_rgb(0_0_0_/_60%)]">
                {mode.label}
              </span>
            </Link>
          ))}
        </div>
        <button type="button" onClick={() => scrollByCard(1)} aria-label="Next" className={ARROW_BUTTON}>
          ›
        </button>
      </div>
    </div>
  );
}

export default PracticeSelectionPage;
