// Preset challenge rounds for the "you guess the country" mode.
// Each round is a set of clues about one mystery country — verified against
// the facts documented in docs/01-asean-explorer-prolog-kb.md §3 to ensure
// each combination uniquely identifies its country (no ambiguity, e.g.
// `famous_for: elephants` alone matches both Myanmar and Thailand, so the
// Thailand round also pins `capital: bangkok` to disambiguate).
// The *actual* correct answer always comes from the real backend
// (guess_country/2 via POST /guess) — these clues are sent there and
// whatever Prolog returns is treated as truth, never assumed client-side.

export const CHALLENGE_ROUNDS = [
  [
    { type: 'capital', value: 'bangkok' },
    { type: 'famous_for', value: 'elephants' },
    { type: 'borders', value: 'myanmar' },
  ],
  [
    { type: 'capital', value: 'hanoi' },
    { type: 'famous_for', value: 'ha_long_bay' },
    { type: 'borders', value: 'cambodia' },
  ],
  [
    { type: 'capital', value: 'naypyidaw' },
    { type: 'famous_for', value: 'shwedagon_pagoda' },
    { type: 'subregion', value: 'mainland' },
  ],
  [
    { type: 'capital', value: 'singapore_city' },
    { type: 'famous_for', value: 'merlion' },
    { type: 'borders', value: 'malaysia' },
  ],
  [
    { type: 'capital', value: 'kuala_lumpur' },
    { type: 'famous_for', value: 'petronas_towers' },
    { type: 'borders', value: 'singapore' },
  ],
  [
    { type: 'capital', value: 'jakarta' },
    { type: 'famous_for', value: 'borobudur_temple' },
    { type: 'subregion', value: 'maritime' },
  ],
  [
    { type: 'capital', value: 'phnom_penh' },
    { type: 'famous_for', value: 'angkor_wat' },
    { type: 'borders', value: 'vietnam' },
  ],
  [
    { type: 'capital', value: 'manila' },
    { type: 'famous_for', value: 'chocolate_hills' },
    { type: 'subregion', value: 'maritime' },
  ],
  [
    { type: 'capital', value: 'vientiane' },
    { type: 'famous_for', value: 'mekong_river' },
    { type: 'subregion', value: 'mainland' },
  ],
  [
    { type: 'capital', value: 'bandar_seri_begawan' },
    { type: 'famous_for', value: 'kampong_ayer' },
    { type: 'borders', value: 'malaysia' },
  ],
];

// The 10 ASEAN countries the child can pick as their guess.
export const GUESSABLE_COUNTRIES = [
  'brunei', 'cambodia', 'indonesia', 'laos', 'malaysia',
  'myanmar', 'philippines', 'singapore', 'thailand', 'vietnam',
];
