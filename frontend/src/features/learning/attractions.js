import { LANDMARK_IMAGE_BY_VALUE } from '../guess-game/clueOptions';

// One headline attraction per country (two for the bigger ones), shown as a
// pin on the map and as a card in the scrollable section below it. The `id`
// must match a famous_for/2 atom in backend/prolog/facts.pl. Coordinates are
// (lon, lat).
export const ATTRACTIONS = [
  { id: 'angkor_wat', country: 'cambodia', coords: [103.86, 13.41] },
  { id: 'borobudur_temple', country: 'indonesia', coords: [110.2, -7.61] },
  { id: 'komodo_dragons', country: 'indonesia', coords: [119.49, -8.59] },
  { id: 'luang_prabang_temples', country: 'laos', coords: [102.13, 19.88], emoji: '🛕' },
  { id: 'orangutans', country: 'malaysia', coords: [117.9, 5.9] },
  { id: 'shwedagon_pagoda', country: 'myanmar', coords: [96.15, 16.8] },
  { id: 'bagan_temples', country: 'myanmar', coords: [94.86, 21.17] },
  { id: 'chocolate_hills', country: 'philippines', coords: [124.17, 9.83] },
  { id: 'marina_bay_sands', country: 'singapore', coords: [104.2, 1.15] },
  { id: 'elephants', country: 'thailand', coords: [98.9, 18.8] },
  { id: 'ha_long_bay', country: 'vietnam', coords: [107.17, 20.91] },
  { id: 'sultan_omar_ali_saifuddien_mosque', country: 'brunei', coords: [114.9, 4.9], emoji: '🕌' },
];

export function attractionImage(id) {
  return LANDMARK_IMAGE_BY_VALUE[id] ?? null;
}

export function attractionLabel(id) {
  return id.replace(/_/g, ' ');
}
