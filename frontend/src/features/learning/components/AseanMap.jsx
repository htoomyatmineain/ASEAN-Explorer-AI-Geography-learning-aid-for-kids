import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';
import { ISO_NUMERIC_TO_COUNTRY } from '../countryCodes';
import { FLAG_IMAGE_BY_COUNTRY } from '../../guess-game/clueOptions';
import { ATTRACTIONS, attractionImage, attractionLabel } from '../attractions';

// ASEAN-only geometry (10 countries, no rest-of-world backdrop) — the fuller
// world-50m.json this map briefly used for real-world context got deleted
// mid-session and isn't recoverable without network access; this asset is
// still tracked in git so it survives. See countryCodes.js for the ISO
// numeric -> country-name mapping.
const GEO_URL = '/assets/map/asean-countries-50m.json';

// Palette follows the pasted tropical-islands reference: lush green land
// ringed by a pale sandy "beach" halo, sitting in deep saturated turquoise
// water with a soft drop shadow for depth.
const OUTLINE_COLOR = 'rgba(40, 60, 45, 0.45)';
const OUTLINE_WIDTH = 1.2;
const ISLAND_SHADOW = 'drop-shadow(0 5px 4px rgba(11, 61, 66, 0.45))';
const BEACH_HALO_COLOR = '#f5ecd2';
const BEACH_HALO_WIDTH = 7;
const PILL_SHADOW = 'drop-shadow(0 2px 3px rgba(11, 61, 66, 0.35))';

// Where each country's name pill sits on the map (lon, lat).
const COUNTRY_LABEL_COORDS = {
  brunei: [114.6, 4.5],
  cambodia: [104.9, 12.7],
  indonesia: [114.5, -1.8],
  laos: [102.8, 18.5],
  malaysia: [110, 3.8],
  myanmar: [96.5, 20],
  philippines: [122.6, 12.7],
  singapore: [103.9, 0.9],
  thailand: [100.9, 15.6],
  vietnam: [107.3, 16.4],
};

const beachHaloStyle = {
  default: { fill: 'none', stroke: BEACH_HALO_COLOR, strokeWidth: BEACH_HALO_WIDTH, strokeLinejoin: 'round', outline: 'none' },
  hover: { fill: 'none', stroke: BEACH_HALO_COLOR, strokeWidth: BEACH_HALO_WIDTH, strokeLinejoin: 'round', outline: 'none' },
  pressed: { fill: 'none', stroke: BEACH_HALO_COLOR, strokeWidth: BEACH_HALO_WIDTH, strokeLinejoin: 'round', outline: 'none' },
};

function aseanStyle(isSelected) {
  return {
    default: {
      fill: isSelected ? '#f5c454' : '#4fae53',
      stroke: OUTLINE_COLOR,
      strokeWidth: OUTLINE_WIDTH,
      outline: 'none',
      cursor: 'pointer',
      filter: ISLAND_SHADOW,
    },
    hover: {
      fill: '#6ec96f',
      stroke: OUTLINE_COLOR,
      strokeWidth: OUTLINE_WIDTH,
      outline: 'none',
      cursor: 'pointer',
      filter: ISLAND_SHADOW,
    },
    pressed: {
      fill: '#f5c454',
      stroke: OUTLINE_COLOR,
      strokeWidth: OUTLINE_WIDTH,
      outline: 'none',
      cursor: 'pointer',
      filter: ISLAND_SHADOW,
    },
  };
}

// The map is intentionally STATIC — no drag-pan, no mouse-wheel zoom. Tapping
// a country (land, name pill or attraction pin) opens its info popup.
function AseanMap({ selectedCountry, onSelectCountry }) {
  return (
    // Near-opaque teal wash — keeps the map crisp and full-page while the
    // illustrated page background still glows faintly behind it.
    <div
      className="relative h-full w-full overflow-hidden"
      style={{ background: 'linear-gradient(180deg, rgba(47, 184, 196, 0.82) 0%, rgba(14, 122, 138, 0.92) 100%)' }}
    >
      {/* How-to hint floats over the map so first-time explorers know what to do. */}
      <div className="pointer-events-none absolute left-3 top-3 z-10">
        <span className="rounded-full bg-white/90 px-3 py-1.5 text-sm font-bold text-sky-800 shadow-[0_2px_4px_rgba(11,61,66,0.3)]">
          <span aria-hidden="true" className="mr-1 inline-block animate-bounce">👆</span>
          Tap a country to learn about it!
        </span>
      </div>

      {/* Frame matched to the map area's aspect (16:9-ish) and
          preserveAspectRatio="none" stretches it edge-to-edge, so the
          map truly fills the page instead of letterboxing into a small
          fixed-ratio picture. */}
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{ scale: 840, center: [111, 8.5] }}
        width={1120}
        height={640}
        preserveAspectRatio="none"
        style={{ width: '100%', height: '100%' }}
      >
        <Geographies geography={GEO_URL}>
          {({ geographies }) => (
            <>
              {/* Pass 1: every country's sandy beach halo, all beneath the
                  real shapes below — keeps the ring from ever painting
                  over a neighboring country's land. */}
              {geographies.map((geo) => (
                <Geography key={`halo-${geo.rsmKey}`} geography={geo} style={beachHaloStyle} />
              ))}
              {/* Pass 2: the actual land shapes, colored and clickable. */}
              {geographies.map((geo) => {
                const country = ISO_NUMERIC_TO_COUNTRY[geo.id];
                if (!country) return null;

                const isSelected = country.name === selectedCountry;
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onClick={() => onSelectCountry(country.name)}
                    style={aseanStyle(isSelected)}
                  />
                );
              })}
              {/* Pass 3: attraction pins — a landmark badge per country, tap
                  to open that country's popup. SVG-native elements only: HTML
                  inside the map's <svg> (e.g. <button>) is dropped by the
                  browser and never renders. */}
              {ATTRACTIONS.map(({ id, country, coords, emoji }) => (
                <Marker key={`pin-${id}`} coordinates={coords}>
                  <g
                    transform="translate(-13, -13)"
                    onClick={() => onSelectCountry(country)}
                    style={{ cursor: 'pointer' }}
                  >
                    <title>{attractionLabel(id)}</title>
                    <circle
                      r="13"
                      fill="#ffffff"
                      stroke="#fbbf24"
                      strokeWidth="2.5"
                      style={{ filter: PILL_SHADOW }}
                    />
                    {attractionImage(id) ? (
                      <image
                        href={attractionImage(id)}
                        x="-9"
                        y="-9"
                        width="18"
                        height="18"
                      />
                    ) : (
                      <text x="0" y="4.5" textAnchor="middle" fontSize="12">
                        {emoji}
                      </text>
                    )}
                  </g>
                </Marker>
              ))}
              {/* Pass 4: country name pills (SVG-native) with mini flag. */}
              {Object.entries(COUNTRY_LABEL_COORDS).map(([country, coords]) => {
                const label = country.replace(/_/g, ' ');
                const isSelected = country === selectedCountry;
                const w = label.length * 5.6 + 28;
                return (
                  <Marker key={`label-${country}`} coordinates={coords}>
                    <g
                      transform={`translate(${-w / 2}, -11)`}
                      onClick={() => onSelectCountry(country)}
                      style={{ cursor: 'pointer' }}
                    >
                      <title>{label}</title>
                      <rect
                        x="0"
                        y="0"
                        width={w}
                        height="22"
                        rx="11"
                        fill={isSelected ? '#f5c454' : 'rgba(255,255,255,0.96)'}
                        stroke={isSelected ? '#ffffff' : 'rgba(11,61,66,0.25)'}
                        strokeWidth={isSelected ? 2 : 1}
                        style={{ filter: PILL_SHADOW }}
                      />
                      {FLAG_IMAGE_BY_COUNTRY[country] && (
                        <image
                          href={FLAG_IMAGE_BY_COUNTRY[country]}
                          x="5"
                          y="5"
                          width="16"
                          height="12"
                        />
                      )}
                      <text
                        x={(w + 24) / 2}
                        y="15"
                        textAnchor="middle"
                        fontSize="11"
                        fontWeight="700"
                        fill={isSelected ? '#1c1917' : '#44403c'}
                      >
                        {label}
                      </text>
                    </g>
                  </Marker>
                );
              })}
            </>
          )}
        </Geographies>
      </ComposableMap>
    </div>
  );
}

export default AseanMap;
