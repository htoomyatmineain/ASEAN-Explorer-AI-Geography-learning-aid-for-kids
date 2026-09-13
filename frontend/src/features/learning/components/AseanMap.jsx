import { useEffect, useState } from 'react';
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from 'react-simple-maps';
import { ISO_NUMERIC_TO_COUNTRY } from '../countryCodes';
import { FLAG_IMAGE_BY_COUNTRY } from '../../guess-game/clueOptions';
import { ATTRACTIONS, attractionImage, attractionLabel } from '../attractions';

// Real world geometry (241 countries) so Learning Mode can open on a full
// world map before zooming into ASEAN — replaces the old ASEAN-only file,
// which only ever showed 10 shapes floating in empty water.
const GEO_URL = '/assets/map/world-50m.json';

// Bright, layered ocean gradient (top-down tropical-water look, matching the
// "Ui ref/map-00.jpg" mood board) instead of a flat water fill.
const WATER_GRADIENT =
  'radial-gradient(ellipse at 30% 20%, #a4f0fb 0%, transparent 55%), ' +
  'radial-gradient(ellipse at 80% 75%, #7fe3f5 0%, transparent 50%), ' +
  'linear-gradient(160deg, #8fe8f7 0%, #4cc9ec 45%, #1f9fd6 100%)';
const ASEAN_LAND = '#22c55e';
const ASEAN_LAND_HOVER = '#4ade80';
const ASEAN_LAND_SELECTED = '#fbbf24';
const ASEAN_SAND_RING = '#f6e3b4';
const OTHER_LAND = '#ecdfb0';
const OTHER_LAND_STROKE = 'rgba(120, 108, 70, 0.5)';
const ASEAN_STROKE = 'rgba(20, 60, 30, 0.55)';
const HOVER_STROKE = '#ffffff';
const ISLAND_SHADOW = 'drop-shadow(0 3px 4px rgba(11,61,66,0.35))';
const PILL_SHADOW = 'drop-shadow(0 2px 3px rgba(11,61,66,0.35))';

// Purely decorative clouds/plane/boats drifting over the water, echoing the
// "Ui ref/map-00.jpg" mood board. Positioned to mostly clear the open-water
// gaps between ASEAN countries in the default view and stay out from under
// the logo, hint pill and bottom nav. Reuses the `.floating-icon` drift
// animation already defined in shared/styles/theme.css.
const SKY_DECORATIONS = [
  { emoji: '☁️', top: '14%', left: '46%', size: '4.5rem', duration: '22s', delay: '0s', driftX: '40px', opacity: 0.85 },
  { emoji: '☁️', top: '24%', left: '80%', size: '3.2rem', duration: '18s', delay: '2s', driftX: '-30px', opacity: 0.75 },
  { emoji: '☁️', top: '6%', left: '22%', size: '3rem', duration: '20s', delay: '1s', driftX: '26px', opacity: 0.7 },
  { emoji: '✈️', top: '32%', left: '87%', size: '2.2rem', duration: '26s', delay: '0.5s', driftX: '60px', rotate: '4deg', opacity: 0.8 },
  { emoji: '🚤', top: '60%', left: '64%', size: '2rem', duration: '16s', delay: '1.5s', driftX: '-24px', rotate: '-3deg', opacity: 0.85 },
  { emoji: '⛵', top: '76%', left: '34%', size: '1.9rem', duration: '19s', delay: '0.8s', driftX: '20px', rotate: '3deg', opacity: 0.8 },
];

// Base (unzoomed) framing wide enough to read as "the whole world" during the
// opening animation. ZoomableGroup's own center/zoom then pans/scales on top
// of this — see WORLD_VIEW / ASEAN_VIEW / COUNTRY_VIEWS below.
const BASE_PROJECTION = { scale: 145, center: [20, 12] };

const WORLD_VIEW = { center: BASE_PROJECTION.center, zoom: 1 };
const ASEAN_VIEW = { center: [111, 8.5], zoom: 5.6 };

// Per-country camera target for the "zoom in to fit" pop-up. Center is the
// same point used for that country's name pill; zoom is hand-tuned to its
// footprint (a tiny country like Singapore needs far more zoom than a
// sprawling archipelago like Indonesia, which can never fully fit anyway).
const COUNTRY_VIEWS = {
  brunei: { center: [114.6, 4.5], zoom: 40 },
  cambodia: { center: [104.9, 12.7], zoom: 22 },
  indonesia: { center: [110, -2], zoom: 4.4 },
  laos: { center: [102.8, 18.3], zoom: 16 },
  malaysia: { center: [108, 3.5], zoom: 9 },
  myanmar: { center: [96.5, 20.5], zoom: 10 },
  philippines: { center: [122.6, 12.2], zoom: 11 },
  singapore: { center: [103.85, 1.35], zoom: 45 },
  thailand: { center: [101, 15.3], zoom: 10 },
  vietnam: { center: [106.5, 16.2], zoom: 10 },
};

// Where each country's name pill (and default zoom target) sits (lon, lat).
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

function aseanFill(isSelected, isHovered) {
  if (isSelected) return ASEAN_LAND_SELECTED;
  if (isHovered) return ASEAN_LAND_HOVER;
  return ASEAN_LAND;
}

// The map is intentionally not draggable / wheel-zoomable by the player — the
// only camera moves are the scripted world -> ASEAN intro and the per-country
// "zoom to fit" that happens when a country is tapped.
function AseanMap({ selectedCountry, onSelectCountry }) {
  const [hasIntroed, setHasIntroed] = useState(false);
  const [hoveredCountry, setHoveredCountry] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => setHasIntroed(true), 900);
    return () => clearTimeout(timer);
  }, []);

  const view = !hasIntroed
    ? WORLD_VIEW
    : selectedCountry
      ? (COUNTRY_VIEWS[selectedCountry] ?? ASEAN_VIEW)
      : ASEAN_VIEW;

  // Markers/labels live inside ZoomableGroup, so without this they'd get
  // multiplied by the current map zoom (up to 45x for a tiny country like
  // Singapore) on top of their own pixel size. Scaling their content by the
  // zoom's reciprocal keeps them a small, constant on-screen size no matter
  // how zoomed in the map is.
  const markerScale = 1 / view.zoom;

  return (
    <div className="relative h-full w-full overflow-hidden" style={{ background: WATER_GRADIENT }}>
      {/* Ambient sky layer — clouds/plane/boats drifting over the water.
          Sits behind the map's SVG so land shapes paint over it, and stays
          fixed on screen (doesn't pan/zoom with the map) like a backdrop. */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {SKY_DECORATIONS.map((item, i) => (
          <span
            key={i}
            aria-hidden="true"
            className="floating-icon absolute select-none"
            style={{
              top: item.top,
              left: item.left,
              fontSize: item.size,
              opacity: item.opacity,
              animationDuration: item.duration,
              animationDelay: item.delay,
              '--drift-x': item.driftX,
              '--drift-rotate': item.rotate ?? '0deg',
            }}
          >
            {item.emoji}
          </span>
        ))}
      </div>
      {/* Shifted right while the detail card is open (see CountryDetailPanel,
          which now sits on the left side of the screen) so the zoomed
          country lands in the middle of what's still visible instead of
          being hidden under the card. */}
      <div
        className="absolute inset-0"
        style={{
          transform: selectedCountry ? 'translateX(10%)' : 'translateX(0)',
          transition: 'transform 700ms cubic-bezier(0.22, 1, 0.36, 1)',
        }}
      >
        <ComposableMap
          projection="geoMercator"
          projectionConfig={BASE_PROJECTION}
          width={1120}
          height={640}
          preserveAspectRatio="none"
          style={{ width: '100%', height: '100%' }}
        >
          <ZoomableGroup center={view.center} zoom={view.zoom} minZoom={1} maxZoom={50} filterZoomEvent={() => false}>
            <Geographies geography={GEO_URL}>
              {({ geographies }) => (
                <>
                  {/* Pass 1: every non-ASEAN country, flat and non-interactive —
                      just world context so ASEAN doesn't float in empty water. */}
                  {geographies.map((geo) => {
                    const country = ISO_NUMERIC_TO_COUNTRY[geo.id];
                    if (country) return null;
                    return (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        style={{
                          default: { fill: OTHER_LAND, stroke: OTHER_LAND_STROKE, strokeWidth: 0.6, outline: 'none' },
                          hover: { fill: OTHER_LAND, stroke: OTHER_LAND_STROKE, strokeWidth: 0.6, outline: 'none' },
                          pressed: { fill: OTHER_LAND, stroke: OTHER_LAND_STROKE, strokeWidth: 0.6, outline: 'none' },
                        }}
                      />
                    );
                  })}
                  {/* Pass 2: the 10 ASEAN countries — colored, hoverable, clickable. */}
                  {geographies.map((geo) => {
                    const country = ISO_NUMERIC_TO_COUNTRY[geo.id];
                    if (!country) return null;

                    const isSelected = country.name === selectedCountry;
                    const isHovered = country.name === hoveredCountry;
                    // Sand-colored halo drawn first, under the green fill —
                    // its stroke is centered on the coastline, so only the
                    // outer half stays visible once the land pass covers the
                    // inner half, giving each country a beach-ring edge like
                    // the islands in "Ui ref/map-00.jpg".
                    const ringStyle = {
                      fill: 'none',
                      stroke: ASEAN_SAND_RING,
                      strokeWidth: isHovered ? 0.9 : 0.7,
                      strokeLinejoin: 'round',
                      outline: 'none',
                      pointerEvents: 'none',
                    };
                    const style = {
                      fill: aseanFill(isSelected, isHovered),
                      stroke: isHovered ? HOVER_STROKE : ASEAN_STROKE,
                      strokeWidth: isHovered ? 0.6 : 0.4,
                      outline: 'none',
                      cursor: 'pointer',
                      transition: 'fill 120ms ease-out, stroke-width 120ms ease-out',
                    };
                    return (
                      <g key={geo.rsmKey} style={{ filter: ISLAND_SHADOW }}>
                        <Geography geography={geo} style={{ default: ringStyle, hover: ringStyle, pressed: ringStyle }} />
                        <Geography
                          geography={geo}
                          onClick={() => onSelectCountry(country.name)}
                          onMouseEnter={() => setHoveredCountry(country.name)}
                          onMouseLeave={() => setHoveredCountry(null)}
                          style={{ default: style, hover: style, pressed: style }}
                        />
                      </g>
                    );
                  })}
                  {/* Pass 3: attraction pins — the landmark's own art/emoji sits
                      directly on the map, no background badge behind it. */}
                  {ATTRACTIONS.map(({ id, country, coords, emoji }) => (
                    <Marker key={`pin-${id}`} coordinates={coords}>
                      <g onClick={() => onSelectCountry(country)} style={{ cursor: 'pointer' }}>
                        <title>{attractionLabel(id)}</title>
                        <g transform={`scale(${markerScale})`} style={{ filter: PILL_SHADOW }}>
                          {attractionImage(id) ? (
                            <image href={attractionImage(id)} x="-16" y="-16" width="32" height="32" />
                          ) : (
                            <text x="0" y="9" textAnchor="middle" fontSize="26">
                              {emoji}
                            </text>
                          )}
                        </g>
                      </g>
                    </Marker>
                  ))}
                  {/* Pass 4: country name pill — only while that country is
                      hovered, so the map reads clean until you point at one. */}
                  {Object.entries(COUNTRY_LABEL_COORDS).map(([country, coords]) => {
                    if (country !== hoveredCountry) return null;
                    const label = country.replace(/_/g, ' ');
                    const w = label.length * 5.6 + 28;
                    return (
                      <Marker key={`label-${country}`} coordinates={coords}>
                        <g
                          transform={`scale(${markerScale}) translate(${-w / 2}, -11)`}
                          style={{ pointerEvents: 'none' }}
                        >
                          <rect
                            x="0"
                            y="0"
                            width={w}
                            height="22"
                            rx="11"
                            fill="rgba(255,255,255,0.97)"
                            stroke="rgba(11,61,66,0.25)"
                            strokeWidth="1"
                            style={{ filter: PILL_SHADOW }}
                          />
                          {FLAG_IMAGE_BY_COUNTRY[country] && (
                            <image href={FLAG_IMAGE_BY_COUNTRY[country]} x="5" y="5" width="16" height="12" />
                          )}
                          <text
                            x={(w + 24) / 2}
                            y="15"
                            textAnchor="middle"
                            fontSize="11"
                            fontWeight="700"
                            fill="#1c1917"
                            className="font-comic"
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
          </ZoomableGroup>
        </ComposableMap>
      </div>
    </div>
  );
}

export default AseanMap;
