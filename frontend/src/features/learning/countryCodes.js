// Maps the ISO 3166-1 numeric `id` used by the topojson in
// public/assets/map/asean-countries-50m.json to the lowercase atom names
// backend/prolog/facts.pl uses for each of the 10 ASEAN member countries.
export const ISO_NUMERIC_TO_COUNTRY = {
  '096': { name: 'brunei', label: 'Brunei' },
  '116': { name: 'cambodia', label: 'Cambodia' },
  '360': { name: 'indonesia', label: 'Indonesia' },
  '418': { name: 'laos', label: 'Laos' },
  '458': { name: 'malaysia', label: 'Malaysia' },
  '104': { name: 'myanmar', label: 'Myanmar' },
  '608': { name: 'philippines', label: 'Philippines' },
  '702': { name: 'singapore', label: 'Singapore' },
  '764': { name: 'thailand', label: 'Thailand' },
  '704': { name: 'vietnam', label: 'Vietnam' },
};
