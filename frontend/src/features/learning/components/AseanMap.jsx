import { useEffect, useState } from 'react';
import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps';
import { ISO_NUMERIC_TO_COUNTRY } from '../countryCodes';

const DEFAULT_CENTER = [112, 6];
const DEFAULT_ZOOM = 1;
const MIN_ZOOM = 0.3;
const MAX_ZOOM = 5;
const ARROW_PAN_DEGREES = 8;

// ASEAN-only geometry (10 countries, no rest-of-world backdrop) — the fuller
// world-50m.json this map briefly used for real-world context got deleted
// mid-session and isn't recoverable without network access; this asset is
// still tracked in git so it survives. See countryCodes.js for the ISO
// numeric -> country-name mapping.
const GEO_URL = '/assets/map/asean-countries-50m.json';

// Palette follows the pasted tropical-islands reference: lush green land
// ringed by a pale sandy "beach" halo, sitting in deep saturated turquoise
// water with a soft drop shadow for depth — replacing Map-01's flatter
// pastel-slab look. True painterly texture/palm-tree-and-rock props from
// that reference aren't reproduced here — they'd need hand-illustrated
// art, not something CSS/SVG styling can fake, and would clutter the
// country shapes this map needs to stay readable/clickable.
const OUTLINE_COLOR = 'rgba(40, 60, 45, 0.45)';
const OUTLINE_WIDTH = 1.2;
const ISLAND_SHADOW = 'drop-shadow(0 5px 4px rgba(11, 61, 66, 0.45))';
const BEACH_HALO_COLOR = '#f5ecd2';
const BEACH_HALO_WIDTH = 7;

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

function AseanMap({ selectedCountry, onSelectCountry }) {
  // Mouse-drag pan and scroll/pinch zoom (touchpad included) come for free
  // from ZoomableGroup's internal d3-zoom handling. Arrow-key panning needs
  // ZoomableGroup driven as a controlled component instead — it does watch
  // center/zoom prop changes and animate to them (confirmed by reading
  // react-simple-maps' source), so we track position ourselves and feed it
  // back via onMoveEnd after any mouse/touchpad interaction.
  const [center, setCenter] = useState(DEFAULT_CENTER);
  const [zoom, setZoom] = useState(DEFAULT_ZOOM);

  useEffect(() => {
    function handleKeyDown(event) {
      const step = ARROW_PAN_DEGREES / zoom;
      if (event.key === 'ArrowUp') setCenter(([lon, lat]) => [lon, lat + step]);
      else if (event.key === 'ArrowDown') setCenter(([lon, lat]) => [lon, lat - step]);
      else if (event.key === 'ArrowLeft') setCenter(([lon, lat]) => [lon - step, lat]);
      else if (event.key === 'ArrowRight') setCenter(([lon, lat]) => [lon + step, lat]);
      else return;
      event.preventDefault();
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [zoom]);

  return (
    <div
      className="relative h-full w-full overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #2fb8c4 0%, #0e7a8a 100%)' }}
    >
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{ scale: 750 }}
        width={800}
        height={520}
        style={{ width: '100%', height: '100%' }}
      >
        <ZoomableGroup
          center={center}
          zoom={zoom}
          minZoom={MIN_ZOOM}
          maxZoom={MAX_ZOOM}
          onMoveEnd={({ coordinates, zoom: nextZoom }) => {
            setCenter(coordinates);
            setZoom(nextZoom);
          }}
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
              </>
            )}
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>
    </div>
  );
}

export default AseanMap;
