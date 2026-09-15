import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getCountryInfo, getNeighbors } from '../learningApi';
import { FLAG_IMAGE_BY_COUNTRY } from '../../guess-game/clueOptions';

// A single fact row, e.g. "Capital: Hanoi" — data always comes from the
// Prolog knowledge base's country_info/2 response, never hardcoded here.
function InfoRow({ label, value }) {
  return (
    <p className="font-comic text-lg text-slate-700">
      <span className="font-bold text-slate-900">{label}:</span> <span className="capitalize">{value}</span>
    </p>
  );
}

const humanize = (s) => String(s).replace(/_/g, ' ');
const listOrNone = (arr) => (arr?.length > 0 ? arr.map(humanize).join(', ') : 'none listed');

// Slash commands answered straight from the /country/:name card already
// loaded above — no extra request needed for these.
const CARD_COMMANDS = {
  capital: (card) => humanize(card.capital),
  currency: (card) => humanize(card.currency),
  region: (card) => humanize(card.region),
  animals: (card) => listOrNone(card.animals),
  foods: (card) => listOrNone(card.foods),
  famous: (card) => listOrNone(card.famous_for),
};

const HELP_TEXT = 'Try /neighbors, /capital, /currency, /region, /animals, or /foods.';

// Slash commands hit real Prolog-backed data (the card already in hand, or
// GET /neighbors/:name); free-form text just gets a nudge toward them for now.
function AskAboutCountry({ card }) {
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState('');
  const countryLabel = humanize(card.country);

  async function handleSubmit(e) {
    e.preventDefault();
    const question = draft.trim();
    if (!question) return;
    setMessages((prev) => [...prev, { role: 'user', text: question }]);
    setDraft('');

    if (!question.startsWith('/')) {
      setMessages((prev) => [
        ...prev,
        { role: 'ai', text: `Free-form chat is coming soon — ${HELP_TEXT}` },
      ]);
      return;
    }

    const command = question.slice(1).trim().toLowerCase();
    if (command === 'neighbors') {
      const { neighbors } = await getNeighbors(card.country);
      const text = neighbors.length ? neighbors.map(humanize).join(', ') : 'No bordering countries on record.';
      setMessages((prev) => [...prev, { role: 'ai', text }]);
      return;
    }
    if (CARD_COMMANDS[command]) {
      setMessages((prev) => [...prev, { role: 'ai', text: CARD_COMMANDS[command](card) }]);
      return;
    }
    setMessages((prev) => [...prev, { role: 'ai', text: HELP_TEXT }]);
  }

  return (
    <div className="mt-2 w-full text-left">
      <p className="font-comic text-lg font-bold text-slate-900">
        Ask about {countryLabel}:
      </p>
      {messages.length > 0 && (
        <div className="mt-2 flex max-h-40 flex-col gap-2 overflow-y-auto rounded-2xl bg-slate-50 p-3">
          {messages.map((m, i) => (
            <p key={i} className="font-comic text-sm text-slate-700">
              <span className="font-bold text-sky-700">{m.role === 'user' ? 'You' : 'Kiko'}:</span> {m.text}
            </p>
          ))}
        </div>
      )}
      <form onSubmit={handleSubmit} className="mt-2 flex gap-2">
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Try /neighbors"
          className="flex-1 rounded-full border border-slate-200 px-4 py-2 font-comic text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-300"
        />
        <button
          type="submit"
          className="rounded-full bg-sky-500 px-4 py-2 font-comic text-sm font-bold text-white hover:bg-sky-600"
        >
          Ask
        </button>
      </form>
    </div>
  );
}

// Floats over the left side of the map with a gap on every edge (see
// Learning.page.jsx, which positions this panel and shifts/zooms the map to
// make room for it) — not flush against the screen, so it's rounded on all
// four corners rather than just the inner edge.
function CountryDetailPanel({ countryName, onClose }) {
  const [card, setCard] = useState(null);

  useEffect(() => {
    setCard(null);
    if (!countryName) return;
    getCountryInfo(countryName).then(setCard);
  }, [countryName]);

  if (!countryName) return null;

  return (
    <AnimatePresence>
      <motion.div
        key={countryName}
        initial={{ x: -40, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -40, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 26 }}
        className="relative flex h-full w-full flex-col overflow-y-auto rounded-[2rem] bg-white p-6 shadow-2xl sm:p-8"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full bg-sky-100 text-lg font-bold text-sky-700"
        >
          ×
        </button>

        {!card ? (
          <div className="flex flex-1 items-center justify-center">
            <span className="font-comic text-lg text-slate-400">Loading…</span>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 pt-4 text-center">
            {/* card.flag is the raw flag emoji from the knowledge base, but
                Windows' emoji font has no flag glyphs — render the same
                raster flag art the map's hover pill already uses instead. */}
            <img
              src={FLAG_IMAGE_BY_COUNTRY[card.country]}
              alt=""
              className="h-16 w-24 rounded-lg object-cover shadow"
            />
            <h2 className="font-display text-3xl capitalize text-slate-900">
              {card.country.replace(/_/g, ' ')}
            </h2>
            {card.asean_member === 'yes' && (
              <span className="rounded-full bg-sky-100 px-3 py-1 font-comic text-sm font-bold uppercase tracking-wide text-sky-700">
                ASEAN Member{card.member_since ? ` since ${card.member_since}` : ''}
              </span>
            )}

            <div className="mt-4 flex w-full flex-col gap-2 rounded-2xl bg-slate-50 p-5 text-left">
              <InfoRow label="Capital" value={card.capital.replace(/_/g, ' ')} />
              <InfoRow label="Currency" value={card.currency.replace(/_/g, ' ')} />
              <InfoRow label="Region" value={card.region} />
              {card.animals?.length > 0 && (
                <InfoRow label="National Animal" value={card.animals.map((a) => a.replace(/_/g, ' ')).join(', ')} />
              )}
            </div>

            {card.famous_for?.length > 0 && (
              <div className="mt-2 w-full text-left">
                <p className="font-comic text-lg font-bold text-slate-900">Famous for:</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {card.famous_for.map((fact) => (
                    <span
                      key={fact}
                      className="rounded-full bg-lime-200 px-3 py-1 font-comic text-sm font-bold capitalize text-lime-900"
                    >
                      {fact.replace(/_/g, ' ')}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {card.foods?.length > 0 && (
              <div className="mt-2 w-full text-left">
                <p className="font-comic text-lg font-bold text-slate-900">Tasty foods:</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {card.foods.map((food) => (
                    <span
                      key={food}
                      className="rounded-full bg-amber-200 px-3 py-1 font-comic text-sm font-bold capitalize text-amber-900"
                    >
                      {food.replace(/_/g, ' ')}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <AskAboutCountry card={card} />
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

export default CountryDetailPanel;
