// Clue-picker option data for the Guess the Country UI.
// Values mirror the facts documented in docs/01-asean-explorer-prolog-kb.md §3 —
// this is presentation data for the picker only, not a duplicate of the backend KB.
// Icons/labels follow the "Guess the Country (Kids Edition)" design handoff.
// Image assets live in public/assets/guess-game/ and public/assets/mascot/.

const ASSET_BASE = '/assets/guess-game';

export const CLUE_TYPES = [
  { type: 'capital', label: 'Capital city', icon: '🏛️', iconSrc: `${ASSET_BASE}/clues/capital.png` },
  { type: 'currency', label: 'Money', icon: '💰', iconSrc: `${ASSET_BASE}/clues/currency.png` },
  { type: 'language', label: 'Language', icon: '💬', iconSrc: `${ASSET_BASE}/clues/language.png` },
  { type: 'famous_for', label: 'Famous for', icon: '🐘', iconSrc: `${ASSET_BASE}/clues/famous-for.png` },
  { type: 'borders', label: 'Next to', icon: '🗺️', iconSrc: `${ASSET_BASE}/clues/borders.png` },
  { type: 'subregion', label: 'Land or islands', icon: '🧭', iconSrc: `${ASSET_BASE}/clues/subregion.png` },
  { type: 'member_of', label: 'ASEAN member', icon: '🌏', iconSrc: `${ASSET_BASE}/clues/member-of.png` },
];

export const CLUE_ICON_BY_TYPE = Object.fromEntries(
  CLUE_TYPES.map(({ type, icon }) => [type, icon]),
);

export const CLUE_ICON_SRC_BY_TYPE = Object.fromEntries(
  CLUE_TYPES.map(({ type, iconSrc }) => [type, iconSrc]),
);

export const CLUE_LABEL_BY_TYPE = Object.fromEntries(
  CLUE_TYPES.map(({ type, label }) => [type, label]),
);

export const CLUE_VALUES = {
  member_of: ['asean'],
  capital: [
    'bandar_seri_begawan', 'phnom_penh', 'jakarta', 'vientiane', 'kuala_lumpur',
    'naypyidaw', 'manila', 'singapore_city', 'bangkok', 'hanoi',
  ],
  currency: [
    'brunei_dollar', 'riel', 'rupiah', 'kip', 'ringgit', 'kyat',
    'philippine_peso', 'singapore_dollar', 'baht', 'dong',
  ],
  language: [
    'malay', 'khmer', 'indonesian', 'lao', 'burmese', 'filipino',
    'english', 'mandarin', 'tamil', 'thai', 'vietnamese',
  ],
  famous_for: [
    'sultan_omar_ali_saifuddien_mosque', 'kampong_ayer', 'angkor_wat', 'tonle_sap_lake',
    'borobudur_temple', 'komodo_dragons', 'bali_beaches', 'luang_prabang_temples',
    'mekong_river', 'petronas_towers', 'orangutans', 'elephants', 'shwedagon_pagoda',
    'bagan_temples', 'chocolate_hills', 'palawan_islands', 'merlion',
    'marina_bay_sands', 'gardens_by_the_bay', 'grand_palace', 'ha_long_bay',
    'hoi_an_lanterns',
  ],
  borders: [
    'brunei', 'cambodia', 'indonesia', 'laos', 'malaysia', 'myanmar', 'philippines',
    'singapore', 'thailand', 'vietnam', 'china', 'india', 'bangladesh',
    'papua_new_guinea', 'timor_leste',
  ],
  subregion: ['mainland', 'maritime'],
};

export function defaultValueFor(type) {
  return CLUE_VALUES[type][0];
}

// Flag chip images — a clean 1:1 match between our `borders` values and the
// cropped flag asset pack (all 15 countries covered).
export const FLAG_IMAGE_BY_COUNTRY = Object.fromEntries(
  CLUE_VALUES.borders.map((country) => [
    country,
    `${ASSET_BASE}/flags/flag-${country.replace(/_/g, '-')}.png`,
  ]),
);

// Capital city → country, so a "capital" clue can show that country's flag
// (same flag images used for `borders`) instead of the generic clue-type icon.
const COUNTRY_BY_CAPITAL = {
  bandar_seri_begawan: 'brunei',
  phnom_penh: 'cambodia',
  jakarta: 'indonesia',
  vientiane: 'laos',
  kuala_lumpur: 'malaysia',
  naypyidaw: 'myanmar',
  manila: 'philippines',
  singapore_city: 'singapore',
  bangkok: 'thailand',
  hanoi: 'vietnam',
};

export const FLAG_IMAGE_BY_CAPITAL = Object.fromEntries(
  Object.entries(COUNTRY_BY_CAPITAL).map(([capital, country]) => [
    capital,
    `${ASSET_BASE}/flags/flag-${country.replace(/_/g, '-')}.png`,
  ]),
);

// Landmark thumbnails — only a partial match against our `famous_for` values,
// since the cropped asset pack's landmark set wasn't drawn 1:1 against
// facts.pl. Only include entries we're confident actually depict the value.
export const LANDMARK_IMAGE_BY_VALUE = {
  angkor_wat: `${ASSET_BASE}/landmarks/angkor-wat.png`,
  bagan_temples: `${ASSET_BASE}/landmarks/bagan-temples.png`,
  borobudur_temple: `${ASSET_BASE}/landmarks/borobudur.png`,
  chocolate_hills: `${ASSET_BASE}/landmarks/chocolate-hills.png`,
  komodo_dragons: `${ASSET_BASE}/landmarks/komodo-dragon.png`,
  elephants: `${ASSET_BASE}/landmarks/elephants.png`,
  ha_long_bay: `${ASSET_BASE}/landmarks/ha-long-bay.png`,
  marina_bay_sands: `${ASSET_BASE}/landmarks/marina-bay.png`,
  shwedagon_pagoda: `${ASSET_BASE}/landmarks/shwedagon-pagoda.png`,
  orangutans: `${ASSET_BASE}/landmarks/orangutan.png`,
};

// Illustrated country-reveal cards, shown when the backend returns a matching
// ASEAN country. Only the 10 ASEAN members have cards in the asset pack — a
// non-ASEAN neighbor answer (theoretically possible from guess_country/2)
// falls back to text-only.
export const COUNTRY_CARD_IMAGE = Object.fromEntries(
  ['brunei', 'cambodia', 'indonesia', 'laos', 'malaysia', 'myanmar', 'philippines',
    'singapore', 'thailand', 'vietnam'].map((country) => [
    country,
    `${ASSET_BASE}/countries/${country}.png`,
  ]),
);

// Kiko the parrot mascot poses.
export const KIKO = {
  hello: '/assets/mascot/kiko-hello.png',
  thinking: '/assets/mascot/kiko-thinking.png',
  cheer: '/assets/mascot/kiko-cheer.png',
  oops: '/assets/mascot/kiko-oops.png',
};
