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

function TagRow({ label, items, tagClassName }) {
  if (!items?.length) return null;
  return (
    <div className="mt-1 w-full text-left">
      <p className="font-comic text-lg text-slate-700">
        <span className="font-bold text-slate-900">{label}:</span>
      </p>
      <div className="mt-2 flex flex-wrap gap-2">
        {items.map((item) => (
          <span key={item} className={`rounded-full px-3 py-1 font-comic text-sm font-bold capitalize ${tagClassName}`}>
            {item.replace(/_/g, ' ')}
          </span>
        ))}
      </div>
    </div>
  );
}

const humanize = (s) => String(s).replace(/_/g, ' ');
const listOrNone = (arr) => (arr?.length > 0 ? arr.map(humanize).join(', ') : 'none listed');

// Groups the flat message log into [user, ai] pairs so each exchange renders
// in its own card instead of one long unbroken block.
function chunkPairs(messages) {
  const pairs = [];
  for (let i = 0; i < messages.length; i += 2) {
    pairs.push(messages.slice(i, i + 2));
  }
  return pairs;
}

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
const START_TEXT = `Hi, I'm Kiko! 🦜 ${HELP_TEXT}`;

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
    if (command === 'start') {
      setMessages((prev) => [...prev, { role: 'ai', text: START_TEXT }]);
      return;
    }
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
    <div className="flex w-full flex-1 flex-col text-left">
      <p className="font-comic text-lg font-bold text-slate-900">
        Ask about {countryLabel}:
      </p>
      <div className="mt-2 flex flex-1 flex-col justify-end gap-3 overflow-y-auto scrollbar-hide">
        {messages.length > 0 &&
          chunkPairs(messages).map((pair, i) => (
            <div key={i} className="flex flex-col gap-2 rounded-2xl bg-slate-50 p-3">
              {pair.map((m, j) => (
                <p key={j} className="font-comic text-sm text-slate-700">
                  <span className="font-bold text-sky-700">{m.role === 'user' ? 'You' : 'Kiko'}:</span> {m.text}
                </p>
              ))}
            </div>
          ))}
      </div>
      <form onSubmit={handleSubmit} className="mt-2 flex gap-2">
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Type /start"
          className="flex-1 rounded-full border border-slate-200 px-4 py-2 font-comic text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-300"
        />
        <button
          type="submit"
          className="rounded-full border-b-4 border-sky-600 bg-sky-400 px-4 py-2 font-comic text-sm font-bold text-white shadow-[0_3px_0_0_rgb(2,132,199)] transition-transform duration-100 ease-out active:translate-y-[3px] active:border-b-0 active:shadow-none"
        >
          Ask
        </button>
      </form>
    </div>
  );
}

// Floats over the left side of the map, gapped from the top/left edges (see
// Learning.page.jsx) — not flush against the screen, so it's rounded on all
// four corners rather than just the inner edge. The card is a real 3D flip:
// "Ask AI for More" on the general-info face rotates it around to the chat
// face, and "Back to General Info" rotates it back. Both faces sit in the
// same CSS grid cell (instead of being absolutely positioned) so the card's
// height is always the taller face's own content — no leftover empty space
// under a shorter face — while still capped against the viewport, scrolling
// internally only if content is ever actually taller than that cap.
function CountryDetailPanel({ countryName, onClose }) {
  const [card, setCard] = useState(null);
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    setCard(null);
    setFlipped(false);
    if (!countryName) return;
    getCountryInfo(countryName).then(setCard);
  }, [countryName]);

  if (!countryName) return null;

  return (
    <AnimatePresence mode="popLayout">
      <motion.div
        key={countryName}
        initial={{ x: -40, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -40, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 26 }}
        className="relative w-full max-h-[calc(100vh-9.5rem)] overflow-y-auto scrollbar-hide rounded-[2rem] bg-white shadow-2xl"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-5 top-5 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-sky-100 text-lg font-bold text-sky-700"
        >
          ×
        </button>

        {!card ? (
          <div className="flex h-40 items-center justify-center">
            <span className="font-comic text-lg text-slate-400">Loading…</span>
          </div>
        ) : (
          <div className="w-full [perspective:1600px]">
            <div
              className="relative grid w-full transition-transform duration-700 ease-in-out"
              style={{ transformStyle: 'preserve-3d', transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
            >
              {/* Front face: general info. */}
              <div
                className="flex flex-col items-center gap-3 p-6 text-center sm:p-8"
                style={{ backfaceVisibility: 'hidden', gridArea: '1 / 1' }}
              >
                {/* card.flag is the raw flag emoji from the knowledge base, but
                    Windows' emoji font has no flag glyphs — render the same
                    raster flag art the map's hover pill already uses instead. */}
                <img
                  src={FLAG_IMAGE_BY_COUNTRY[card.country]}
                  alt=""
                  className="h-16 w-24 rounded-lg object-cover shadow"
                />
                <h2 className="font-comic text-3xl capitalize text-slate-900">
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
                  <TagRow label="Famous for" items={card.famous_for} tagClassName="bg-lime-200 text-lime-900" />
                  <TagRow label="Tasty foods" items={card.foods} tagClassName="bg-amber-200 text-amber-900" />
                </div>

                <button
                  type="button"
                  onClick={() => setFlipped(true)}
                  className="mt-4 w-full shrink-0 rounded-xl border-b-4 border-sky-600 bg-sky-400 py-3 font-momo text-sm font-bold uppercase tracking-wide text-white [text-shadow:_0_2px_4px_rgb(0_0_0_/_60%)] shadow-[0_3px_0_0_rgb(2,132,199)] transition-transform duration-100 ease-out active:translate-y-[3px] active:border-b-0 active:shadow-none"
                >
                  Ask AI for More
                </button>
              </div>

              {/* Back face: AI chat. */}
              <div
                className="flex h-full min-h-[24rem] flex-col p-6 sm:p-8"
                style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)', gridArea: '1 / 1' }}
              >
                <div className="flex shrink-0 items-center gap-3 pb-3">
                  <img
                    src={FLAG_IMAGE_BY_COUNTRY[card.country]}
                    alt=""
                    className="h-12 w-12 rounded-full object-cover shadow"
                  />
                  <h2 className="font-comic text-xl capitalize text-slate-900">
                    {card.country.replace(/_/g, ' ')}
                  </h2>
                </div>

                <div className="flex flex-1 flex-col overflow-hidden rounded-2xl border border-slate-200 p-4">
                  <AskAboutCountry card={card} />
                </div>

                <button
                  type="button"
                  onClick={() => setFlipped(false)}
                  className="mt-4 shrink-0 self-center font-momo text-sm font-bold text-sky-700"
                >
                  ← Back to General Info
                </button>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

export default CountryDetailPanel;
