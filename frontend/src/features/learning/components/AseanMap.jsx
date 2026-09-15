import { useEffect, useState } from 'react';
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from 'react-simple-maps';
import { ISO_NUMERIC_TO_COUNTRY } from '../countryCodes';
import { FLAG_IMAGE_BY_COUNTRY } from '../../guess-game/clueOptions';

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
const ASEAN_SAND_RING = '#f6e3b4';
const OTHER_LAND = '#ecdfb0';
const OTHER_LAND_STROKE = 'rgba(120, 108, 70, 0.5)';
const ASEAN_STROKE = 'rgba(20, 60, 30, 0.55)';
const HOVER_STROKE = '#ffffff';
const ISLAND_SHADOW = 'drop-shadow(0 3px 4px rgba(11,61,66,0.35))';
const PILL_SHADOW = 'drop-shadow(0 2px 3px rgba(11,61,66,0.35))';

// Purely decorative clouds/planes/boats drifting over the water, echoing the
// "Ui ref/map-00.jpg" mood board. Positioned to mostly clear the open-water
// gaps between ASEAN countries in the default view and stay out from under
// the logo, hint pill and bottom nav. `kind: 'boat'` picks the gentler
// near-water rocking animation; everything else uses the sky-height bob —
// both defined in shared/styles/theme.css.
const SKY_DECORATIONS = [
  { kind: 'cloud', emoji: '☁️', top: '8%', left: '30%', size: '4rem', duration: '22s', delay: '0s', driftX: '40px', opacity: 0.85 },
  { kind: 'cloud', emoji: '☁️', top: '6%', left: '58%', size: '3.4rem', duration: '19s', delay: '1.2s', driftX: '-32px', opacity: 0.8 },
  { kind: 'cloud', emoji: '☁️', top: '16%', left: '78%', size: '3rem', duration: '24s', delay: '2s', driftX: '30px', opacity: 0.75 },
  { kind: 'cloud', emoji: '☁️', top: '28%', left: '12%', size: '3.6rem', duration: '20s', delay: '0.6s', driftX: '26px', opacity: 0.8 },
  { kind: 'cloud', emoji: '☁️', top: '34%', left: '90%', size: '2.6rem', duration: '17s', delay: '2.4s', driftX: '-22px', opacity: 0.7 },
  { kind: 'cloud', emoji: '☁️', top: '4%', left: '4%', size: '2.4rem', duration: '21s', delay: '1.6s', driftX: '20px', opacity: 0.7 },
  { kind: 'plane', emoji: '🛩️', top: '20%', left: '42%', size: '2.2rem', duration: '26s', delay: '0.5s', driftX: '60px', rotate: '8deg', opacity: 0.9 },
  { kind: 'plane', emoji: '🛩️', top: '46%', left: '84%', size: '2rem', duration: '23s', delay: '3s', driftX: '-52px', rotate: '-6deg', opacity: 0.9 },
  { kind: 'plane', emoji: '🛩️', top: '64%', left: '18%', size: '2.3rem', duration: '28s', delay: '1.4s', driftX: '48px', rotate: '12deg', opacity: 0.9 },
  { kind: 'boat', emoji: '🚤', top: '56%', left: '68%', size: '2rem', duration: '9s', delay: '1.5s', driftX: '26px', opacity: 0.9 },
  { kind: 'boat', emoji: '⛵', top: '72%', left: '38%', size: '1.9rem', duration: '11s', delay: '0.8s', driftX: '-22px', opacity: 0.85 },
  { kind: 'boat', emoji: '🛥️', top: '40%', left: '8%', size: '1.9rem', duration: '10s', delay: '2.6s', driftX: '20px', opacity: 0.85 },
  { kind: 'boat', emoji: '🚢', top: '82%', left: '58%', size: '2.1rem', duration: '13s', delay: '0.3s', driftX: '-30px', opacity: 0.8 },
];

// Base (unzoomed) framing wide enough to read as "the whole world" during the
// opening animation. ZoomableGroup's own center/zoom then pans/scales on top
// of this — see WORLD_VIEW / ASEAN_VIEW below.
const BASE_PROJECTION = { scale: 145, center: [20, 12] };

const WORLD_VIEW = { center: BASE_PROJECTION.center, zoom: 1 };
const ASEAN_VIEW = { center: [111, 8.5], zoom: 5.6 };

// Where each country's name pill sits (lon, lat) while hovered.
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

function aseanFill(isHovered) {
  return isHovered ? ASEAN_LAND_HOVER : ASEAN_LAND;
}

// Singapore's real coastline is only ~35km across — barely a speck at the
// default ASEAN zoom, even though it's a full member. `path` is Singapore's
// actual coastline (traced from the same world-50m.json topojson Pass 2
// renders, centered on its bounding-box midpoint and scaled uniformly —
// same proportions, just big enough to see and tap) drawn as an oversized
// island on top of its real (tiny) polygon instead of a generic circle.
// At this dataset's resolution Singapore's coastline already touches
// Malaysia's Johor tip, so any enlargement overlaps it unless nudged south
// — `nudgeY` shifts the drawn shape (not its real anchor point) down so it
// reads as sitting below Malaysia instead of on top of it.
const TINY_COUNTRIES = {
  singapore: {
    coords: [103.8232, 1.3564],
    path: 'M5.98,0.98 L-0.15,3.66 L-7,1.27 L-4.81,-2.74 L-0.15,-3.66 L3.5,-2.39 L5.54,-1.48 L7,-0.35 Z',
    nudgeY: 5,
  },
};

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

  // Selecting a country no longer zooms the background map in on it — the
  // camera stays at the ASEAN-wide view regardless of selection.
  const view = !hasIntroed ? WORLD_VIEW : ASEAN_VIEW;

  // The hover label pill lives inside ZoomableGroup, so without this it'd be
  // multiplied by the current map zoom on top of its own pixel size. Scaling
  // it by the zoom's reciprocal keeps it a small, constant on-screen size.
  const markerScale = 1 / view.zoom;

  return (
    <div className="relative h-full w-full overflow-hidden" style={{ background: WATER_GRADIENT }}>
      {/* Shifted right while the detail card is open (see CountryDetailPanel,
          which sits on the left side of the screen) so the map's visible
          remainder stays roughly centered instead of hiding behind the card. */}
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

                    // Selected counts as "hovered" too, so the country behind
                    // the open detail card keeps the same highlight look
                    // instead of a separate style.
                    const isHighlighted = country.name === hoveredCountry || country.name === selectedCountry;
                    // Sand-colored halo drawn first, under the green fill —
                    // its stroke is centered on the coastline, so only the
                    // outer half stays visible once the land pass covers the
                    // inner half, giving each country a beach-ring edge like
                    // the islands in "Ui ref/map-00.jpg".
                    const ringStyle = {
                      fill: 'none',
                      stroke: ASEAN_SAND_RING,
                      strokeWidth: isHighlighted ? 0.9 : 0.7,
                      strokeLinejoin: 'round',
                      outline: 'none',
                      pointerEvents: 'none',
                    };
                    const style = {
                      fill: aseanFill(isHighlighted),
                      stroke: isHighlighted ? HOVER_STROKE : ASEAN_STROKE,
                      strokeWidth: isHighlighted ? 0.6 : 0.4,
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
                  {/* Pass 3: oversized proxy "island" for countries too tiny
                      to see/tap at this zoom (see TINY_COUNTRIES above) —
                      traces the country's real coastline, just scaled up. */}
                  {Object.entries(TINY_COUNTRIES).map(([name, { coords, path, nudgeY }]) => {
                    const isHighlighted = name === hoveredCountry || name === selectedCountry;
                    return (
                      <Marker key={`tiny-${name}`} coordinates={coords}>
                        <g
                          transform={`scale(${markerScale}) translate(0, ${nudgeY})`}
                          onClick={() => onSelectCountry(name)}
                          onMouseEnter={() => setHoveredCountry(name)}
                          onMouseLeave={() => setHoveredCountry(null)}
                          style={{ cursor: 'pointer', filter: ISLAND_SHADOW }}
                        >
                          <path d={path} fill="none" stroke={ASEAN_SAND_RING} strokeWidth={3} strokeLinejoin="round" />
                          <path
                            d={path}
                            fill={aseanFill(isHighlighted)}
                            stroke={isHighlighted ? HOVER_STROKE : ASEAN_STROKE}
                            strokeWidth={isHighlighted ? 1.2 : 0.8}
                            strokeLinejoin="round"
                          />
                        </g>
                      </Marker>
                    );
                  })}
                  {/* Pass 4: country name pill — only while that country is
                      hovered, so the map reads clean until you point at one. */}
                  {Object.entries(COUNTRY_LABEL_COORDS).map(([country, coords]) => {
                    if (country !== hoveredCountry) return null;
                    const label = country.replace(/_/g, ' ');
                    const hasFlag = Boolean(FLAG_IMAGE_BY_COUNTRY[country]);
                    // Text starts right after the flag (or at the left pad if
                    // there isn't one) instead of being centered against a
                    // fudge-factored midpoint — that's what let long labels
                    // in the wider Momo Trust Display font spill past the
                    // card's right edge.
                    const leftPad = 8;
                    const flagGap = hasFlag ? 24 : 0;
                    const textX = leftPad + flagGap;
                    const w = textX + label.length * 7.4 + 12;
                    return (
                      <Marker key={`label-${country}`} coordinates={coords}>
                        <g
                          transform={`scale(${markerScale}) translate(${-w / 2}, -13)`}
                          style={{ pointerEvents: 'none' }}
                        >
                          <rect
                            x="0"
                            y="0"
                            width={w}
                            height="26"
                            rx="7"
                            fill="rgba(255,255,255,0.97)"
                            stroke="rgba(11,61,66,0.25)"
                            strokeWidth="1"
                            style={{ filter: PILL_SHADOW }}
                          />
                          {hasFlag && (
                            <image href={FLAG_IMAGE_BY_COUNTRY[country]} x={leftPad} y="7" width="18" height="13" />
                          )}
                          <text
                            x={textX}
                            y="18"
                            textAnchor="start"
                            fontSize="12"
                            fontWeight="700"
                            fill="#1c1917"
                            className="font-momo"
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

      {/* Ambient sky layer — clouds/planes/boats drifting over the water.
          Rendered after (so painted above) the map's SVG land shapes, and
          stays fixed on screen (doesn't pan/zoom with the map) like a
          backdrop the player never interacts with. */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {SKY_DECORATIONS.map((item, i) => (
          <span
            key={i}
            aria-hidden="true"
            className={`absolute select-none ${item.kind === 'boat' ? 'floating-icon-boat' : 'floating-icon'}`}
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
    </div>
  );
}

export default AseanMap;
